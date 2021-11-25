import Joi from "joi";

export interface IOrganization {
	id?: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	recipients: Array<string>;
	subscriptions: Array<string>;
	activeSubscription: string;
	templates: Array<string>;
	certificates: Array<string>;
	admins?: Array<string>;
	customFields: Array<string>;
	groups: Array<string>;
	lastUpdated: Date;
	email: string;
	metaData?: {
		city?: string;
		country?: string;
		address?: string;
		phone?: string;
		website?: string;
		logo?: string;
		description?: string;
		picture?: string;
		postalCode?: string;
	};
}

export const organizationSchema = Joi.object().keys({
	id: Joi.string().optional().allow(""),
	name: Joi.string().required(),
	createdBy: Joi.string().required(),
	createdAt: Joi.date().required(),
	recipients: Joi.array().items(Joi.string()).required(),
	subscriptions: Joi.array().items(Joi.string()).required(),
	activeSubscription: Joi.string().required(),
	templates: Joi.array().items(Joi.string()).required(),
	certificates: Joi.array().items(Joi.string()).required(),
	admins: Joi.array().items(Joi.string()).required(),
	customFields: Joi.array().items(Joi.string()).required(),
	groups: Joi.array().items(Joi.string()).required(),
	lastUpdated: Joi.date().required(),
	metaData: Joi.object()
		.keys({
			city: Joi.string().optional(),
			country: Joi.string().optional,
			address: Joi.string().optional,
			phone: Joi.string().optional,
			email: Joi.string().optional,
			website: Joi.string().optional,
			logo: Joi.string().optional,
			description: Joi.string().optional,
			picture: Joi.string().optional,
		})
		.optional(),
});

export class Organization implements IOrganization {
	id?: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	recipients: Array<string>;
	subscriptions: Array<string>;
	activeSubscription: string;
	templates: Array<string>;
	certificates: Array<string>;
	admins?: Array<string>;
	customFields: Array<string>;
	groups: Array<string>;
	lastUpdated: Date;
	metaData?: {
		city?: string | undefined;
		country?: string | undefined;
		address?: string | undefined;
		phone?: string | undefined;
		website?: string | undefined;
		logo?: string | undefined;
		description?: string | undefined;
		picture?: string | undefined;
		postalCode?: string | undefined;
	};
	constructor(organization: IOrganization) {
		this.name = organization.name;
		this.createdBy = organization.createdBy;
		this.createdAt = organization.createdAt;
		this.recipients = organization.recipients;
		this.subscriptions = organization.subscriptions;
		this.activeSubscription = organization.activeSubscription;
		this.templates = organization.templates;
		this.certificates = organization.certificates;
		this.customFields = organization.customFields;
		this.groups = organization.groups;
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

	create(dbCreate: (organization: IOrganization) => Promise<IOrganization>) {
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
