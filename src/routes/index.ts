import templateRoute from "./template";
import certificateRoute from "./certificate";
import paymentRoutes from "./payment";
import userRoutes from "./user";
import recipientRoutes from "./recipient";
import organizationRoutes from "./organization";
import groupRoutes from "./group";
import { getOne as getOneCertificate } from "../controllers/certificate";
import { get as getOrganizaion } from "../controllers/organization";
import { get as getRecipient } from "../controllers/recipient";
import { Router } from "express";
import {
	createEarlyAccess,
	getDashboardView,
	submitFeedback,
	validateEarlyAccessInviteCode,
} from "../controllers";
import { checkIfAuthenticated } from "../jwtAuth";
import { create as createUser } from "../controllers/user";
const router = Router();

router.use(function (req, res, next) {
	console.log(req.method, req.url);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization"
	);
	next();
});

router.get("/", (_, res) => {
	res.send(
		`<h1>Certwise api</h1>
			<div>
				<h2>
					<a href="https://certwise.app/">Go to Certwise Homepage</a>
				</h2>
				<div>There is nothing much you can do here...</div>
			</div>`
	);
});

router.get("/earlyaccess", validateEarlyAccessInviteCode);
router.post("/earlyaccess", createEarlyAccess);
router.get("/certificate/one/:certificateId", getOneCertificate);
router.get("/organization/:organization", getOrganizaion);
router.get("/recipient/:recipient", getRecipient);

router.use((req, res, next) => {
	checkIfAuthenticated(req, res, next);
});

router.get("/dashboard/:organizationId", getDashboardView);
router.post("/feedback", submitFeedback);

router.use("/template", templateRoute);
router.use("/certificate", certificateRoute);
router.use("/payment", paymentRoutes);
router.use("/recipient", recipientRoutes);
router.use("/user", userRoutes);
router.use("/organization", organizationRoutes);
router.use("/group", groupRoutes);

export default router;
