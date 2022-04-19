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

export const deleteTemplate = async (req: Request, res: Response) => {
	const template = await Template.getOne(req.params.templateId, db.getOne);
	if (req.cookies.org === template.organization)
		Template.delete(req.params.templateId, db.isUsedTemplate, db.deleteTemplate)
			.then(() => {
				res.status(200).send();
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	else {
		console.log(req.cookies.org, req.params.organization);
		res.status(403).send("Forbidden");
	}
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

export const getNumberOfCertificates = async (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	const template = await Template.getOne(templateId, db.getOne);
	Template.getNumberOfCertificates(templateId, db.getNumberOfCertificates)
		.then((result) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			res.status(200).send(result);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

export const archive = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	Template.getOne(templateId, db.getOne)
		.then((template) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			Template.archive(templateId, db.archive);
			res.status(200).send();
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

export const unarchive = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	Template.getOne(templateId, db.getOne)
		.then((template) => {
			if (template.organization !== req.cookies.org)
				throw new Error("Forbidden");
			Template.archive(templateId, db.unarchive);
			res.status(200).send();
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};
