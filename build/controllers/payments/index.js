"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.createSubscription = exports.createCustomer = exports.createPaymentIntent = void 0;
var stripe_1 = __importDefault(require("stripe"));
var stripe = new stripe_1.default("sk_test_3f9jVdJkeCc6nc4NTEgey2Mo", {
    apiVersion: "2020-08-27",
});
var createPaymentIntent = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("createPaymentIntent");
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: 2500,
                        currency: "inr",
                        payment_method_types: ["card"],
                    })];
            case 1:
                paymentIntent = _a.sent();
                res.send({
                    clientSecret: paymentIntent.client_secret,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.createPaymentIntent = createPaymentIntent;
var createCustomer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, stripe.customers.create({
                    email: req.body.email,
                })];
            case 1:
                customer = _a.sent();
                // save the customer.id as stripeCustomerId
                // in your database.
                res.send({ customer: customer });
                return [2 /*return*/];
        }
    });
}); };
exports.createCustomer = createCustomer;
var createSubscription = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, priceId, subscription, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerId = req.cookies["customer"];
                priceId = req.body.priceId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, stripe.subscriptions.create({
                        customer: customerId,
                        items: [
                            {
                                price: priceId,
                            },
                        ],
                        payment_behavior: "default_incomplete",
                        expand: ["latest_invoice.payment_intent"],
                    })];
            case 2:
                subscription = _a.sent();
                res.send({
                    subscriptionId: subscription.id,
                    clientSecret: subscription.latest_invoice
                        .payment_intent.client_secret,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(400).send({ error: { message: error_1.message } })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createSubscription = createSubscription;
var createCheckoutSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var priceIdStdINR, priceIdStdUSD, price, trial, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                priceIdStdINR = "price_1JpUa2LZFyxWm1345u9Uniph";
                priceIdStdUSD = "price_1JpUUALZFyxWm1348aw2a707";
                console.log("createCheckoutSession", req.body);
                price = priceIdStdINR;
                trial = undefined;
                if (req.body.plan === "trial")
                    trial = 7;
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items: [
                            {
                                price: price,
                            },
                        ],
                        mode: "subscription",
                        success_url: "https://certwise.app/payments/success?session_id={CHECKOUT_SESSION_ID}",
                        cancel_url: "https://certwise.app/payments/fail",
                        subscription_data: {
                            trial_period_days: trial,
                        },
                    })];
            case 1:
                session = _a.sent();
                console.log("session", session);
                res.status(200).send({ url: session.url });
                return [2 /*return*/];
        }
    });
}); };
exports.createCheckoutSession = createCheckoutSession;
