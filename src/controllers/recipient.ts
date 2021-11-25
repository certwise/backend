import { Request, Response } from "express";
import { Recipient } from "../models/recipient";
import * as db from "../database/recipient";

export const create = (req: Request, res: Response) => {
	const recipient = new Recipient(req.body);
	const isValid = recipient.validate();
	if (!isValid.error) {
		recipient
			.create(db.create)
			.then((recipient) => {
				res.status(200).send(recipient);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.toString());
			});
	} else {
		res.status(400).send(isValid.message);
	}
};

export const get = (req: Request, res: Response) => {
	Recipient.get(req.params.recipient, db.get)
		.then((recipient) => {
			res.status(200).send(recipient);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};

export const update = (req: Request, res: Response) => {
	const recipient = new Recipient(req.body);
	const isValid = recipient.validate();
	if (!isValid.error) {
		recipient
			.update(db.update)
			.then((recipient) => {
				res.status(200).send(recipient);
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	} else {
		res.status(400).send(isValid.message);
	}
};
export const deleteRecipient = (req: Request, res: Response) => {
	res.send("Recipient test");
};

export const getByOrganization = (req: Request, res: Response) => {
	Recipient.getByOrganization(req.params.organization, db.getByOrganization)
		.then((recipient) => {
			res.status(200).send(recipient);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};

export const getByGroup = (req: Request, res: Response) => {
	Recipient.getByGroup(req.params.group, db.getByGroup)
		.then((recipient) => {
			res.status(200).send(recipient);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};
