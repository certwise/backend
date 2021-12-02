import { Request, Response } from "express";
import { User } from "../models/user";
import * as db from "../database/user";

export const create = (req: Request, res: Response) => {
	console.log("create user");
	const user = new User(req.body);
	const isValid = user.validate();
	if (!isValid.error) {
		user
			.create(db.create)
			.then((user) => res.status(201).send(user))
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.message);
			});
	} else {
		console.log(isValid.message);
		res.status(400).send(isValid.message);
	}
};

export const get = (req: Request, res: Response) => {
	User.get(req.params.uid, db.get)
		.then((user) => {
			if (user) {
				res.status(200).send(user);
			} else {
				res.status(404).send("User not found");
			}
		})
		.catch((err) => res.status(500).send(err.message));
};

export const update = (req: Request, res: Response) => {
	const user = new User(req.body);
	const isValid = user.validate();
	if (!isValid.error) {
		user
			.update(db.update)
			.then(() => res.status(200).send(user))
			.catch((err) => res.status(500).send(err.message));
	} else {
		res.status(400).send(isValid.error);
	}
};

export const deleteUser = (req: Request, res: Response) => {
	User.delete(req.params.uid, db.deleteUser)
		.then(() => res.status(200).send("User deleted"))
		.catch((err) => res.status(500).send(err.message));
};
