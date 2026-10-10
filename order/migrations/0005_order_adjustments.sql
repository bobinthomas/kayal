-- Final invoice: the admin reviews each new order, adjusts quantities/prices
-- for what's actually available (e.g. 2 kg bananas -> 2.2 kg), then confirms.
-- The customer's original order is kept alongside the confirmed one.
ALTER TABLE orders ADD COLUMN original_items_json TEXT;
ALTER TABLE orders ADD COLUMN original_total_cents INTEGER;
ALTER TABLE orders ADD COLUMN adjustment_note TEXT;
ALTER TABLE orders ADD COLUMN confirmed_at TEXT;
