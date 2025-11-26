import express from "express";
import db from "../db/connection.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a store (admin only)
router.post("/add", adminOnly, (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO supermarkets (name) VALUES (?)");
    stmt.run(name);
    res.json({ message: "Store added" });
  } catch (err) {
    res.status(400).json({ error: "Store already exists" });
  }
});

// Get all stores
router.get("/", (req, res) => {
  const stmt = db.prepare("SELECT * FROM supermarkets");
  const stores = stmt.all();
  res.json(stores);
});

export default router;
