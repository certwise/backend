"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = __importDefault(require("./template"));
var certificate_1 = __importDefault(require("./certificate"));
var payment_1 = __importDefault(require("./payment"));
var user_1 = __importDefault(require("./user"));
var recipient_1 = __importDefault(require("./recipient"));
var organization_1 = __importDefault(require("./organization"));
var group_1 = __importDefault(require("./group"));
exports.default = {
    templateRoute: template_1.default,
    certificateRoute: certificate_1.default,
    paymentRoutes: payment_1.default,
    userRoutes: user_1.default,
    recipientRoutes: recipient_1.default,
    organizationRoutes: organization_1.default,
    groupRoutes: group_1.default,
};
