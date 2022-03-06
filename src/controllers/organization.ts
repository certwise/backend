import { Request, Response } from "express";
import { Organization } from "../models/organization";
import * as db from "../database/organization";

export const create = (req: Request, res: Response) => {
	const org = new Organization(req.body);
	const isValid = org.validate();
	if (!isValid.error && req.cookies.uid === org.createdBy) {
		org
			.create(db.create)
			.then((result) => {
				res.status(200).send(result);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.message);
			});
	} else {
		console.log(isValid.message);
		res.status(400).send(isValid.message.toString());
	}
};
export const get = (req: Request, res: Response) => {
	const org = req.params.organization;
	Organization.get(org, db.get)
		.then((org) => {
			res.status(200).send(org);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};
export const update = (req: Request, res: Response) => {
	const org = new Organization(req.body);
	const isValid = org.validate();
	if (!isValid.error && req.cookies.uid === org.createdBy) {
		org
			.update(db.update)
			.then(() => {
				res.send(org);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.message);
			});
	} else {
		res.status(400).send(isValid.message);
		console.log(isValid.message, req.body);
	}
};

export const deleteOrg = (req: Request, res: Response) => {
	res.send("Organization delete test");
};
