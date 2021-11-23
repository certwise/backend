import Joi from "joi";

export interface I_Institution {
	id: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	recipients: Array<string>;
	subscriptions: Array<string>;
	activeSubscription: string;
	templates: Array<string>;
	certificates: Array<string>;
	admins: Array<string>;
	customFields: Array<string>;
	groups: Array<string>;
	lastUpdated: Date;
}

export const institutionSchema = Joi.object().keys({
	id: Joi.string().required(),
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
});

export class Institution implements I_Institution {
	id: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	recipients: Array<string>;
	subscriptions: Array<string>;
	activeSubscription: string;
	templates: Array<string>;
	certificates: Array<string>;
	admins: Array<string>;
	customFields: Array<string>;
	groups: Array<string>;
	lastUpdated: Date;
	constructor(institution: I_Institution) {
		this.id = institution.id;
		this.name = institution.name;
		this.createdBy = institution.createdBy;
		this.createdAt = institution.createdAt;
		this.recipients = institution.recipients;
		this.subscriptions = institution.subscriptions;
		this.activeSubscription = institution.activeSubscription;
		this.templates = institution.templates;
		this.certificates = institution.certificates;
		this.admins = institution.admins;
		this.customFields = institution.customFields;
		this.groups = institution.groups;
		this.lastUpdated = new Date();
	}

	validate(): { error: boolean; message: string } {
		const { error } = institutionSchema.validate(this);
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
		dbCreateInstitution: (institution: I_Institution) => Promise<I_Institution>
	) {
		return new Promise((resolve, reject) => {
			dbCreateInstitution(this)
				.then((institution) => resolve(institution))
				.catch((err) => reject(err));
		});
	}

	update(
		dbUpdateInstitution: (institution: I_Institution) => Promise<I_Institution>
	) {
		const data = { ...this };
		data.lastUpdated = new Date();
		return new Promise((resolve, reject) => {
			dbUpdateInstitution(this)
				.then((institution) => resolve(institution))
				.catch((err) => reject(err));
		});
	}

	delete(
		dbDeleteInstitution: (institution: I_Institution) => Promise<I_Institution>
	) {
		return new Promise((resolve, reject) => {
			dbDeleteInstitution(this)
				.then((institution) => resolve(institution))
				.catch((err) => reject(err));
		});
	}
}
