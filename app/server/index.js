// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employerRoutes from "./routes/employerRoutes.js"; // NEW
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applyRoutes from "./routes/applyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

// cấu hình CORS cho frontend React
app.use(
  cors({
    origin: [
      "https://8mr2vx2h-3000.asse.devtunnels.ms",
      "https://8mr2vx2h-5000.asse.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the OiJobOii API." });
});

// phục vụ file tĩnh (logo, ảnh upload)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// test backend
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/employer", employerRoutes); // NEW
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/notifications", notificationRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});