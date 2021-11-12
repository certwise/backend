import { Request, Response } from "express";
import {
	createInstitution_,
	getInstitution_,
	setCustomFields_,
	updateInstitution_,
} from "./functions";

export const createInstitution = (req: Request, res: Response) => {
	createInstitution_(req.body).then((institution) => {
		if (institution) res.send(institution);
		else res.status(400).send({ message: "Error creating institution" });
	});
};
export const getInstitution = (req: Request, res: Response) => {
	getInstitution_(req.params.id).then((institution) => {
		if (institution) res.send(institution);
		else res.status(400).send({ message: "Error getting institution" });
	});
};
export const updateInstitution = (req: Request, res: Response) => {
	updateInstitution_(req.body).then((institution) => {
		if (institution) res.send(institution);
		else res.status(400).send({ message: "Error updating institution" });
	});
};
export const deleteInstitution = (req: Request, res: Response) => {
	res.send("Institution test");
};

export const setCustomFields = (req: Request, res: Response) => {
	console.log(req.body);
	setCustomFields_(req.body.fields, req.body.institutionId).then((result) => {
		if (result) res.send(result);
		else res.status(400).send({ message: "Error setting custom fields" });
	});
};
