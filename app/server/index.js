import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // cho phép frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// phục vụ file tĩnh đã upload
import path from "path";
import { fileURLToPath } from "url";               // NEW
const __filename = fileURLToPath(import.meta.url); // NEW
const __dirname = path.dirname(__filename);        // NEW

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // NEW
// test backend
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});