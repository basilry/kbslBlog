CREATE TABLE IF NOT EXISTS all_visitors (
    visitor_hash TEXT PRIMARY KEY,
    created_at TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS daily_visitors (
    day TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (day, visitor_hash)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS post_view_dedupe (
    day TEXT NOT NULL,
    path TEXT NOT NULL,
    visitor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (day, path, visitor_hash)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS post_totals (
    path TEXT PRIMARY KEY,
    views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
) WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS increment_post_total
AFTER INSERT ON post_view_dedupe
BEGIN
    INSERT INTO post_totals (path, views) VALUES (NEW.path, 1)
    ON CONFLICT(path) DO UPDATE SET views = views + 1;
END;
