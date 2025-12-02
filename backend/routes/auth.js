import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// ================================
// Register User (Admin or Manager)
// ================================
router.post("/register", (req, res) => {
  const { name, email, password, role, supermarket_id } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, supermarket_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      name,
      email,
      password, // later replace with hashed password
      role || "manager", // default manager
      role === "admin" ? null : supermarket_id // admin has no store
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Email already exists" });
  }
});

// ================================
// Login User
// ================================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const user = stmt.get(email);

  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  let supermarketName = null;

  if (user.supermarket_id) {
    const store = db
      .prepare("SELECT name FROM supermarkets WHERE id = ?")
      .get(user.supermarket_id);

    supermarketName = store ? store.name : null;
  }

  // store in session later — for now return
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    supermarket_id: user.supermarket_id,
    supermarket_name: supermarketName,
  });
});

export default router;
