import Joi from "joi";
import { Field } from "./certificate";

export type group = {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	recipients: string[];
	institution: string;
	createdBy: string;
	customFields: Field[];
};

export const groupSchema = Joi.object().keys({
	id: Joi.string().required(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	createdAt: Joi.string().required(),
	updatedAt: Joi.string().required(),
	recipients: Joi.array().items(Joi.string()).required(),
	institution: Joi.string().required(),
	createdBy: Joi.string().required(),
	customFields: Joi.array()
		.items(
			Joi.object().keys({
				name: Joi.string().required(),
				value: Joi.string().required(),
			})
		)
		.required(),
});
