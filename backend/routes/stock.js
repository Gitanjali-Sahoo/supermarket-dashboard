import express from "express";
import db from "../db/connection.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All stock levels
router.get("/", (req, res) => {
  const rows = db
    .prepare(
      `
    SELECT s.name AS store, st.*
    FROM stock_levels st
    JOIN supermarkets s ON s.id = st.store_id
  `
    )
    .all();
  res.json(rows);
});

// Low stock alert (threshold 500)
// router.get("/low-stock", (req, res) => {
//   const threshold = parseInt(req.query.threshold) || 500;

//   const rows = db
//     .prepare(
//       `
//       SELECT s.name AS store,
//              CASE WHEN st.dairy_stock < ? THEN st.dairy_stock ELSE NULL END AS dairy_stock,
//              CASE WHEN st.bakery_stock < ? THEN st.bakery_stock ELSE NULL END AS bakery_stock,
//              CASE WHEN st.produce_stock < ? THEN st.produce_stock ELSE NULL END AS produce_stock,
//              CASE WHEN st.meat_stock < ? THEN st.meat_stock ELSE NULL END AS meat_stock
//       FROM stock_levels st
//       JOIN supermarkets s ON s.id = st.store_id
//       WHERE st.dairy_stock < ? OR st.bakery_stock < ? OR st.produce_stock < ? OR st.meat_stock < ?
//     `
//     )
//     .all(
//       threshold,
//       threshold,
//       threshold,
//       threshold,
//       threshold,
//       threshold,
//       threshold,
//       threshold
//     );

//   res.json(rows);
// });
router.get("/low-stock", (req, res) => {
  const threshold = parseInt(req.query.threshold) || 500;

  const rows = db
    .prepare(
      `
      SELECT s.name AS store, st.dairy_stock, st.bakery_stock, st.produce_stock, st.meat_stock
      FROM stock_levels st
      JOIN supermarkets s ON s.id = st.store_id
    `
    )
    .all();

  // Transform to only include low-stock items
  const lowStock = [];

  rows.forEach((row) => {
    if (row.dairy_stock < threshold) {
      lowStock.push({
        store: row.store,
        item: "dairy",
        stock: row.dairy_stock,
      });
    }
    if (row.bakery_stock < threshold) {
      lowStock.push({
        store: row.store,
        item: "bakery",
        stock: row.bakery_stock,
      });
    }
    if (row.produce_stock < threshold) {
      lowStock.push({
        store: row.store,
        item: "produce",
        stock: row.produce_stock,
      });
    }
    if (row.meat_stock < threshold) {
      lowStock.push({ store: row.store, item: "meat", stock: row.meat_stock });
    }
  });

  res.json(lowStock);
});

export default router;
