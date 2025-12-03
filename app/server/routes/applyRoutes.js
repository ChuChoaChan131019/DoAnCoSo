import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  applyForJob,
  listMyApplications,
  countNewApplications,
  updateApplicationStatus,
} from "../controllers/applyController.js";

const router = Router();

router.post("/job/:jobId", requireAuth, applyForJob);

router.get("/mine", requireAuth, listMyApplications);

router.get("/count-new", requireAuth, countNewApplications);

router.put("/status/:jobId/:candidateId", requireAuth, updateApplicationStatus);

export default router;
