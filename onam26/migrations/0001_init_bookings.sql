CREATE TABLE bookings (
  id             TEXT PRIMARY KEY,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  service_type   TEXT NOT NULL CHECK (service_type IN ('dine_in','takeaway')),
  event_date     TEXT NOT NULL,
  guests         INTEGER,
  package_size   INTEGER,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('whatsapp_cash','card')),
  price_total    INTEGER NOT NULL,
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','declined'))
);

CREATE INDEX idx_bookings_event_date ON bookings (event_date);
CREATE INDEX idx_bookings_status ON bookings (status);
