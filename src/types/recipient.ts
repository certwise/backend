import Joi from "joi";
import { Field } from "./certificate";
export type recipient = {
	id: string;
	email: string;
	name: string;
	createdAt: Date;
	customFields: Field[];
	institution: string[];
};

export const recipientSchema = Joi.object().keys({
	id: Joi.string().required(),
	email: Joi.string().required(),
	name: Joi.string().required(),
	createdAt: Joi.date().required(),
	institution: Joi.array().items(Joi.string()).required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
});
