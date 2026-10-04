CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL
);

CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  areas TEXT,
  fee_cents INTEGER NOT NULL DEFAULT 0,
  free_over_cents INTEGER NOT NULL DEFAULT 0,
  eta_minutes INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  blurb TEXT,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  available INTEGER NOT NULL DEFAULT 1,
  listed INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE counters (
  name TEXT PRIMARY KEY,
  n INTEGER NOT NULL
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  access_token TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfilment TEXT NOT NULL CHECK (fulfilment IN ('delivery', 'pickup')),
  address TEXT,
  zone_id TEXT,
  notes TEXT,
  items_json TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  fee_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  idempotency_key TEXT UNIQUE
);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE TABLE payment_proofs (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  receipt_key TEXT,
  txn_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'clarify')),
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_proofs_order ON payment_proofs(order_id);

CREATE TABLE notification_logs (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  event TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
