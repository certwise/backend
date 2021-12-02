import { Request, Response } from "express";
import { Recipient, IRecipient } from "../models/recipient";
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

export const createBulk = (req: Request, res: Response) => {
	const recipients: IRecipient[] = req.body;
	const isValid = { error: false, message: "" };
	for (const r of recipients) {
		const recipient = new Recipient(r);
		const isValid_ = recipient.validate();
		if (isValid_.error) {
			isValid.error = true;
			isValid.message += isValid_.message;
			break;
		} else continue;
	}
	if (!isValid.error) {
		Recipient.createBulk(recipients, db.createBulk)
			.then((recipients) => {
				res.status(200).send(recipients);
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
			console.log(err);
			res.status(500).send(err.message);
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
				res.status(500).send(err.message);
			});
	} else {
		res.status(400).send(isValid.message);
	}
};
export const deleteRecipient = (req: Request, res: Response) => {
	res.send("Recipient test");
};

export const getByOrganization = (req: Request, res: Response) => {
	Recipient.getByOrganization(req.params.organization, db.getByOrganizaion)
		.then((recipient) => {
			res.status(200).send(recipient);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

export const getByGroup = (req: Request, res: Response) => {
	Recipient.getByGroup(req.params.group, db.getByGroup)
		.then((recipient) => {
			res.status(200).send(recipient);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};
