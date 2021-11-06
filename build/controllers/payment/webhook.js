"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = void 0;
var stripe_1 = __importDefault(require("stripe"));
var stripe = new stripe_1.default("sk_test_3f9jVdJkeCc6nc4NTEgey2Mo", {
    apiVersion: "2020-08-27",
});
var endpointSecret = "whsec_JeBCHOhrCG0PU62Nhr3AZGpguQe2eGlb";
var webhook = function (request, response) {
    var event = request.body;
    console.log("Request body:", event);
    var sig = request.headers["stripe-signature"];
    console.log("Signature:", sig, endpointSecret);
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log("Webhook request body :", event);
        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded": {
                var paymentIntent = event.data.object;
                console.log("PaymentIntent for " + paymentIntent.amount + " was successful!");
                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                break;
            }
            case "payment_method.attached": {
                var paymentMethod = event.data.object;
                // Then define and call a method to handle the successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                break;
            }
            case "subscription_schedule.created": {
                var subscriptionSchedule = event.data.object;
                console.log("Subscription schedule:", subscriptionSchedule);
                // Then define and call a method to handle the successful creation of a SubscriptionSchedule.
                // handleSubscriptionScheduleCreated(subscriptionSchedule);
                break;
            }
            default:
                // Unexpected event type
                console.log("Unhandled event type " + event.type + ".");
        }
        // Return a 200 response to acknowledge receipt of the event
        response.status(200).send();
    }
    catch (err) {
        response.status(404).send("Webhook Error: " + err.message);
        return;
    }
};
exports.webhook = webhook;
