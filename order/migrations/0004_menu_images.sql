-- Dish photos for the storefront. Paths are served from order/public; the
-- admin can set any image URL per item (dashboard → Menu → Edit).
ALTER TABLE menu_items ADD COLUMN image_url TEXT;

UPDATE menu_items SET image_url = '/images/dishes/kerala-fish-curry.webp' WHERE id = 'kerala-fish-curry';
UPDATE menu_items SET image_url = '/images/dishes/kappa-biryani.webp' WHERE id = 'kappa-biryani';
UPDATE menu_items SET image_url = '/images/dishes/chatti-choru.webp' WHERE id = 'chatti-choru';
UPDATE menu_items SET image_url = '/images/dishes/meen-pollichathu.webp' WHERE id = 'meen-pollichathu';
UPDATE menu_items SET image_url = '/images/dishes/kizhi-porotta.webp' WHERE id IN ('kizhi-porotta', 'new-item-1787304992593');
