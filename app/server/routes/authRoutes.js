import express from "express";
import {
  login,
  register,
  resetPasswordDirect,
  changePassword,
} from "../controllers/authController.js";

import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password-direct", resetPasswordDirect);
router.put("/change-password", requireAuth, changePassword);

export default router;