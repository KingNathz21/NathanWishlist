-- Preserve each item's starting price and record the last automated price check.
ALTER TABLE wishlist_items ADD COLUMN original_price REAL;
ALTER TABLE wishlist_items ADD COLUMN price_checked_at TEXT;

-- Existing prices become the protected original prices.
UPDATE wishlist_items SET original_price = price WHERE original_price IS NULL;
