import express from "express";
import { getAllCompanies, getCompanyById } from "../controllers/companyController.js";

const router = express.Router();

router.get("/:id", getCompanyById);

router.get("/", getAllCompanies);

export default router;