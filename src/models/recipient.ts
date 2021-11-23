import Joi from "joi";
import { Field } from "./certificate";
export type IRecipient = {
	id: string;
	primaryEmail: string;
	emails: string[];
	name: string;
	createdAt: Date;
	customFields: Field[];
	institutions: string[];
	groups: string[];
};

export const recipientSchema = Joi.object().keys({
	id: Joi.string().required(),
	primaryEmail: Joi.string().required(),
	emails: Joi.array().items(Joi.string()).required(),
	name: Joi.string().required(),
	createdAt: Joi.date().required(),
	institutions: Joi.array().items(Joi.string()).required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
	groups: Joi.array().items(Joi.string()).required(),
});

export class Recipient implements IRecipient {
	id: string;
	primaryEmail: string;
	emails: string[];
	name: string;
	createdAt: Date;
	customFields: Field[];
	institutions: string[];
	groups: string[];

	constructor(recipient: IRecipient) {
		this.id = recipient.id;
		this.primaryEmail = recipient.primaryEmail;
		this.emails = recipient.emails;
		this.name = recipient.name;
		this.createdAt = recipient.createdAt;
		this.customFields = recipient.customFields;
		this.institutions = recipient.institutions;
		this.groups = recipient.groups;
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

	createRecipient(
		recipient: IRecipient,
		dbCreateRecipient: (recipient: IRecipient) => Promise<IRecipient>
	): Promise<IRecipient> {
		return new Promise((resolve, reject) => {
			dbCreateRecipient(recipient)
				.then((recipient) => {
					resolve(recipient);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	updateRecipient(
		recipient: IRecipient,
		dbUpdateRecipient: (recipient: IRecipient) => Promise<IRecipient>
	): Promise<IRecipient> {
		return new Promise((resolve, reject) => {
			dbUpdateRecipient(recipient)
				.then((recipient) => {
					resolve(recipient);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getRecipient(
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

	getRecipientsByInstitution(
		institution: string,
		dbGetRecipientsByInstitution: (institution: string) => Promise<IRecipient[]>
	): Promise<IRecipient[]> {
		return new Promise((resolve, reject) => {
			dbGetRecipientsByInstitution(institution)
				.then((recipients) => {
					resolve(recipients);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getRecipientsByGroup(
		group: string,
		dbGetRecipientsByGroup: (group: string) => Promise<IRecipient[]>
	): Promise<IRecipient[]> {
		return new Promise((resolve, reject) => {
			dbGetRecipientsByGroup(group)
				.then((recipients) => {
					resolve(recipients);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
