import { Request, Response } from "express";
import { dashboardView } from "../database";
export const getDashboardView = (req: Request, res: Response) => {
	dashboardView(req.params.organizationId).then((result) => {
		res.json(result);
	});
};
