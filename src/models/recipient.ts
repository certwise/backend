import Joi from "joi";
import { Field } from "./certificate";

// Recipient is unique for each organization (primary key is organization&&email)
// One end user shall be assigned to multiple recipient documents
// Two or more recipient docs can have same emails in different organizations
export interface IRecipient {
	id?: string;
	email: string;
	name: string;
	createdAt: Date;
	customFields: Field[];
	organization: string;
	groups: string[];
	certificates: string[];
}

export const recipientSchema = Joi.object().keys({
	id: Joi.string().optional().allow("").allow(null),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	name: Joi.string().required(),
	createdAt: Joi.date().required(),
	organization: Joi.string().required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
	groups: Joi.array().items(Joi.string()).required(),
	certificates: Joi.array().items(Joi.string()).required(),
});

export class Recipient implements IRecipient {
	id?: string;
	email: string;
	name: string;
	createdAt: Date;
	customFields: Field[];
	organization: string;
	groups: string[];
	certificates: string[];

	constructor(recipient: IRecipient) {
		this.email = recipient.email;
		this.name = recipient.name;
		this.createdAt = recipient.createdAt;
		this.customFields = recipient.customFields;
		this.organization = recipient.organization;
		this.groups = recipient.groups;
		this.certificates = recipient.certificates;
	}

	validate(): { error: boolean; message: string } {
		const { error } = recipientSchema.validate(this);
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
		dbCreateRecipient: (recipient: IRecipient) => Promise<IRecipient>
	): Promise<IRecipient> {
		return new Promise((resolve, reject) => {
			dbCreateRecipient({ ...this })
				.then((recipient) => {
					resolve(recipient);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	update(
		dbUpdateRecipient: (recipient: IRecipient) => Promise<IRecipient>
	): Promise<IRecipient> {
		return new Promise((resolve, reject) => {
			dbUpdateRecipient({ ...this })
				.then((recipient) => {
					resolve(recipient);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static get(
		id: string,
		dbGetRecipient: (id: string) => Promise<IRecipient>
	): Promise<IRecipient> {
		return new Promise((resolve, reject) => {
			dbGetRecipient(id)
				.then((recipient) => {
					resolve(recipient);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByOrganization(
		organization: string,
		dbGetByOrganization: (organization: string) => Promise<IRecipient[]>
	): Promise<IRecipient[]> {
		return new Promise((resolve, reject) => {
			dbGetByOrganization(organization)
				.then((recipients) => {
					resolve(recipients);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getByGroup(
		group: string,
		dbGetByGroup: (group: string) => Promise<IRecipient[]>
	): Promise<IRecipient[]> {
		return new Promise((resolve, reject) => {
			dbGetByGroup(group)
				.then((recipients) => {
					resolve(recipients);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
