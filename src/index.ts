import express from "express";
import cors from "cors";
import env from "./config";
import routes from "./routes";
import dotenv from "dotenv";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

dotenv.config();
const app = express();
//Sentry integration
Sentry.init({
	dsn: "https://40d1a2239de44caaa46a269134adfeea@sentry.certwise.app/8",
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({ app }),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.errorHandler());
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// Optional fallthrough error handler
app.use(function onError(err: any, req: any, res: any, next: any) {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500;
	res.end(res.sentry + "\n");
});
app.use(
	Sentry.Handlers.errorHandler({
		shouldHandleError(error) {
			// Capture all 404 and 500 errors
			if (error.status === 404 || error.status === 500) {
				return true;
			}
			return false;
		},
	})
);
//Sentry integration end

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
app.use("/", routes);

app.get("/", (req, res) => {
	res.send("Certwise database Api");
});

app.listen(env.PORT, () =>
	console.log(`Server started at port ${process.env.PORT}`)
);
