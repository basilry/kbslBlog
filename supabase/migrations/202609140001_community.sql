-- Run once in the blog's dedicated Supabase project. Existing blog/GitHub data is untouched.
begin;

create table public.community_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null check (char_length(display_name) between 1 and 30)
);
-- Only the project operator can grant this role; never use editable user_metadata.
create table public.community_moderators (
    user_id uuid primary key references auth.users(id) on delete cascade
);
create table public.community_comments (
    id uuid primary key,
    post_key text not null check (post_key ~ '^post/[a-z0-9]+(-[a-z0-9]+)*$'),
    author_id uuid references auth.users(id) on delete set null,
    author_name text not null check (char_length(author_name) between 1 and 30),
    body text not null check (char_length(body) <= 2000),
    parent_id uuid references public.community_comments(id),
    status text not null default 'visible' check (status in ('visible', 'deleted', 'hidden')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create index community_comments_post on public.community_comments(post_key, created_at desc, id);
create index community_comments_parent on public.community_comments(parent_id, created_at);
create table public.community_reports (
    comment_id uuid references public.community_comments(id) on delete cascade,
    reporter_id uuid references auth.users(id) on delete cascade,
    reason text not null check (reason in ('spam', 'abuse', 'other')),
    created_at timestamptz not null default now(),
    primary key (comment_id, reporter_id)
);
create table public.community_likes (
    post_key text not null check (post_key ~ '^post/[a-z0-9]+(-[a-z0-9]+)*$'),
    browser_hash text not null check (browser_hash ~ '^[a-f0-9]{64}$'),
    created_at timestamptz not null default now(),
    primary key (post_key, browser_hash)
);
create table public.community_rate_limits (
    subject text primary key,
    window_start timestamptz not null,
    hits integer not null
);
create index community_rate_limits_expiry on public.community_rate_limits(window_start);

alter table public.community_profiles enable row level security;
alter table public.community_moderators enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_rate_limits enable row level security;
-- Access goes through verified Next.js route handlers. No browser role has table access.
revoke all on public.community_profiles, public.community_moderators, public.community_comments,
    public.community_reports, public.community_likes, public.community_rate_limits from public, anon, authenticated;

create function public.community_consume_limit(p_subject text, p_limit integer) returns void
language plpgsql security definer set search_path = '' as $$
declare v_hits integer;
begin
    delete from public.community_rate_limits where window_start < now() - interval '7 days';
    insert into public.community_rate_limits(subject, window_start, hits)
    values (p_subject, date_trunc('minute', now()), 1)
    on conflict(subject) do update set
        window_start = excluded.window_start,
        hits = case when community_rate_limits.window_start < excluded.window_start then 1 else community_rate_limits.hits + 1 end
    where community_rate_limits.window_start < excluded.window_start or community_rate_limits.hits < p_limit
    returning hits into v_hits;
    if v_hits is null then raise exception 'rate_limited'; end if;
end;
$$;

create function public.community_comment_json(p_comment public.community_comments, p_user_id uuid, p_moderator boolean)
returns jsonb language sql stable security definer set search_path = '' as $$
    select jsonb_build_object(
        'id', p_comment.id, 'parentId', p_comment.parent_id,
        'name', case when p_comment.status = 'deleted' then '' else p_comment.author_name end,
        'body', case when p_comment.status = 'visible' or (p_moderator and p_comment.status = 'hidden') then p_comment.body else '' end,
        'status', p_comment.status, 'createdAt', p_comment.created_at, 'updatedAt', p_comment.updated_at,
        'mine', coalesce(p_comment.author_id = p_user_id, false),
        'author', exists(select 1 from public.community_moderators where user_id = p_comment.author_id),
        'reported', exists(select 1 from public.community_reports where comment_id = p_comment.id and reporter_id = p_user_id),
        'reportCount', case when p_moderator then (select count(*) from public.community_reports where comment_id = p_comment.id) else 0 end
    );
$$;

create function public.community_snapshot(p_post_key text, p_browser_hash text, p_user_id uuid, p_offset integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_moderator boolean; v_comments jsonb;
begin
    if p_offset < 0 or p_offset > 100000 then raise exception 'invalid_input'; end if;
    select exists(select 1 from public.community_moderators where user_id = p_user_id) into v_moderator;
    select coalesce(jsonb_agg(item order by created_at desc, id desc), '[]'::jsonb) into v_comments
    from (
        select c.id, c.created_at,
            public.community_comment_json(c, p_user_id, v_moderator) || jsonb_build_object('replies', (
                select coalesce(jsonb_agg(public.community_comment_json(r, p_user_id, v_moderator) order by r.created_at, r.id), '[]'::jsonb)
                from public.community_comments r where r.parent_id = c.id
            )) as item
        from public.community_comments c where c.post_key = p_post_key and c.parent_id is null
        order by c.created_at desc, c.id desc limit 10 offset p_offset
    ) page;
    return jsonb_build_object(
        'likes', (select count(*) from public.community_likes where post_key = p_post_key),
        'liked', exists(select 1 from public.community_likes where post_key = p_post_key and browser_hash = p_browser_hash),
        'commentCount', (select count(*) from public.community_comments where post_key = p_post_key and status = 'visible'),
        'comments', v_comments,
        'hasMore', (select count(*) > p_offset + 10 from public.community_comments where post_key = p_post_key and parent_id is null),
        'moderator', v_moderator,
        'displayName', (select display_name from public.community_profiles where user_id = p_user_id)
    );
end;
$$;

create function public.community_write(p_post_key text, p_browser_hash text, p_user_id uuid, p_action text, p_payload jsonb, p_network_hash text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
    v_comment public.community_comments; v_parent public.community_comments;
    v_id uuid; v_parent_id uuid; v_body text; v_name text; v_moderator boolean;
begin
    if p_post_key is null or p_post_key !~ '^post/[a-z0-9]+(-[a-z0-9]+)*$' or p_browser_hash is null or p_browser_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_input'; end if;
    if p_network_hash is not null then
        if p_network_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_input'; end if;
        perform public.community_consume_limit('network:' || p_network_hash, 60);
    end if;
    if p_action = 'like' then
        if jsonb_typeof(p_payload->'liked') is distinct from 'boolean' then raise exception 'invalid_input'; end if;
        perform public.community_consume_limit('like:' || p_browser_hash, 30);
        if (p_payload->>'liked')::boolean then
            insert into public.community_likes(post_key, browser_hash) values (p_post_key, p_browser_hash) on conflict do nothing;
        else
            delete from public.community_likes where post_key = p_post_key and browser_hash = p_browser_hash;
        end if;
        return;
    end if;
    if p_user_id is null then raise exception 'unauthorized'; end if;
    select exists(select 1 from public.community_moderators where user_id = p_user_id) into v_moderator;
    -- This row also serializes each user's writes. The limiter is shared across posts/instances.
    perform public.community_consume_limit('write:' || p_user_id::text, 20);
    v_id := (p_payload->>'id')::uuid;
    if v_id is null then raise exception 'invalid_input'; end if;
    select * into v_comment from public.community_comments where id = v_id for update;

    if p_action = 'create' then
        -- A retry uses the same client-generated UUID; it must never duplicate or claim another comment.
        if v_comment.id is not null then
            if v_comment.author_id = p_user_id and v_comment.post_key = p_post_key then return; end if;
            raise exception 'forbidden';
        end if;
        v_body := btrim(p_payload->>'body'); v_name := btrim(p_payload->>'name');
        if v_body is null or char_length(v_body) not between 1 and 2000 or v_name is null or char_length(v_name) not between 1 and 30 then raise exception 'invalid_input'; end if;
        perform public.community_consume_limit('create:' || p_user_id::text, 5);
        v_parent_id := (p_payload->>'parentId')::uuid;
        if v_parent_id is not null then
            select * into v_parent from public.community_comments where id = v_parent_id for update;
            if v_parent.id is null or v_parent.post_key <> p_post_key or v_parent.parent_id is not null or v_parent.status <> 'visible' then raise exception 'invalid_parent'; end if;
            if (select count(*) from public.community_comments where parent_id = v_parent_id) >= 50 then raise exception 'thread_full'; end if;
        end if;
        insert into public.community_profiles(user_id, display_name) values(p_user_id, v_name)
            on conflict(user_id) do update set display_name = excluded.display_name;
        insert into public.community_comments(id, post_key, author_id, author_name, body, parent_id)
            values(v_id, p_post_key, p_user_id, v_name, v_body, v_parent_id);
        return;
    end if;

    if v_comment.id is null or v_comment.post_key <> p_post_key then raise exception 'not_found'; end if;
    if p_action in ('edit', 'delete') then
        if v_comment.author_id is distinct from p_user_id then raise exception 'forbidden'; end if;
        if p_action = 'delete' then
            update public.community_comments set body = '', status = 'deleted', updated_at = now() where id = v_id;
        else
            if v_comment.status <> 'visible' then raise exception 'forbidden'; end if;
            v_body := btrim(p_payload->>'body');
            if v_body is null or char_length(v_body) not between 1 and 2000 then raise exception 'invalid_input'; end if;
            if p_payload->>'updatedAt' is null or (p_payload->>'updatedAt')::timestamptz <> v_comment.updated_at then raise exception 'conflict'; end if;
            update public.community_comments set body = v_body, updated_at = now() where id = v_id;
        end if;
    elsif p_action = 'report' then
        if v_comment.status <> 'visible' or v_comment.author_id = p_user_id then raise exception 'forbidden'; end if;
        if coalesce(p_payload->>'reason', '') not in ('spam', 'abuse', 'other') then raise exception 'invalid_input'; end if;
        insert into public.community_reports(comment_id, reporter_id, reason) values(v_id, p_user_id, p_payload->>'reason') on conflict do nothing;
    elsif p_action in ('hide', 'restore') then
        if not v_moderator then raise exception 'forbidden'; end if;
        if v_comment.status = 'deleted' then raise exception 'forbidden'; end if;
        update public.community_comments set status = case when p_action = 'hide' then 'hidden' else 'visible' end, updated_at = now() where id = v_id;
    else raise exception 'invalid_input';
    end if;
end;
$$;

revoke all on function public.community_consume_limit(text, integer) from public, anon, authenticated;
revoke all on function public.community_comment_json(public.community_comments, uuid, boolean) from public, anon, authenticated;
revoke all on function public.community_snapshot(text, text, uuid, integer) from public, anon, authenticated;
revoke all on function public.community_write(text, text, uuid, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.community_snapshot(text, text, uuid, integer) to service_role;
grant execute on function public.community_write(text, text, uuid, text, jsonb, text) to service_role;
commit;
