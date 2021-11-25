import express from "express";
const router = express.Router();

router.post("/create-checkout-session");

router.post("/webhook", express.raw({ type: "application/json" }));

export default router;
