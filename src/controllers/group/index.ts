import { Request, Response } from "express";
import { createGroup_, getGroups_, getGroup_, updateGroup_ } from "./functions";

export const createGroup = (req: Request, res: Response) => {
	createGroup_(req.body).then((group) => {
		if (group) res.send(group);
		else res.status(400).send({ message: "Error creating group" });
	});
};
export const getGroup = (req: Request, res: Response) => {
	getGroup_(req.params.id).then((group) => {
		if (group) res.send(group);
		else res.status(400).send({ message: "Error getting group" });
	});
};
export const getGroups = (req: Request, res: Response) => {
	getGroups_(req.params.instituteId).then((groups) => {
		if (groups) res.send(groups);
		else res.status(400).send({ message: "Error getting group" });
	});
};
export const updateGroup = (req: Request, res: Response) => {
	updateGroup_(req.body).then((group) => {
		if (group) res.send(group);
		else res.status(400).send({ message: "Error updating group" });
	});
};
export const deleteGroup = (req: Request, res: Response) => {
	res.send("Group test");
};
