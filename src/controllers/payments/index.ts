import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_3f9jVdJkeCc6nc4NTEgey2Mo", {
	apiVersion: "2020-08-27",
});

export const createPaymentIntent = async (req: Request, res: Response) => {
	console.log("createPaymentIntent");
	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 2500,
		currency: "inr",
		payment_method_types: ["card"],
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
};

export const createCustomer = async (req: Request, res: Response) => {
	const customer = await stripe.customers.create({
		email: req.body.email,
	});

	// save the customer.id as stripeCustomerId
	// in your database.

	res.send({ customer });
};

export const createSubscription = async (req: Request, res: Response) => {
	const customerId = req.cookies["customer"];
	const priceId = req.body.priceId;

	try {
		// Create the subscription. Note we're expanding the Subscription's
		// latest invoice and that invoice's payment_intent
		// so we can pass it to the front end to confirm the payment
		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [
				{
					price: priceId,
				},
			],
			payment_behavior: "default_incomplete",
			expand: ["latest_invoice.payment_intent"],
		});

		res.send({
			subscriptionId: subscription.id,
			clientSecret: (subscription.latest_invoice as unknown as any)
				.payment_intent.client_secret,
		});
	} catch (error: any) {
		return res.status(400).send({ error: { message: error.message } });
	}
};

export const createCheckoutSession = async (req: Request, res: Response) => {
	const priceIdStdINR = "price_1JpUa2LZFyxWm1345u9Uniph";
	const priceIdStdUSD = "price_1JpUUALZFyxWm1348aw2a707";
	console.log("createCheckoutSession", req.body);
	const price = priceIdStdINR;
	let trial: number | undefined = undefined;
	if (req.body.plan === "trial") trial = 7;
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price,
			},
		],
		mode: "subscription",
		success_url:
			"https://certwise.app/payments/success?session_id={CHECKOUT_SESSION_ID}",
		cancel_url: "https://certwise.app/payments/fail",
		subscription_data: {
			trial_period_days: trial,
		},
	});
	console.log("session", session);
	res.status(200).send({ url: session.url });
};
