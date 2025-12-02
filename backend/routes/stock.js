import express from "express";
import db from "../db/connection.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Get all stock levels
router.get("/", (req, res) => {
  const user = req.user;

  let query = `
    SELECT s.name AS store, st.*
    FROM stock_levels st
    JOIN supermarkets s ON s.id = st.store_id
  `;

  let rows;
  if (user.role === "admin") {
    rows = db.prepare(query).all(); // admin sees all stores
  } else if (user.role === "manager") {
    query += " WHERE st.store_id = ?";
    rows = db.prepare(query).all(user.store_id); // manager sees only their store
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json(rows);
});

// Get low-stock items
router.get("/low-stock", (req, res) => {
  const user = req.user;
  const threshold = parseInt(req.query.threshold) || 500;

  let query = `
    SELECT s.name AS store, st.dairy_stock, st.bakery_stock, st.produce_stock, st.meat_stock
    FROM stock_levels st
    JOIN supermarkets s ON s.id = st.store_id
  `;

  let rows;
  if (user.role === "admin") {
    rows = db.prepare(query).all();
  } else if (user.role === "manager") {
    query += " WHERE st.store_id = ?";
    rows = db.prepare(query).all(user.store_id);
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const lowStock = [];
  rows.forEach((row) => {
    if (row.dairy_stock < threshold)
      lowStock.push({
        store: row.store,
        item: "dairy",
        stock: row.dairy_stock,
      });
    if (row.bakery_stock < threshold)
      lowStock.push({
        store: row.store,
        item: "bakery",
        stock: row.bakery_stock,
      });
    if (row.produce_stock < threshold)
      lowStock.push({
        store: row.store,
        item: "produce",
        stock: row.produce_stock,
      });
    if (row.meat_stock < threshold)
      lowStock.push({ store: row.store, item: "meat", stock: row.meat_stock });
  });

  res.json(lowStock);
});

export default router;
