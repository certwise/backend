import { Request, Response } from "express";
import { Group } from "../models/group";
import * as db from "../database/group";

export const create = (req: Request, res: Response) => {
	const group = new Group(req.body);
	const isValid = group.validate();
	if (!isValid.error) {
		group
			.create(db.create)
			.then((group) => {
				res.status(200).send(group);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.message);
			});
	} else {
		res.status(400).send(isValid.message);
	}
};

export const getOne = (req: Request, res: Response) => {
	const id = req.params.group;
	Group.getOne(id, db.getOne)
		.then((group) => {
			res.status(200).send(group);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err.message);
		});
};

export const getByOrganization = (req: Request, res: Response) => {
	Group.getByOrganization(req.params.organization, db.getByOrganization)
		.then((groups) => {
			res.status(200).send(groups);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err.message);
		});
};

export const update = (req: Request, res: Response) => {
	const group = new Group(req.body);
	const isValid = group.validate();
	if (!isValid.error) {
		group
			.update(db.update)
			.then((group) => {
				res.status(200).send(group);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send(err.message);
			});
	} else {
		res.status(400).send(isValid.message);
	}
};

export const deleteGroup = (req: Request, res: Response) => {
	Group.delete(req.params.group, db.deleteGroup)
		.then((group) => {
			res.status(200).send(group);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send(err.message);
		});
};
