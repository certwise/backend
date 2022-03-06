import { Request, Response } from "express";
import {
	dashboardView,
	dbCreateEarlyAccessRequest,
	dbSubmitFeedback,
	dbValidateEarlyAccessInviteCode,
} from "../database";
import { EarlyAccess } from "../models/earlyAccess";

export const getDashboardView = (req: Request, res: Response) => {
	console.log("getDashboardView", req.cookies);
	if (req.cookies.org && req.cookies.org === req.params.organizationId) {
		dashboardView(req.params.organizationId).then((result) => {
			res.json(result);
		});
	} else res.status(400).send("Forbidden");
};

export const validateEarlyAccessInviteCode = (req: Request, res: Response) => {
	EarlyAccess.checkAccess(
		dbValidateEarlyAccessInviteCode,
		req.query.inviteCode as string,
		req.query.email as string
	)
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
};

export const createEarlyAccess = (req: Request, res: Response) => {
	const earlyAccess = new EarlyAccess(req.body);
	earlyAccess
		.create(dbCreateEarlyAccessRequest, req.body.email)
		.then(() => {
			res.send(true);
		})
		.catch((err) => {
			res.send(err);
		});
};

export const submitFeedback = (req: Request, res: Response) => {
	dbSubmitFeedback(req.body)
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};
