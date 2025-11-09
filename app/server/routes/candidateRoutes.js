import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import {
  upsertCandidateProfile,
  getAllCandidates,
} from "../controllers/candidateController.js";

const router = Router();

// Ứng viên cập nhật hồ sơ cá nhân
router.post(
  "/profile",
  requireAuth,
  upload.single("resume"),
  upsertCandidateProfile
);

// Employer xem danh sách ứng viên
router.get("/list", requireAuth, getAllCandidates);

export default router;