import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  applyForJob,
  listMyApplications,
  countNewApplications,
} from "../controllers/applyController.js";

const router = Router();

router.post("/job/:jobId", requireAuth, applyForJob);

router.get("/mine", requireAuth, listMyApplications);

router.get("/count-new", requireAuth, countNewApplications);

export default router;
