import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addDialogue,
  enableSummary,
  generateSummaryFile,
} from "../controllers/summary.controller";
import { generateSummary } from "../middlewares/generateSummary";

const router = Router();

router.route("/add-dialogue").patch(addDialogue);
router.use(verifyJWT);

router.route("/enable-summary/:roomId").patch(enableSummary);
router
  .route("/summary-file/:roomId")
  .patch(generateSummary, generateSummaryFile);

export default router;
