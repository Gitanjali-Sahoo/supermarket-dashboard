import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// ============================
// Middleware to attach user
// ============================
router.use((req, res, next) => {
  const userId = req.headers["x-user-id"]; // Frontend should send logged-in user ID
  if (!userId) return res.status(401).json({ error: "No user ID provided" });

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(401).json({ error: "User not found" });

  req.user = user;
  next();
});

// =======================
// Get weekly sales summary
// =======================
router.get("/", (req, res) => {
  const { role, supermarket_id } = req.user;

  let rows;

  if (role === "manager") {
    rows = db
      .prepare(
        `
      SELECT s.name AS store_name,
             SUM(w.dairy) AS dairy_total,
             SUM(w.bakery) AS bakery_total,
             SUM(w.produce) AS produce_total,
             SUM(w.meat) AS meat_total,
             SUM(w.total) AS total_sales
      FROM weekly_sales w
      JOIN supermarkets s ON s.id = w.store_id
      WHERE w.store_id = ?
    `
      )
      .all(supermarket_id);
  } else {
    rows = db
      .prepare(
        `
      SELECT s.name AS store_name,
             SUM(w.dairy) AS dairy_total,
             SUM(w.bakery) AS bakery_total,
             SUM(w.produce) AS produce_total,
             SUM(w.meat) AS meat_total,
             SUM(w.total) AS total_sales
      FROM weekly_sales w
      JOIN supermarkets s ON s.id = w.store_id
      GROUP BY w.store_id
    `
      )
      .all();
  }

  res.json(rows);
});

// =======================
// Get daily sales
// =======================
router.get("/daily-sale", (req, res) => {
  const { role, supermarket_id } = req.user;

  let rows;
  if (role === "manager") {
    // Manager sees only their store
    rows = db
      .prepare(
        `
      SELECT w.day, s.name AS store_name, w.dairy, w.bakery, w.produce, w.meat
      FROM weekly_sales w
      JOIN supermarkets s ON s.id = w.store_id
      WHERE w.store_id = ?
      ORDER BY
        CASE w.day
          WHEN 'Mon' THEN 1
          WHEN 'Tue' THEN 2
          WHEN 'Wed' THEN 3
          WHEN 'Thu' THEN 4
          WHEN 'Fri' THEN 5
          WHEN 'Sat' THEN 6
          WHEN 'Sun' THEN 7
        END
    `
      )
      .all(supermarket_id);
  } else {
    // Admin sees all stores
    rows = db
      .prepare(
        `
      SELECT w.day, s.name AS store_name, w.dairy, w.bakery, w.produce, w.meat
      FROM weekly_sales w
      JOIN supermarkets s ON s.id = w.store_id
      ORDER BY
        CASE w.day
          WHEN 'Mon' THEN 1
          WHEN 'Tue' THEN 2
          WHEN 'Wed' THEN 3
          WHEN 'Thu' THEN 4
          WHEN 'Fri' THEN 5
          WHEN 'Sat' THEN 6
          WHEN 'Sun' THEN 7
        END, s.name
    `
      )
      .all();
  }

  // Transform rows into frontend-friendly structure
  const result = {};
  rows.forEach((r) => {
    if (!result[r.day]) result[r.day] = {};
    result[r.day][r.store_name] = {
      Dairy: r.dairy,
      Bakery: r.bakery,
      Produce: r.produce,
      Meat: r.meat,
    };
  });

  res.json(Object.keys(result).map((day) => ({ day, ...result[day] })));
});

// =======================
// Get weekly sales for a single store
// =======================
router.get("/:storeId", (req, res) => {
  const { storeId } = req.params;
  const { role, supermarket_id } = req.user;

  if (role === "manager" && Number(storeId) !== supermarket_id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const rows = db
    .prepare(
      `
    SELECT day, dairy, bakery, produce, meat, total
    FROM weekly_sales
    WHERE store_id = ?
    ORDER BY
      CASE day
        WHEN 'Mon' THEN 1
        WHEN 'Tue' THEN 2
        WHEN 'Wed' THEN 3
        WHEN 'Thu' THEN 4
        WHEN 'Fri' THEN 5
        WHEN 'Sat' THEN 6
        WHEN 'Sun' THEN 7
      END
  `
    )
    .all(storeId);

  res.json(rows);
});

// =======================
// Admin-only: Add weekly sales
// =======================
router.post("/add", (req, res) => {
  const { role } = req.user;
  if (role !== "admin") return res.status(403).json({ error: "Access denied" });

  const { store_id, day, dairy, bakery, produce, meat, total } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO weekly_sales (store_id, day, dairy, bakery, produce, meat, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(store_id, day, dairy, bakery, produce, meat, total);

    res.json({ message: "Weekly sales added" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
