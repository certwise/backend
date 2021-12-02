"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var config_1 = __importDefault(require("./config"));
var template_1 = __importDefault(require("./routes/template"));
var certificate_1 = __importDefault(require("./routes/certificate"));
var payment_1 = __importDefault(require("./routes/payment"));
var user_1 = __importDefault(require("./routes/user"));
var recipient_1 = __importDefault(require("./routes/recipient"));
var organization_1 = __importDefault(require("./routes/organization"));
var group_1 = __importDefault(require("./routes/group"));
var app = (0, express_1.default)();
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
app.use("/template", template_1.default);
app.use("/certificate", certificate_1.default);
app.use("/payment", payment_1.default);
app.use("/recipient", recipient_1.default);
app.use("/user", user_1.default);
app.use("/organization", organization_1.default);
app.use("/group", group_1.default);
app.get("/", function (req, res) {
    console.log("hello", req.hostname);
    res.send("CertWise Api");
});
app.listen(config_1.default.PORT, function () {
    return console.log("Server started at port ".concat(process.env.PORT));
});
