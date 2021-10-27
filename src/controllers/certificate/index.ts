import { Request, Response } from "express";
import {
	createSingleCertificate_,
	getAllCertificatesByUID_,
	getCertificatesByTemplate_,
} from "./apiFunctions";

export const getCertificate = (req: Request, res: Response) => {
	res.send("getCertificate");
};

export const getAllCertificatesByUID = (req: Request, res: Response) => {
	const uid = req.params.uid;
	getAllCertificatesByUID_(uid).then((certificates) => {
		if (certificates !== false) res.status(200).send(certificates);
		else res.status(500).send("No certificates found");
	});
};

export const createSingleCertificate = (req: Request, res: Response) => {
	createSingleCertificate_(req.body).then((result) => {
		if (result) res.status(200).send(result);
		else res.status(500).send(result);
	});
};

export const getCertificatesByTemplate = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	getCertificatesByTemplate_(templateId).then((result) => {
		if (result !== false) res.status(200).send(result);
		else res.status(500).send(result);
	});
};

export const bulkCreateCertificates = (req: Request, res: Response) => {
	res.send("Test");
};

export const updateCertificate = (req: Request, res: Response) => {
	res.send("Test");
};

export const bulkUpdateCertificates = (req: Request, res: Response) => {
	res.send("Test");
};

export const deleteCertificate = (req: Request, res: Response) => {
	res.status(200).send("Test");
};

export const bulkDeleteCertificates = (req: Request, res: Response) => {
	res.send("Test");
};
