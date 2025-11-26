import express from "express";
import db from "../db/connection.js"; // your SQLite connection

const router = express.Router();

// Register user
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
    );
    stmt.run(name, email, password, role || "user");
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const user = stmt.get(email);

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ id: user.id, name: user.name, role: user.role });
});

export default router;
