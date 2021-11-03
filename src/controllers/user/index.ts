import { Request, Response } from "express";
import {
	createStripeCustomer_,
	createUser_,
	getUser_,
	updateUser_,
} from "./functions";

export const createUser = (req: Request, res: Response) => {
	createUser_(req.body).then((user) => {
		res.send(user);
	});
};
export const getUser = (req: Request, res: Response) => {
	getUser_(req.params.uid).then((user) => {
		console.log(user);
		res.send(user);
	});
};
export const updateUser = (req: Request, res: Response) => {
	updateUser_(req.body).then((user) => {
		res.send(user);
	});
};
export const deleteUser = (req: Request, res: Response) => {
	res.send("User test");
};

export const createStripeCustomer = (req: Request, res: Response) => {
	createStripeCustomer_(req.body.uid, req.body.name, req.body.email).then(
		(user) => {
			res.send(user);
		}
	);
};
