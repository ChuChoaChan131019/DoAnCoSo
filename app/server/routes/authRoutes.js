import express from "express";
import {
  login,
  register,
  resetPasswordDirect,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password-direct", resetPasswordDirect);

export default router;
