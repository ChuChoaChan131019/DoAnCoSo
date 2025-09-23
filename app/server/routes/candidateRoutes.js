import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { upsertCandidateProfile } from "../controllers/candidateController.js";

const router = Router();

// multipart/form-data với field name "resume"
router.post(
  "/profile",
  requireAuth,
  upload.single("resume"),
  upsertCandidateProfile
);

export default router;
