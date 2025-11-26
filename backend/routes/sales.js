import express from "express";
import db from "../db/connection.js";
import { adminOnly } from "../middleware/authMiddleware.js"; // optional

const router = express.Router();

// =======================
// Get weekly sales for all stores (summary)
// =======================
router.get("/", (req, res) => {
  const rows = db
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

  res.json(rows);
});

router.get("/daily-sale", (req, res) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT
        day,
        s.name AS store_name,
        dairy,
        bakery,
        produce,
        meat
      FROM weekly_sales w
      JOIN supermarkets s ON s.id = w.store_id
      ORDER BY
        CASE day
          WHEN 'Mon' THEN 1
          WHEN 'Tue' THEN 2
          WHEN 'Wed' THEN 3
          WHEN 'Thu' THEN 4
          WHEN 'Fri' THEN 5
          WHEN 'Sat' THEN 6
          WHEN 'Sun' THEN 7
        END,
        store_name
    `
      )
      .all();

    // Optional: group by day for easier frontend consumption
    const groupedByDay = rows.reduce((acc, curr) => {
      if (!acc[curr.day]) acc[curr.day] = {};
      acc[curr.day][curr.store_name] = {
        Dairy: curr.dairy,
        Bakery: curr.bakery,
        Produce: curr.produce,
        Meat: curr.meat,
      };
      return acc;
    }, {});

    // Convert to array of { day, ICA, Lidl, Willys, Coop }
    const result = Object.entries(groupedByDay).map(([day, stores]) => ({
      day,
      ICA: stores.ICA || { Dairy: 0, Bakery: 0, Produce: 0, Meat: 0 },
      Lidl: stores.Lidl || { Dairy: 0, Bakery: 0, Produce: 0, Meat: 0 },
      Willys: stores.Willys || { Dairy: 0, Bakery: 0, Produce: 0, Meat: 0 },
      Coop: stores.Coop || { Dairy: 0, Bakery: 0, Produce: 0, Meat: 0 },
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily sales" });
  }
});
// =======================
// Get weekly sales for a single store
// =======================
router.get("/:storeId", (req, res) => {
  const { storeId } = req.params;

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
// Optional: Admin-only route for adding sales
// =======================
router.post("/add", adminOnly, (req, res) => {
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
