import express from "express";
import cors from "cors";
import env from "./config";
import templateRoute from "./routes/template";
import certificateRoute from "./routes/certificate";
import paymentRoutes from "./routes/payments";
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
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
app.use(express.json());

app.get("/", (req, res) => {
	res.send("CertWise Api");
});

app.use("/template", templateRoute);
app.use("/certificate", certificateRoute);
app.use("/payments", paymentRoutes);

app.listen(env.PORT || 5000, () =>
	console.log(`Server started at port ${env.PORT || 5000}`)
);
