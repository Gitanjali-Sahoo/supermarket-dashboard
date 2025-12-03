import db from "../db/connection.js";

// Require user to be logged in
// // Middleware to get user from x-user-id header
export const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId)
    return res.status(401).json({ error: "Unauthorized: No user ID" });

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user)
    return res.status(401).json({ error: "Unauthorized: User not found" });

  req.user = user; // attach user to request

  next();
};
// Simple admin check
export const adminOnly = (req, res, next) => {
  const user = req.body.user || req.user; // assume frontend sends user in body
  if (!user) return res.status(401).json({ error: "No user provided" });
  if (user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
};
