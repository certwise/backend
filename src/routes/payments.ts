import express from "express";
const router = express.Router();
import * as controller from "../controllers/payments";
import { webhook } from "../controllers/payments/webhook";

router.post("/create-checkout-session", controller.createCheckoutSession);

router.post("/webhook", webhook);
export default router;
