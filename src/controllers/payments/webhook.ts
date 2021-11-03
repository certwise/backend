import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_3f9jVdJkeCc6nc4NTEgey2Mo", {
	apiVersion: "2020-08-27",
});

const endpointSecret = "whsec_JeBCHOhrCG0PU62Nhr3AZGpguQe2eGlb";

export const webhook = (request: Request, response: Response) => {
	let event = request.body;
	console.log("Request body:", event);
	const sig = request.headers["stripe-signature"];
	try {
		event = stripe.webhooks.constructEvent(
			request.body,
			sig as any,
			endpointSecret
		);
	} catch (err: any) {
		response.status(404).send(`Webhook Error: ${err.message}`);
		return;
	}
	console.log("Webhook request body :", event);
	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded": {
			const paymentIntent = event.data.object;
			console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
			// Then define and call a method to handle the successful payment intent.
			// handlePaymentIntentSucceeded(paymentIntent);
			break;
		}
		case "payment_method.attached": {
			const paymentMethod = event.data.object;
			// Then define and call a method to handle the successful attachment of a PaymentMethod.
			// handlePaymentMethodAttached(paymentMethod);
			break;
		}
		case "subscription_schedule.created": {
			const subscriptionSchedule = event.data.object;
			console.log("Subscription schedule:", subscriptionSchedule);
			// Then define and call a method to handle the successful creation of a SubscriptionSchedule.
			// handleSubscriptionScheduleCreated(subscriptionSchedule);
			break;
		}
		default:
			// Unexpected event type
			console.log(`Unhandled event type ${event.type}.`);
	}
	// Return a 200 response to acknowledge receipt of the event
	response.status(200).send();
};
