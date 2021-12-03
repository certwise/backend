"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var config_1 = __importDefault(require("./config"));
var routes_1 = __importDefault(require("./routes"));
var dotenv_1 = __importDefault(require("dotenv"));
var Sentry = __importStar(require("@sentry/node"));
var Tracing = __importStar(require("@sentry/tracing"));
dotenv_1.default.config();
var app = (0, express_1.default)();
//Sentry integration
Sentry.init({
    dsn: "https://40d1a2239de44caaa46a269134adfeea@sentry.certwise.app/8",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: app }),
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
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});
app.use(Sentry.Handlers.errorHandler({
    shouldHandleError: function (error) {
        // Capture all 404 and 500 errors
        if (error.status === 404 || error.status === 500) {
            return true;
        }
        return false;
    },
}));
//Sentry integration end
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
    next();
});
// parse application/json
app.use(express_1.default.json({ limit: "50mb" }));
app.use("/template", routes_1.default.templateRoute);
app.use("/certificate", routes_1.default.certificateRoute);
app.use("/payment", routes_1.default.paymentRoutes);
app.use("/recipient", routes_1.default.recipientRoutes);
app.use("/user", routes_1.default.userRoutes);
app.use("/organization", routes_1.default.organizationRoutes);
app.use("/group", routes_1.default.groupRoutes);
app.get("/", function (req, res) {
    console.log("hello", req.hostname);
    res.send("CertWise Api");
});
app.listen(config_1.default.PORT, function () {
    return console.log("Server started at port ".concat(process.env.PORT));
});
