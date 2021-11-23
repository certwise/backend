import Joi from "joi";

export type certificate = {
	id?: string;
	issuerId: string;
	isIssued: boolean;
	templateId: string;
	createdAt: Date;
	lastUpdated: Date;
	issueDate: Date | false;
	recipient: string;
	fields: Array<Field>;
	group: string | false;
	validTill: Date | true | undefined;
	storageRef: string;
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
});
