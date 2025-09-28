// server/routes/employerRoutes.js
import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import { uploadLogo } from "../middlewares/logoUpload.js";
import {
  getMyEmployer,
  upsertMyEmployer,
} from "../controllers/employerController.js";

const router = express.Router();
router.get("/me", requireAuth, getMyEmployer);
router.post("/me", requireAuth, uploadLogo.single("logo"), upsertMyEmployer);
export default router;
