CREATE TABLE IF NOT EXISTS wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  list_type TEXT NOT NULL CHECK (list_type IN ('christmas', 'main')),
  name TEXT NOT NULL,
  wishlist TEXT NOT NULL DEFAULT 'General',
  category TEXT NOT NULL DEFAULT 'Other',
  brand TEXT NOT NULL DEFAULT '',
  store TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  date_added TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  price REAL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 99),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  purchased INTEGER NOT NULL DEFAULT 0 CHECK (purchased IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_list_sort
  ON wishlist_items (list_type, purchased, priority, created_at);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_category
  ON wishlist_items (list_type, category);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_group
  ON wishlist_items (list_type, wishlist);
