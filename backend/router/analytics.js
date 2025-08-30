import express from "express";

import { getActiveVsCanceled, getMonthlySpending, getSatisfactionAnalytics, getTotalSubscriptions } from "../controller/analyticsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/total", verifyToken, getTotalSubscriptions)
router.get("/active-vs-canceled", verifyToken, getActiveVsCanceled);
router.get("/monthly-spending", verifyToken, getMonthlySpending);
router.get("/satisfaction", verifyToken, getSatisfactionAnalytics);

export default router;
