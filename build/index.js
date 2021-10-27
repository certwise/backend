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
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use("/template", template_1.default);
app.use("/certificate", certificate_1.default);
app.listen(config_1.default.PORT || 5000, function () {
    return console.log("Server started at port " + (config_1.default.PORT || 5000));
});
