import Joi from "joi";

export type institution = {
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
};

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
});
