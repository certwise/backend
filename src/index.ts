import express from "express";
import cors from "cors";
import env from "./config";
import templateRoute from "./routes/template";
import certificateRoute from "./routes/certificate";
import paymentRoutes from "./routes/payment";
import userRoutes from "./routes/user";
import recipientRoutes from "./routes/recipient";
import organizationRoutes from "./routes/organization";
import groupRoutes from "./routes/group";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(cors());

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(function (req, res, next) {
	console.log(req.method, req.url);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
	);
	next();
});
// parse application/json
app.use(express.json({ limit: "50mb" }));
app.use("/template", templateRoute);
app.use("/certificate", certificateRoute);
app.use("/payment", paymentRoutes);
app.use("/recipient", recipientRoutes);
app.use("/user", userRoutes);
app.use("/organization", organizationRoutes);
app.use("/group", groupRoutes);

app.get("/", (req, res) => {
	console.log("hello", req.hostname);
	res.send("CertWise Api");
});

app.listen(env.PORT, () =>
	console.log(`Server started at port ${process.env.PORT}`)
);
