import { Certificate } from "../models/certificate";
import { Request, Response } from "express";
import * as db from "../database/certificate";
import { getTemplateImage } from "../models/template/functions";
import dotenv from "dotenv";
import { get as getRecipient } from "../database/recipient";
import { get as getOrganization } from "../database/organization";
// These comments are to ignore ts and es-lint warnings as mailersend ts package is not available
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MailerSend, { Recipient, EmailParams } from "mailersend";
import { IRecipient } from "../models/recipient";
import { IOrganization } from "../models/organization";
dotenv.config();
const mailersend = new MailerSend({
	api_key: process.env.MAILERSEND_API_KEY,
});

export const createOne = (req: Request, res: Response) => {
	const certificate = new Certificate(req.body);
	const isValid = certificate.validate();
	if (!isValid.error) {
		certificate
			.create(db.create, getTemplateImage, db.uploadCertificateBuffertoStorage)
			.then((certificate) => {
				res.status(200).send({ ...certificate });
			})
			.catch((err) => {
				console.log(err);
				res.status(400).send(err.toString());
			});
	} else {
		res.status(400).send("Error:" + isValid.message);
	}
};

export const getOne = (req: Request, res: Response) => {
	const certificateId = req.params.certificateId;
	Certificate.getOne(certificateId, db.getOne)
		.then((certificate) => {
			res.status(200).send(certificate);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
};

export const getByOrganizaion = (req: Request, res: Response) => {
	const org = req.params.organization;
	Certificate.getByOrganizaion(org, db.getByOrganization)
		.then((certificates) => {
			res.status(200).send(certificates);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
};

export const getByTemplate = (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	Certificate.getByTemplate(templateId, db.getByTemplate)
		.then((certificates) => {
			res.status(200).send(certificates);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
};

export const getByGroup = (req: Request, res: Response) => {
	const groupId = req.params.groupId;
	Certificate.getByGroup(groupId, db.getByGroup)
		.then((certificates) => {
			res.status(200).send(certificates);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
};

export const update = (req: Request, res: Response) => {
	const certificate = new Certificate(req.body);
	const isValid = certificate.validate();
	if (!isValid.error) {
		certificate
			.update(db.update)
			.then((certificate) => {
				res.status(200).send(certificate);
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	} else {
		res.status(400).send(`Invalid request body. ${isValid.message}`);
	}
};

export const issue = (req: Request, res: Response) => {
	const certificateId = req.params.certificate;
	Certificate.getOne(certificateId, db.getOne)
		.then((certificate) => {
			new Certificate(certificate).issue(db.update, sendEmail);
			res.status(200).send(certificate);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
};

const sendEmail = async (recipient_: string, templateId: string) => {
	const recipient: IRecipient = await getRecipient(recipient_);
	const organization: IOrganization = await getOrganization(
		recipient.organization
	);
	console.log(recipient, templateId);
	return new Promise<void>((resolve) => {
		const issuerName = organization.name;
		const email = recipient.email;
		const receiverName = recipient.name; // dummy values for now
		const recipients = [new Recipient(email, receiverName)];
		const personalization = [
			{
				email,
				data: {
					name: receiverName,
					issuer: {
						name: issuerName,
					},
					credential: {
						link: "https://certwise.app",
						reason: "Certificate",
					},
				},
			},
		];
		const emailParams = new EmailParams()
			.setFrom("credential_noreply@notify.certwise.app")
			.setFromName("Certwise")
			.setRecipients(recipients)
			.setSubject("Certwise Digital Credential")
			.setTemplateId("pr9084z2j84w63dn")
			.setPersonalization(personalization);
		mailersend.send(emailParams);
		resolve();
	});
};
