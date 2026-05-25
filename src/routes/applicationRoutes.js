import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import {
  getApplications,
  getApplicationByName,
  createApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { validateCreateApp } from "../middlewares/validators.js";

const router = Router();

router.use(protect);

router.get("/", getApplications);
router.get("/:name", getApplicationByName);
router.post("/", validateCreateApp, createApplication);
router.delete("/:name", deleteApplication);

export default router;
