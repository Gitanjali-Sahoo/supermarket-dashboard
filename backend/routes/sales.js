import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// -------------------- GET ALL SALES --------------------
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM sales").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- TOTAL REVENUE --------------------
router.get("/revenue", (req, res) => {
  try {
    const row = db
      .prepare(
        `
      SELECT SUM(total_sales) AS revenue
      FROM sales
    `
      )
      .get();

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- REVENUE BY STORE --------------------
router.get("/revenue/store", (req, res) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT store, SUM(total_sales) AS revenue
      FROM sales
      GROUP BY store
    `
      )
      .all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- DAILY REVENUE --------------------
router.get("/revenue/daily", (req, res) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT date, SUM(total_sales) AS revenue
      FROM sales
      GROUP BY date
    `
      )
      .all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- CATEGORY BREAKDOWN --------------------
router.get("/categories", (req, res) => {
  try {
    const row = db
      .prepare(
        `
      SELECT
        SUM(fruits) AS fruits,
        SUM(dairy) AS dairy,
        SUM(snacks) AS snacks,
        SUM(household) AS household
      FROM sales
    `
      )
      .get();

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
