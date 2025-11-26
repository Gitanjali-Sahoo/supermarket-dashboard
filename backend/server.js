import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import supermarketsRoutes from "./routes/store.js";
import salesRoutes from "./routes/sales.js";
import stockRoutes from "./routes/stock.js";

const app = express();
const PORT = 8000;

// Middleware to handle JSON
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/supermarkets", supermarketsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/stock", stockRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
