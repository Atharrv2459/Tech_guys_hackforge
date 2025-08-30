// router/subscriptionRouter.js
import express from "express";
import { addSubscription, confirmCancelSubscription, declineCancelSubscription, getSubscriptions, requestCancelSubscription, updateFeedback } from "../controller/subscriptionController.js";


const router = express.Router();

router.post("/add", addSubscription);
router.get("/:user_id", getSubscriptions);

router.get("/cancel/:subscription_id", requestCancelSubscription);
router.delete("/cancel/confirm/:subscription_id", confirmCancelSubscription); 
router.get("/cancel/decline/:subscription_id", declineCancelSubscription); 
router.put("/:id/feedback", updateFeedback);


export default router;
