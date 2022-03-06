import express from "express";
import cors from "cors";
import env, { sentryInit } from "./config";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

sentryInit(app);

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use("/", routes);

app.get("/", (_, res) => {
	res.send("Certwise database Api");
});

app.listen(env.PORT, () =>
	console.log(`Server started at port ${process.env.PORT}`)
);
