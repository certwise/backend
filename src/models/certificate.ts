import Joi from "joi";
import { TemplateField } from "./template";

export type ICertificate = {
	id?: string;
	issuerId: string;
	isIssued: boolean;
	templateId: string;
	createdAt: Date;
	lastUpdated: Date;
	issueDate: Date | false;
	recipient: string;
	fields: Array<TemplateField>;
	group: string | false;
	validTill: Date | true | undefined;
	storageRef: string;
	isRevoked: boolean;
};

export type Field = {
	name: string;
	value: string;
};

export const certificateSchema = Joi.object().keys({
	id: Joi.string().optional(),
	issuerId: Joi.string().required(),
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
	group: Joi.string().required(),
	validTill: Joi.date().required(),
	storageRef: Joi.string().required(),
	isRevoked: Joi.boolean().required().default(false),
});

export class Certificate implements ICertificate {
	id?: string;
	issuerId: string;
	isIssued: boolean;
	templateId: string;
	createdAt: Date;
	lastUpdated: Date;
	issueDate: Date | false;
	recipient: string;
	fields: Array<TemplateField>;
	group: string | false;
	validTill: Date | true | undefined;
	storageRef: string;
	isRevoked: boolean;

	constructor(data: ICertificate) {
		this.id = data.id;
		this.issuerId = data.issuerId;
		this.isIssued = data.isIssued;
		this.templateId = data.templateId;
		this.createdAt = data.createdAt;
		this.lastUpdated = data.lastUpdated;
		this.issueDate = data.issueDate;
		this.recipient = data.recipient;
		this.fields = data.fields;
		this.group = data.group;
		this.validTill = data.validTill;
		this.storageRef = data.storageRef;
		this.isRevoked = data.isRevoked;
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

	create(
		data: ICertificate,
		dbCreateCertificate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate> {
		return new Promise((resolve, reject) => {
			dbCreateCertificate(data)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	update(
		dbUpdateCertificate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate | false> {
		return new Promise((resolve, reject) => {
			dbUpdateCertificate(this)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	delete(
		dbDeleteCertificate: (certificateId: string) => Promise<void>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.id) {
				dbDeleteCertificate(this.id)
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

	getOne(
		dbGetOneCertificate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate | false> {
		return new Promise((resolve, reject) => {
			dbGetOneCertificate(this)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAll(
		institutionId: string,
		dbGetAllCertificates: (
			certificate: ICertificate,
			institutionId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetAllCertificates(this, institutionId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAllByGroup(
		groupId: string,
		dbGetAllCertificatesByGroup: (
			groupId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetAllCertificatesByGroup(groupId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAllByTemplate(
		templateId: string,
		dbGetAllCertificatesByTemplate: (
			templateId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetAllCertificatesByTemplate(templateId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAllByIssuer(
		issuerId: string,
		dbGetAllCertificatesByIssuer: (
			issuerId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetAllCertificatesByIssuer(issuerId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAllByRecipient(
		recipient: string,
		dbGetAllCertificatesByRecipient: (
			recipient: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetAllCertificatesByRecipient(recipient)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getRevoked(
		institutionId: string,
		dbGetRevokedCertificates: (
			institutionId: string
		) => Promise<Array<ICertificate>>
	): Promise<Array<ICertificate>> {
		return new Promise((resolve, reject) => {
			dbGetRevokedCertificates(institutionId)
				.then((certificates) => {
					resolve(certificates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	revokeCertificate(
		dbRevokeCertificate: (certificate: ICertificate) => Promise<ICertificate>
	): Promise<ICertificate | false> {
		const data = { ...this };
		data.isRevoked = true;
		data.lastUpdated = new Date();
		return new Promise((resolve, reject) => {
			dbRevokeCertificate(data)
				.then((certificate) => {
					resolve(certificate);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
