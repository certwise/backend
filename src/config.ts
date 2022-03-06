// Move all this to .env
import { initializeApp } from "firebase/app";
import {
	initializeApp as adminInitializeApp,
	applicationDefault,
} from "firebase-admin/app";
import dotenv from "dotenv";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { Express } from "express";

dotenv.config();

adminInitializeApp({
	credential: applicationDefault(),
	projectId: "certify-4bf9a",
});

const firebaseConfig = {
	apiKey: "AIzaSyBaX8tNR8l6g596VD30jXrb8sqcIay1OQg",
	authDomain: "certify-4bf9a.firebaseapp.com",
	projectId: "certify-4bf9a",
	storageBucket: "certify-4bf9a.appspot.com",
	messagingSenderId: "943355489638",
	appId: "1:943355489638:web:6e608813cb8088a39e6ca7",
};

// Gets port from Heroku
// eslint-disable-next-line no-undef

const PORT = process.env.PORT || 5000;

initializeApp(firebaseConfig);

const env = {
	PORT,
};

export const sentryInit = (app: Express) => {
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
};

export default env;
