-- ============================
-- 1. USERS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','manager')),
    supermarket_id INTEGER,
    FOREIGN KEY (supermarket_id) REFERENCES supermarkets(id)
);


-- ============================
-- 2. SUPERMARKETS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS supermarkets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- ============================
-- 3. WEEKLY SALES TABLE
-- ============================

CREATE TABLE IF NOT EXISTS weekly_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    dairy INTEGER NOT NULL,
    bakery INTEGER NOT NULL,
    produce INTEGER NOT NULL,
    meat INTEGER NOT NULL,
    total INTEGER NOT NULL,
    FOREIGN KEY (store_id) REFERENCES supermarkets(id)
);

-- ============================
-- INSERT STORES
-- ============================

INSERT INTO supermarkets (name) VALUES
('ICA'),
('Lidl'),
('Willys'),
('Coop');

-- =======================================================
-- INSERT WEEKLY SALES FOR ICA (store_id = 1)
-- =======================================================

INSERT INTO weekly_sales (store_id, day, dairy, bakery, produce, meat, total) VALUES
(1, 'Mon', 150000, 110000, 200000, 160000, 620000),
(1, 'Tue', 148000, 108000, 198000, 158000, 612000),
(1, 'Wed', 155000, 115000, 210000, 165000, 645000),
(1, 'Thu', 152000, 112000, 205000, 162000, 631000),
(1, 'Fri', 165000, 120000, 220000, 170000, 675000),
(1, 'Sat', 170000, 125000, 230000, 180000, 705000),
(1, 'Sun', 175000, 128000, 240000, 185000, 728000);

-- =======================================================
-- INSERT WEEKLY SALES FOR LIDL (store_id = 2)
-- =======================================================

INSERT INTO weekly_sales (store_id, day, dairy, bakery, produce, meat, total) VALUES
(2, 'Mon', 100000, 80000, 130000, 95000, 405000),
(2, 'Tue', 97000, 78000, 128000, 92000, 395000),
(2, 'Wed', 105000, 82000, 135000, 98000, 420000),
(2, 'Thu', 102000, 81000, 132000, 97000, 412000),
(2, 'Fri', 110000, 85000, 140000, 103000, 438000),
(2, 'Sat', 115000, 87000, 145000, 108000, 455000),
(2, 'Sun', 118000, 89000, 148000, 112000, 467000);

-- =======================================================
-- INSERT WEEKLY SALES FOR WILLYS (store_id = 3)
-- =======================================================

INSERT INTO weekly_sales (store_id, day, dairy, bakery, produce, meat, total) VALUES
(3, 'Mon', 130000, 95000, 160000, 125000, 510000),
(3, 'Tue', 128000, 93000, 158000, 122000, 501000),
(3, 'Wed', 135000, 98000, 165000, 128000, 526000),
(3, 'Thu', 132000, 96000, 162000, 126000, 516000),
(3, 'Fri', 140000, 100000, 170000, 133000, 543000),
(3, 'Sat', 145000, 102000, 175000, 138000, 560000),
(3, 'Sun', 150000, 105000, 180000, 142000, 577000);

-- =======================================================
-- INSERT WEEKLY SALES FOR COOP (store_id = 4)
-- =======================================================

INSERT INTO weekly_sales (store_id, day, dairy, bakery, produce, meat, total) VALUES
(4, 'Mon', 110000, 85000, 140000, 105000, 440000),
(4, 'Tue', 108000, 83000, 138000, 102000, 431000),
(4, 'Wed', 115000, 88000, 145000, 108000, 456000),
(4, 'Thu', 112000, 86000, 142000, 106000, 446000),
(4, 'Fri', 120000, 90000, 150000, 112000, 472000),
(4, 'Sat', 125000, 93000, 155000, 118000, 491000),
(4, 'Sun', 128000, 95000, 158000, 120000, 501000);

-- =======================================================
-- Stock Levels
-- =======================================================
CREATE TABLE IF NOT EXISTS stock_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL,
    dairy_stock INTEGER NOT NULL,
    bakery_stock INTEGER NOT NULL,
    produce_stock INTEGER NOT NULL,
    meat_stock INTEGER NOT NULL,
    last_updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES supermarkets(id)
);

-- =======================================================
-- Insert initial stock levels
-- =======================================================

INSERT INTO stock_levels (store_id, dairy_stock, bakery_stock, produce_stock, meat_stock) VALUES
(1, 1000, 800, 1200, 900),  -- ICA
(2, 700, 500, 900, 600),    -- Lidl
(3, 1200, 950, 1400, 1100), -- Willys
(4, 600, 700, 1000, 650);   -- Coop
