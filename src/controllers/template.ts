import { Request, Response } from "express";
import { Template } from "../models/template";
import * as db from "../database/template";

export const create = (req: Request, res: Response) => {
	const template = new Template(req.body);
	const isValid = template.validate();
	if (isValid.error && req.cookies.org === template.organization) {
		res.status(400).send(`Template not valid. ${isValid.message}`);
	} else {
		template
			.create(db.create)
			.then(() => {
				res.status(201).send(template);
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	}
};

export const getById = (req: Request, res: Response) => {
	const templateId = req.params.templateId;

	Template.getOne(templateId, db.getOne)
		.then((template) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			res.status(200).send(template);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

export const getByOrganization = (req: Request, res: Response) => {
	const org = req.params.organization;
	Template.getByOrganization(org, db.getByOrganization)
		.then((templates) => {
			for (const template of templates) {
				if (template.organization !== req.cookies.org)
					throw new Error("Forbidden");
			}
			res.status(200).send(templates);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

export const update = (req: Request, res: Response) => {
	const template = new Template(req.body);
	const isValid = template.validate();
	if (isValid.error && req.cookies.org === template.organization) {
		res.status(400).send(`Template not valid. ${isValid.message}`);
	} else {
		template
			.update(db.update)
			.then((updatedTemplate) => {
				res.status(200).send(updatedTemplate);
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	}
};

export const deleteTemplate = (req: Request, res: Response) => {
	if (req.cookies.org === req.params.organization)
		Template.delete(req.params.templateId, db.deleteTemplate)
			.then(() => {
				res.status(200).send();
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	else res.status(403).send("Forbidden");
};

export const getFields = (req: Request, res: Response) => {
	const templateId = req.params.templateId;

	Template.getOne(templateId, db.getOne)
		.then((template) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			const t = new Template(template);
			const fields = t.getAllFields();
			res.status(200).send(fields);
		})
		.catch((err) => res.status(500).send(err.message));
};

export const getNumberOfCertificates = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	Template.getOne(templateId, db.getOne)
		.then((template) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			const t = new Template(template);
			const numberOfCertificates = t.numberOfCertificates;
			res.status(200).send(numberOfCertificates);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};
