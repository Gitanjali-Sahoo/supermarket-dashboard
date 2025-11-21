import express from "express";
import cors from "cors";
import salesRoutes from "./routes/sales.js";

const app = express();
const PORT = 8000;

// Middleware to handle JSON
app.use(cors());
app.use(express.json());
app.use("/api/sales", salesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
