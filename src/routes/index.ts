import templateRoute from "./template";
import certificateRoute from "./certificate";
import paymentRoutes from "./payment";
import userRoutes from "./user";
import recipientRoutes from "./recipient";
import organizationRoutes from "./organization";
import groupRoutes from "./group";

import { Router } from "express";
import {
	createEarlyAccess,
	getDashboardView,
	submitFeedback,
	validateEarlyAccessInviteCode,
} from "../controllers";
import { dbCreateEarlyAccessRequest } from "../database";
const router = Router();

router.use("/template", templateRoute);
router.use("/certificate", certificateRoute);
router.use("/payment", paymentRoutes);
router.use("/recipient", recipientRoutes);
router.use("/user", userRoutes);
router.use("/organization", organizationRoutes);
router.use("/group", groupRoutes);

router.get("/dashboard/:organizationId", getDashboardView);
router.get("/earlyaccess", validateEarlyAccessInviteCode);
router.post("/earlyaccess", createEarlyAccess);

router.post("/feedback", submitFeedback);
export default router;
