import { NextFunction, Request, Response } from "express";
import { auth } from "firebase-admin";
import { getByUser as getOrganizationByUID } from "./database/organization";

const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		req.headers.authorization = req.headers.authorization.split(" ")[1];
	} else {
		req.headers.authorization = undefined;
	}
	next();
};

export const checkIfAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	getAuthToken(req, res, async () => {
		try {
			const authToken = req.headers.authorization;
			const token = await auth().verifyIdToken(authToken || "");
			console.log("token", new Date(token.exp).toTimeString());
			if (!token.uid) throw new Error("Unauthorized");
			const org = await getOrganizationByUID(token.uid);
			req.cookies = {
				...req.cookies,
				uid: token.uid,
				org: org?._id?.toString() || "NULL",
			};
			console.log("req.cookies", req.cookies);
			next();
		} catch (e) {
			console.log(e, "error-Unauthorized");
			return res.status(401).send("Forbidden");
		}
	});
};
