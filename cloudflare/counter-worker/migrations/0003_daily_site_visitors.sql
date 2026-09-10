-- Keep historical aggregates. Only new visits use daily browser deduplication.
CREATE TABLE IF NOT EXISTS daily_site_visitors (
    day TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    PRIMARY KEY (day, visitor_id)
) WITHOUT ROWID;

DROP TRIGGER IF EXISTS increment_page_view_totals;
CREATE TRIGGER increment_page_view_totals
AFTER INSERT ON page_view_events
BEGIN
    INSERT INTO post_totals (path, views)
    SELECT NEW.path, 1 WHERE NEW.path IS NOT NULL
    ON CONFLICT(path) DO UPDATE SET views = views + 1;
END;

CREATE TRIGGER IF NOT EXISTS increment_daily_visitor_totals
AFTER INSERT ON daily_site_visitors
BEGIN
    UPDATE site_totals SET views = views + 1 WHERE id = 1;
    INSERT INTO daily_totals (day, views) VALUES (NEW.day, 1)
    ON CONFLICT(day) DO UPDATE SET views = views + 1;
END;
