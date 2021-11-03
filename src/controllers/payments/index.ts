import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_3f9jVdJkeCc6nc4NTEgey2Mo", {
	apiVersion: "2020-08-27",
});

const priceIdCertWiseStandardINR = "price_1JpUa2LZFyxWm1345u9Uniph";

export const createStripeCustomer = async (
	name: string,
	email: string
): Promise<string | false> => {
	try {
		const customer = await stripe.customers.create({
			name: name,
			email: email,
		});
		console.log("Creating Stripe Customer:", customer, name, email);
		return customer.id;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createCheckoutSession = async (req: Request, res: Response) => {
	console.log("createCheckoutSession", req.body);
	const price = priceIdCertWiseStandardINR;
	let trial: number | undefined = undefined;
	if (req.body.plan === "trial") trial = 7;
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price,
			},
		],
		customer_email: req.body.email,
		mode: "subscription",
		success_url:
			"http://localhost:3000/payments/success?session_id={CHECKOUT_SESSION_ID}",
		cancel_url: "http://localhost:3000/payments/fail",
		subscription_data: {
			trial_period_days: trial,
		},
	});
	console.log("session", session);
	res.status(200).send({ url: session.url });
};
