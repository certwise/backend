import { Request, Response } from "express";
import {
	createRecipient_,
	getAllRecipientsInInstitution_,
	getRecipient_,
	updateRecipient_,
} from "./functions";

export const createRecipient = (req: Request, res: Response) => {
	createRecipient_(req.body.recipient, req.body.institutionId).then(
		(recipient) => {
			if (recipient) res.send(recipient);
			else res.status(400).send({ message: "Error creating recipient" });
		}
	);
};
export const getRecipient = (req: Request, res: Response) => {
	getRecipient_(req.params.id).then((recipient) => {
		if (recipient) res.send(recipient);
		else res.status(400).send({ message: "Error getting recipient" });
	});
};
export const updateRecipient = (req: Request, res: Response) => {
	updateRecipient_(req.body).then((recipient) => {
		if (recipient) res.send(recipient);
		else res.status(400).send({ message: "Error updating recipient" });
	});
};
export const deleteRecipient = (req: Request, res: Response) => {
	res.send("Recipient test");
};

export const getAllRecipientsInInstitution = (req: Request, res: Response) => {
	getAllRecipientsInInstitution_(req.params.institutionId).then((all) => {
		if (all) res.send(all);
		else res.status(400).send({ message: "Error getting recipients" });
	});
};
