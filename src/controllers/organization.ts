import { Request, Response } from "express";
import { Organization } from "../models/organization";
import * as db from "../database/organization";

export const create = (req: Request, res: Response) => {
	const org = new Organization(req.body);
	const isValid = org.validate();
	if (!isValid.error) {
		org
			.create(db.create)
			.then(() => {
				res.send(org);
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	} else {
		res.status(400).send(isValid.error);
	}
};
export const get = (req: Request, res: Response) => {
	const org = req.params.organization;
	Organization.get(org, db.get)
		.then((org) => {
			res.status(200).send(org);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};
export const update = (req: Request, res: Response) => {
	const org = new Organization(req.body);
	const isValid = org.validate();
	if (!isValid.error) {
		org
			.update(db.update)
			.then(() => {
				res.send(org);
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	} else {
		res.status(400).send(isValid.error);
	}
};

export const deleteOrg = (req: Request, res: Response) => {
	res.send("Organization test");
};
