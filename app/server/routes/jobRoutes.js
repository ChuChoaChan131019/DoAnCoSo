// server/routes/jobRoutes.js
import { Router } from "express";
import {createJob, listMyJobs, listAllJobs, updateJob, getJobById } from "../controllers/jobController.js";
import { requireAuth } from "../middlewares/auth.js"; // đã có sẵn (em dùng ở employer)

const router = Router();

// Tạo job (employer đang đăng nhập)
router.get("/", listAllJobs);
router.post("/", requireAuth, createJob);
router.get("/mine", requireAuth, listMyJobs);
router.get("/:id", getJobById);
router.put("/:id", requireAuth, updateJob);
export default router;