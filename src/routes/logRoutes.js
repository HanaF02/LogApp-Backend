import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { getLogs, postLog } from "../controllers/logController.js";
import { validatePostLog } from "../middlewares/validators.js";

const router = Router();

router.get("/:name/logs", protect, getLogs);
router.post("/:name/logs", validatePostLog, postLog);

export default router;
