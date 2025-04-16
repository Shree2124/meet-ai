import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addDialogue,
  enableSummary,
  generateSummaryFile,
  generateSummaryFile2,
} from "../controllers/summary.controller";
import { generateSummary } from "../middlewares/generateSummary";

const router = Router();

router.route("/add-dialogue").patch(addDialogue);
router
  .route("/summary-file/:roomId")
  .post(generateSummaryFile2);
router.use(verifyJWT);

router.route("/enable-summary/:roomId").patch(enableSummary);

export default router;
