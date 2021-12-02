import Joi from "joi";

export interface IOrganization {
	_id?: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	customFields: Array<CustomField>;
	lastUpdated: Date;
	email: string;
	metaData?: {
		city?: string;
		country?: string;
		address?: string;
		phone?: string;
		state?: string;
		website?: string;
		logo?: string;
		description?: string;
		picture?: string;
		postalCode?: string;
	};
}

const metaDataSchema = Joi.object().keys({
	city: Joi.string().optional().allow(""),
	country: Joi.string().optional().allow(""),
	address: Joi.string().optional().allow(""),
	phone: Joi.string().optional().allow(""),
	website: Joi.string().optional().allow(""),
	logo: Joi.string().optional().allow(""),
	description: Joi.string().optional().allow(""),
	picture: Joi.string().optional().allow(""),
	postalCode: Joi.string().optional().allow(""),
	state: Joi.string().optional().allow(""),
});

export const customFieldSchema = Joi.object().keys({
	name: Joi.string().required(),
	type: Joi.string().optional(),
	value: Joi.string().optional(),
});

export const organizationSchema = Joi.object().keys({
	_id: Joi.string().optional().allow(""),
	name: Joi.string().required(),
	createdBy: Joi.string().required(),
	createdAt: Joi.date().required(),
	customFields: Joi.array().items(customFieldSchema).required(),
	lastUpdated: Joi.date().required(),
	email: Joi.string().email().required(),
	metaData: metaDataSchema.optional(),
});

export type CustomField = {
	name: string;
	type?: string;
	value?: string;
};
export class Organization implements IOrganization {
	_id?: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	customFields: Array<CustomField>;
	lastUpdated: Date;
	metaData?: {
		city?: string;
		country?: string;
		address?: string;
		phone?: string;
		state?: string;
		website?: string;
		logo?: string;
		description?: string;
		picture?: string;
		postalCode?: string;
	};
	constructor(organization: IOrganization) {
		if (organization._id) this._id = organization._id;
		this.name = organization.name;
		this.createdBy = organization.createdBy;
		this.createdAt = organization.createdAt;
		this.customFields = organization.customFields;
		this.lastUpdated = new Date();
		this.email = organization.email;
		if (organization.metaData) this.metaData = organization.metaData;
	}
	email: string;

	validate(): { error: boolean; message: string } {
		const { error } = organizationSchema.validate(this);
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
		dbCreate: (organization: IOrganization) => Promise<IOrganization>
	): Promise<IOrganization> {
		return new Promise((resolve, reject) => {
			const data = { ...this };
			dbCreate(data)
				.then((organization) => resolve(organization))
				.catch((err) => reject(err));
		});
	}

	static get(
		organization: string,
		dbGet: (id: string) => Promise<IOrganization>
	): Promise<IOrganization> {
		return new Promise((resolve, reject) => {
			dbGet(organization)
				.then((res) => resolve(res))
				.catch((err) => reject(err));
		});
	}

	update(
		dbUpdateOrganization: (
			organization: IOrganization
		) => Promise<IOrganization>
	) {
		const data = { ...this };
		data.lastUpdated = new Date();
		return new Promise((resolve, reject) => {
			dbUpdateOrganization(data)
				.then((organization) => resolve(organization))
				.catch((err) => reject(err));
		});
	}

	delete(
		dbDeleteOrganization: (
			organization: IOrganization
		) => Promise<IOrganization>
	) {
		return new Promise((resolve, reject) => {
			dbDeleteOrganization({ ...this })
				.then((organization) => resolve(organization))
				.catch((err) => reject(err));
		});
	}
}
