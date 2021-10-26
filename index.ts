import express from "express";
import cors from "cors";
import env from "./config";
import templateRoute from "./routes/template";
import certificateRoute from "./routes/certificate";
import bodyParser from "body-parser";

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/template", templateRoute);
app.use("/certificate", certificateRoute);

app.listen(env.PORT || 5000, () =>
	console.log(`Server started at port ${env.PORT || 5000}`)
);
