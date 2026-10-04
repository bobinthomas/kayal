-- WhatsApp group: customers self-declare membership at checkout (same trust
-- model as onam26's member pricing). Non-members are flagged in the dashboard
-- so the admin can add them to the group by hand, then mark them added.
ALTER TABLE orders ADD COLUMN whatsapp_member INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN whatsapp_added INTEGER NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN discount_cents INTEGER NOT NULL DEFAULT 0;

-- Optional member discount (off by default; dashboard → Settings).
INSERT OR IGNORE INTO settings (key, value_json) VALUES
  ('whatsapp', '{"discountEnabled":false,"discountPercent":0}');
