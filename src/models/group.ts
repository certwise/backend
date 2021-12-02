import Joi from "joi";
import { Field } from "./certificate";
import { CustomField } from "./organization";

export interface IGroup {
	_id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	organization: string;
	createdBy: string;
	customFields: CustomField[];
	color: string;
}

export const groupSchema = Joi.object().keys({
	_id: Joi.string().optional(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	organization: Joi.string().required().allow(""),
	createdBy: Joi.string().required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().optional(),
				value: Joi.string().optional(),
				type: Joi.string().optional(),
			})
		)
		.required(),
	color: Joi.string().required(),
});

export class Group implements IGroup {
	_id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	organization: string;
	createdBy: string;
	customFields: CustomField[];
	color: string;
	constructor(group: IGroup) {
		if (group._id) this._id = group._id;
		this.name = group.name;
		this.description = group.description;
		this.createdAt = group.createdAt;
		this.updatedAt = group.updatedAt;
		this.organization = group.organization;
		this.createdBy = group.createdBy;
		this.customFields = group.customFields;
		this.color = group.color;
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
}
