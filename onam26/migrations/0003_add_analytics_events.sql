CREATE TABLE analytics_events (
  id         TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  step       TEXT,
  detail     TEXT
);

CREATE INDEX idx_analytics_session ON analytics_events (session_id);
CREATE INDEX idx_analytics_event_name ON analytics_events (event_name);
CREATE INDEX idx_analytics_created_at ON analytics_events (created_at);
