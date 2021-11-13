import { template } from "../../types/template";
import { Request, Response } from "express";
import {
	createTemplate_,
	deleteTemplate_,
	getFieldsFromTemplate_,
	getNumberOfCertificatesInTemplate_,
	getTemplateById_,
	getTemplateByNameAndUid_,
	getTemplatesByUid_,
	getTemplatesNamesByUid_,
	renameTemplate_,
	updateTemplate_,
} from "./apiFunctions";

export const createTemplate = (req: Request, res: Response) => {
	const template = req.body as template;
	createTemplate_(template).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getTemplateById = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	getTemplateById_(templateId).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getTemplatesByUid = async (req: Request, res: Response) => {
	const uid = req.params.uid;
	getTemplatesByUid_(uid).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(false);
	});
};

export const updateTemplate = async (req: Request, res: Response) => {
	updateTemplate_(req.body as template).then((result) => {
		if (result) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const deleteTemplate = async (req: Request, res: Response) => {
	deleteTemplate_(req.params.templateId).then((result) => {
		if (result) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getFields = (req: Request, res: Response) => {
	getFieldsFromTemplate_(req.params.templateId).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getNumberOfCertificates = async (req: Request, res: Response) => {
	getNumberOfCertificatesInTemplate_(
		req.params.templateId.replace(/\s/g, "")
	).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getTemplateNamesByUid = async (req: Request, res: Response) => {
	getTemplatesNamesByUid_(req.params.uid).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const getTemplateByNameAndUid = async (req: Request, res: Response) => {
	getTemplateByNameAndUid_(
		req.query.templateName as string,
		req.query.uid as string
	).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const renameTemplate = async (req: Request, res: Response) => {
	console.log("Renaming template", req.body);
	renameTemplate_(req.body.id, req.body.name).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(400).send(result);
	});
};

export const addImageToCanvas = async (req: Request, res: Response) => {
	res.send("Test");
};
