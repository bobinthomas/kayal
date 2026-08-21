CREATE TABLE availability_blocks (
  id           TEXT PRIMARY KEY,
  created_at   TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('dine_in','takeaway')),
  event_date   TEXT NOT NULL,
  time_slot    TEXT NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX idx_availability_blocks_unique
  ON availability_blocks (service_type, event_date, time_slot);

-- Migrate the stopgap block added by hand before this admin UI existed.
INSERT INTO availability_blocks (id, created_at, service_type, event_date, time_slot)
VALUES (lower(hex(randomblob(16))), datetime('now'), 'dine_in', '2026-08-23', '13:00');
