import Joi from "joi";
import { Template, TemplateField, templateSchema } from "./template";

export type ICertificate = {
	id?: string;
	issuer: string;
	organization: string;
	isIssued: boolean;
	templateId: string;
	createdAt: Date;
	lastUpdated: Date;
	issueDate: Date | false;
	recipient: string;
	fields: Array<TemplateField>;
	group: string | false;
	validTill: Date | false;
	storageRef?: string;
	isRevoked: boolean;
};

export type Field = {
	name: string;
};

export const certificateSchema = Joi.object().keys({
	id: Joi.string().optional(),
	issuer: Joi.string().required(),
	isIssued: Joi.boolean().required().default(false),
	templateId: Joi.string().required(),
	createdAt: Joi.date().required(),
	lastUpdated: Joi.date().required(),
	issueDate: Joi.alternatives()
		.try(Joi.date(), Joi.boolean().valid(false))
		.required(),
	recipient: Joi.string().required(),
	fields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
	group: Joi.string().required().allow(false),
	validTill: Joi.date().required().allow(false),
	storageRef: Joi.string().optional(),
	isRevoked: Joi.boolean().required().default(false),
	organization: Joi.string().required(),
});

export class Certificate implements ICertificate {
	id?: string;
	issuer: string;
	isIssued: boolean;
	templateId: string;
	createdAt: Date;
	lastUpdated: Date;
	issueDate: Date | false;
	recipient: string;
	fields: Array<TemplateField>;
	group: string | false;
	validTill: Date | false;
	isRevoked: boolean;
	organization: string;
	constructor(data: ICertificate) {
		this.issuer = data.issuer;
		this.isIssued = data.isIssued;
		this.templateId = data.templateId;
		this.createdAt = data.createdAt;
		this.lastUpdated = data.lastUpdated;
		this.issueDate = data.issueDate;
		this.recipient = data.recipient;
		this.fields = data.fields;
		this.group = data.group;
		this.validTill = data.validTill;
		this.isRevoked = data.isRevoked;
		this.organization = data.organization;
	}

	validate(): { error: boolean; message: string } {
		const { error } = certificateSchema.validate(this);
		if (error) {
			return {
				error: true,
				message: error.details[0].message,
			};
		} else {
			return {
				error: false,
				message: "",
			};
		}
	}

	async create(
		dbCreate: (certificate: ICertificate) => Promise<ICertificate>,
		getTemplateImage: (
			template: string,
			fields: TemplateField[]
		) => Promise<Buffer>,
		uploadBufferToStorage: (
			buffer: Buffer,
			storageRef: string
		) => Promise<string>
	): Promise<ICertificate> {
		try {
			const createdCert = await dbCreate({ ...this });
			const templateImageBuffer = await getTemplateImage(
				createdCert.templateId,
				createdCert.fields
			);
			const storageRef = `${createdCert.organization}/certificates/${createdCert.id}.jpg`;
			await uploadBufferToStorage(templateImageBuffer, storageRef);
			return createdCert;
		} catch (err: any) {
			throw new Error(err.toString());
		}
	}

	update(
		dbUpdate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate | false> {
		return new Promise((resolve, reject) => {
			dbUpdate({ ...this })
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	delete(dbDelete: (certificateId: string) => Promise<void>): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.id) {
				const id = this.id;
				dbDelete(id)
					.then(() => {
						resolve();
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				reject();
			}
		});
	}

	static getOne(
		certificateId: string,
		dbGetOne: (certificateId: string) => Promise<ICertificate>
	): Promise<ICertificate> {
		return new Promise((resolve, reject) => {
			dbGetOne(certificateId)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByOrganizaion(
		organizationId: string,
		dbGetByOrganization: (
			organizationId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetByOrganization(organizationId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByGroup(
		groupId: string,
		dbGetByGroup: (groupId: string) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetByGroup(groupId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByTemplate(
		templateId: string,
		dbGetByTemplate: (templateId: string) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetByTemplate(templateId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByIssuer(
		issuer: string,
		dbGetCertificatesByIssuer: (issuer: string) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetCertificatesByIssuer(issuer)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByRecipient(
		recipient: string,
		dbGetCertificatesByRecipient: (
			recipient: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetCertificatesByRecipient(recipient)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getRevoked(
		organizationId: string,
		dbGetRevoked: (organizationId: string) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetRevoked(organizationId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	revoke(
		dbUpdate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate> {
		const data = { ...this };
		data.isRevoked = true;
		data.lastUpdated = new Date();
		return new Promise((resolve, reject) => {
			dbUpdate(data)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	issue(
		dbUpdate: (certificate: ICertificate) => Promise<ICertificate>,
		sendEmail: (recipient: string, templateId: string) => Promise<void>
	): Promise<ICertificate> {
		const data = { ...this };
		data.isRevoked = false;
		data.lastUpdated = new Date();
		return new Promise((resolve, reject) => {
			dbUpdate(data)
				.then(() => {
					return sendEmail(data.recipient, data.templateId);
				})
				.then(() => {
					resolve(data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
