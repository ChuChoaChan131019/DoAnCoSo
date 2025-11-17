import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import {
  upsertCandidateProfile,
  getAppliedCandidates,
  getCandidateProfile,
} from "../controllers/candidateController.js";

const router = Router();

router.post(
  "/profile",
  requireAuth,
  upload.single("resume"),
  upsertCandidateProfile
);

router.get("/profile/me", requireAuth, getCandidateProfile);

router.get("/list", requireAuth, getAppliedCandidates);

export default router;