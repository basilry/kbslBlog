-- Preserve the old aggregates as the starting point. Unrecorded repeat views
-- from before this migration cannot be reconstructed.
CREATE TABLE IF NOT EXISTS site_totals (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
);
INSERT OR IGNORE INTO site_totals (id, views)
SELECT 1, COUNT(*) FROM all_visitors;

CREATE TABLE IF NOT EXISTS daily_totals (
    day TEXT PRIMARY KEY,
    views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
) WITHOUT ROWID;
INSERT OR IGNORE INTO daily_totals (day, views)
SELECT day, COUNT(*) FROM daily_visitors GROUP BY day;

-- An ID belongs to a single page opening, never to a person or browser.
-- Re-delivering that same request is safe; every new opening has a new ID.
CREATE TABLE IF NOT EXISTS page_view_events (
    event_id TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    path TEXT,
    created_at TEXT NOT NULL
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS page_view_events_day ON page_view_events (day);

CREATE TRIGGER IF NOT EXISTS increment_page_view_totals
AFTER INSERT ON page_view_events
BEGIN
    UPDATE site_totals SET views = views + 1 WHERE id = 1;
    INSERT INTO daily_totals (day, views) VALUES (NEW.day, 1)
    ON CONFLICT(day) DO UPDATE SET views = views + 1;
    INSERT INTO post_totals (path, views)
    SELECT NEW.path, 1 WHERE NEW.path IS NOT NULL
    ON CONFLICT(path) DO UPDATE SET views = views + 1;
END;
