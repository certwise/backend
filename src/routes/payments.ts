import express from "express";
const router = express.Router();
import * as controller from "../controllers/payments";
router.post("/create-payment-intent", controller.createPaymentIntent);
router.post("/create-customer", controller.createCustomer);
router.post("/create-subscription", controller.createSubscription);
router.post("/create-checkout-session", controller.createCheckoutSession);

export default router;
