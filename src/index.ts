import express from "express";
import cors from "cors";
import env from "./config";
import templateRoute from "./routes/template";
import certificateRoute from "./routes/certificate";
import paymentRoutes from "./routes/payments";
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));

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
