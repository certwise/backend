import { Certificate, ICertificate } from "../models/certificate";
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

import { getOne as getTemplate } from "../database/template";
import { getOne as getGroup } from "../database/group";
import axios from "axios";
import env from "../config";
import { getOne as dbGetOneTemplate } from "../database/template";
import { ITemplate } from "../models/template";
dotenv.config();
const mailersend = new MailerSend({
	api_key: process.env.MAILERSEND_API_KEY,
});

export const createOne = async (req: Request, res: Response) => {
	const certificate = new Certificate(req.body);
	const isValid = certificate.validate();
	let certificate_: ICertificate;
	if (!isValid.error && req.cookies.org === certificate.organization) {
		const template = await dbGetOneTemplate(certificate.templateId);
		certificate
			.create(
				db.create,
				generateCertificateImage,
				template,
				req.headers.authorization || ""
			)
			.then((certificateRes) => {
				certificate_ = certificateRes;
				res.status(200).send({ ...certificate });
			})
			.catch(async (err) => {
				if (certificate_?._id) await db.deleteCertificate(certificate_._id);
				console.log(err);
				res.status(400).send(err.toString());
			});
	} else {
		res.status(400).send("Error:" + isValid.message);
	}
};

export const createMany = async (req: Request, res: Response) => {
	const certificates = req.body;
	let isValid = { error: false, message: "" };
	for (const certificate of certificates) {
		const cert = new Certificate(certificate);
		const isValid_ = cert.validate();
		if (!isValid_.error) {
			isValid = isValid_;
			break;
		} else continue;
	}
	let isValidOrganization = true;
	for (const c of certificates) {
		if (c.organization !== req.cookies.org) {
			isValidOrganization = false;
			break;
		}
	}
	if (!isValid.error && isValidOrganization) {
		const template = await dbGetOneTemplate(certificates[0].templateId);
		Certificate.createMany(
			certificates,
			db.createMany,
			generateCertificateImage,
			template,
			req.headers.authorization || ""
		)
			.then((certificates) => {
				res.status(200).send(certificates);
			})
			.catch((err) => {
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
	console.log("Cookies", req.cookies);
	if (org === req.cookies.org) {
		Certificate.getByOrganizaion(org, db.getByOrganization)
			.then((certificates) => {
				res.status(200).send(certificates);
			})
			.catch((err) => {
				res.status(400).send(err);
			});
	} else res.status(401).send("Unauthorized");
};

export const getByTemplate = async (req: Request, res: Response) => {
	const templateId = req.params.templateId;
	const template = await getTemplate(templateId);
	const org = template.organization;
	if (org === req.cookies.org) {
		Certificate.getByTemplate(templateId, db.getByTemplate)
			.then((certificates) => {
				res.status(200).send(certificates);
			})
			.catch((err) => {
				res.status(400).send(err);
			});
	} else res.status(401).send("Unauthorized");
};

export const getByGroup = async (req: Request, res: Response) => {
	const groupId = req.params.groupId;
	const group = await getGroup(groupId);
	const org = group.organization;
	if (org === req.cookies.org) {
		Certificate.getByGroup(groupId, db.getByGroup)
			.then((certificates) => {
				res.status(200).send(certificates);
			})
			.catch((err) => {
				res.status(400).send(err);
			});
	} else res.status(401).send("Unauthorized");
};

export const update = (req: Request, res: Response) => {
	const certificate = new Certificate(req.body);
	const org = certificate.organization;
	const isValid = certificate.validate();
	if (!isValid.error && org === req.cookies.org) {
		certificate
			.update(db.update)
			.then((certificate) => {
				res.status(200).send(certificate);
			})
			.catch((err) => {
				res.status(500).send(err.message);
			});
	} else {
		res.status(400).send(`Invalid request body. ${isValid.message}`);
	}
};

export const issueOne = async (req: Request, res: Response) => {
	const certificateId = req.params.certificate;
	Certificate.getOne(certificateId, db.getOne)
		.then((certificate) => {
			const org = certificate.organization;
			if (org !== req.cookies.org) throw new Error("Unauthorized");
			const newCert = new Certificate(certificate);
			newCert.issue(db.update, sendEmail);
			res.status(200).send(certificate);
		})
		.catch((err) => {
			res.status(500).send(err.message);
		});
};

const sendEmail = async (
	recipient_: string,
	templateId: string,
	certificateId: string
) => {
	console.log("Sending email to " + recipient_);
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
						link: `https://verify.certwise.app/${certificateId}`,
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

const generateCertificateImage = async (
	generatedCertificate: ICertificate,
	template: ITemplate,
	authorizationHeader: string
) => {
	axios({
		url: env.GENERATE_CERTIFICATE_URL,
		method: "POST",
		data: { certificate: generatedCertificate, template },
		headers: {
			Authorization: authorizationHeader,
		},
	});
};

const generateCertificateImages = async (
	generatedCertificates: ICertificate[],
	template: ITemplate,
	authorizationHeader: string
) => {
	axios({
		url: env.GENERATE_CERTIFICATES_URL,
		method: "POST",
		data: { certificates: generatedCertificates, template },
		headers: {
			Authorization: authorizationHeader,
		},
	});
};
