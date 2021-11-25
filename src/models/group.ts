import Joi from "joi";
import { Field } from "./certificate";

export interface IGroup {
	id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	recipients: string[];
	organization: string;
	createdBy: string;
	customFields: Field[];
	certificates: string[];
}

export const groupSchema = Joi.object().keys({
	id: Joi.string().optional(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	recipients: Joi.array().items(Joi.string()).required(),
	organization: Joi.string().required().allow(""),
	createdBy: Joi.string().required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
	certificates: Joi.array().items(Joi.string()).required(),
});

export class Group implements IGroup {
	id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	recipients: string[];
	organization: string;
	createdBy: string;
	customFields: Field[];
	certificates: string[];
	constructor(group: IGroup) {
		this.name = group.name;
		this.description = group.description;
		this.createdAt = group.createdAt;
		this.updatedAt = group.updatedAt;
		this.recipients = group.recipients;
		this.organization = group.organization;
		this.createdBy = group.createdBy;
		this.customFields = group.customFields;
		this.certificates = group.certificates;
	}

	validate(): { error: boolean; message: string } {
		const { error } = groupSchema.validate(this);
		const valid = error == null;
		if (valid) {
			return { error: false, message: "" };
		} else {
			const { details } = error;
			const message = details.map((i) => i.message).join(",");
			console.log("error", message);
			return { error: true, message };
		}
	}

	create(dbCreateGroup: (group: IGroup) => Promise<IGroup>): Promise<IGroup> {
		return new Promise((resolve, reject) => {
			dbCreateGroup({ ...this })
				.then((newGroup) => {
					resolve(newGroup);
				})
				.catch((err) => {
					reject("Database writing error" + err);
				});
		});
	}

	update(dbUpdateGroup: (group: IGroup) => Promise<IGroup>): Promise<IGroup> {
		return new Promise((resolve, reject) => {
			if (groupSchema.validate(this))
				dbUpdateGroup({ ...this })
					.then((res) => {
						resolve(res);
					})
					.catch(() => {
						reject("Database updating error");
					});
		});
	}

	static delete(
		groupId: string,
		dbDeleteGroup: (groupId: string) => Promise<void>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			dbDeleteGroup(groupId)
				.then(() => {
					resolve();
				})
				.catch(() => {
					reject("Database deleting error");
				});
		});
	}

	static getOne(
		groupId: string,
		dbGetGroup: (groupId: string) => Promise<IGroup>
	): Promise<IGroup> {
		return new Promise((resolve, reject) => {
			dbGetGroup(groupId)
				.then((group) => {
					resolve(group);
				})
				.catch(() => {
					reject("Database reading error");
				});
		});
	}

	static getByOrganization(
		organizationId: string,
		dbGetGroups: (organizationId: string) => Promise<IGroup[]>
	): Promise<IGroup[]> {
		return new Promise((resolve, reject) => {
			dbGetGroups(organizationId)
				.then((groups) => {
					resolve(groups);
				})
				.catch(() => {
					reject("Database reading error");
				});
		});
	}

	setCustomFields(
		customFields: Field[],
		dbUpdateGroup: (group: IGroup) => Promise<IGroup>
	): Promise<IGroup> {
		const data = { ...this };
		data.customFields = customFields;
		return new Promise((resolve, reject) => {
			dbUpdateGroup(data)
				.then((res) => {
					resolve(res);
				})
				.catch(() => {
					reject("Database writing error");
				});
		});
	}

	addCustomField(
		customField: Field,
		dbUpdateGroup: (group: IGroup) => Promise<IGroup>
	): Promise<IGroup> {
		const data = { ...this };
		if (data.customFields)
			data.customFields = [...data.customFields, customField];
		else data.customFields = [customField];
		return new Promise((resolve, reject) => {
			dbUpdateGroup(data)
				.then((res) => {
					resolve(res);
				})
				.catch(() => {
					reject("Database writing error");
				});
		});
	}

	removeCustomField(
		customFieldName: string,
		dbUpdateGroup: (group: IGroup) => Promise<IGroup>
	): Promise<IGroup> {
		const data = { ...this };
		if (data.customFields) {
			data.customFields = data.customFields.filter(
				(field) => field.name !== customFieldName
			);
		}
		return new Promise((resolve, reject) => {
			dbUpdateGroup(data)
				.then((res) => {
					resolve(res);
				})
				.catch(() => {
					reject("Database writing error");
				});
		});
	}

	addRecipients(
		recipients: string[],
		dbUpdateGroup: (group: IGroup) => Promise<IGroup>
	): Promise<string[]> {
		const data = { ...this };
		if (data.recipients) data.recipients = [...data.recipients, ...recipients];
		else data.recipients = recipients;
		return new Promise((resolve, reject) => {
			dbUpdateGroup(data)
				.then((res) => {
					resolve(res.recipients);
				})
				.catch(() => {
					reject("Database writing error");
				});
		});
	}

	removeRecipients(
		recipients: string[],
		dbUpdateGroup: (group: IGroup) => Promise<IGroup>
	): Promise<IGroup> {
		const data = { ...this };
		if (data.recipients) {
			data.recipients = data.recipients.filter(
				(recipient) => !recipients.includes(recipient)
			);
		}
		return new Promise((resolve, reject) => {
			dbUpdateGroup(data)
				.then((res) => {
					resolve(res);
				})
				.catch(() => {
					reject("Database writing error");
				});
		});
	}
}
