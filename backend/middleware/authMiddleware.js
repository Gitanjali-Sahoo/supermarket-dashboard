// middleware/authMiddleware.js

// Simple admin check
export const adminOnly = (req, res, next) => {
  const user = req.body.user || req.user; // assume frontend sends user in body
  if (!user) return res.status(401).json({ error: "No user provided" });
  if (user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
};
