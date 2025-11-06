import express from "express";
import { getAllCompanies, getCompanyById } from "../controllers/companyController.js";

const router = express.Router();

// ⚠️ Quan trọng: route '/detail/:id' phải đặt TRƯỚC '/' để Express không nhầm
router.get("/:id", getCompanyById);

// Lấy danh sách công ty
router.get("/", getAllCompanies);

export default router;