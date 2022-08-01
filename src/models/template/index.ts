import Joi from "joi";
import { MailTemplate } from "./MailTemplate";
export interface ITemplate {
	_id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	canvas: Canvas;
	numberOfCertificates: number;
	imageRef: string;
	createdBy: string;
	organization: string;
	templateFields: TemplateField[];
	mailTemplate: MailTemplate;
	isArchived: boolean;
}

export type TemplateField = {
	name: string;
	type: "text" | "image";
	value?: string;
};
export interface Canvas {
	exportCanvasAs: "jpg" | "png";
	height: number;
	width: number;
	items: Items;
}

export type Items = Array<Image | Text>;
export type Item = Image | Text;

export interface CanvasItem {
	id: string;
	name: string;
	type: "image" | "text";
	x: number;
	y: number;
	height: number;
	width: number;
	opacity: number;
	rotation: number;
	flipX: boolean;
	flipY: boolean;
	draggable: boolean;
	isConstant: boolean;
}

export interface Text extends CanvasItem {
	type: "text";
	text: string;
	fontSize: number;
	fontFamily: string;
	horizontalAlign: "center" | "left" | "right";
	verticalAlign: "top" | "middle" | "bottom";
	fontStyle: string;
	textDecoration: string;
	fontFileLink: string;
	fontFileName: string;
	fontDisplaySize: number;
	underline: boolean;
	italic: boolean;
	weight: number;
	fill: string;
}

export interface Image extends CanvasItem {
	type: "image";
	storageRef: string;
	alt: string;
	scaleX: number;
	scaleY: number;
	originalWidth: number;
	originalHeight: number;
}

const imageSchema = Joi.object().keys({
	id: Joi.string().required(),
	name: Joi.string().required(),
	type: Joi.string().valid("image", "text").required(),
	x: Joi.number().required(),
	y: Joi.number().required(),
	height: Joi.number().required(),
	width: Joi.number().required(),
	opacity: Joi.number().required(),
	rotation: Joi.number().required(),
	flipX: Joi.boolean().required(),
	flipY: Joi.boolean().required(),
	draggable: Joi.boolean().required(),
	storageRef: Joi.string().required(),
	originalHeight: Joi.number().required(),
	originalWidth: Joi.number().required(),
});

const textSchema = Joi.object().keys({
	id: Joi.string().required(),
	name: Joi.string().required(),
	type: Joi.string().valid("text").required(),
	x: Joi.number().required(),
	y: Joi.number().required(),
	height: Joi.number().required(),
	width: Joi.number().required(),
	opacity: Joi.number().required(),
	rotation: Joi.number().required(),
	flipX: Joi.boolean().required(),
	flipY: Joi.boolean().required(),
	draggable: Joi.boolean().required(),
	isConstant: Joi.boolean().required(),
	text: Joi.string().required(),
	fontSize: Joi.number().required(),
	fontFamily: Joi.string().required(),
	horizontalAlign: Joi.string().valid("center", "left", "right").required(),
	verticalAlign: Joi.string().valid("top", "middle", "bottom").required(),
	fontStyle: Joi.string().required(),
	textDecoration: Joi.string().required(),
	fontFileLink: Joi.string().required(),
	fontFileName: Joi.string().required(),
	fontDisplaySize: Joi.number().required(),
	underline: Joi.boolean().required(),
	italic: Joi.boolean().required(),
	weight: Joi.number().required(),
	fill: Joi.string().required(),
});

// TODO add itemSchema to canvas items
// const itemSchema = Joi.object().valid(imageSchema, textSchema);

const canvasSchema = Joi.object().keys({
	exportCanvasAs: Joi.string().valid("jpg", "png").required(),
	height: Joi.number().min(800).max(8000).required(),
	width: Joi.number().min(800).max(8000).required(),
	items: Joi.array().items(Joi.any()).required(),
});

export const templateSchema = Joi.object().keys({
	_id: Joi.string().optional(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	canvas: canvasSchema,
	numberOfCertificates: Joi.number().required(),
	imageRef: Joi.string().required().allow(""),
	mailTemplate: Joi.object().keys({
		from: Joi.string().required().allow(""),
		to: Joi.string().required().allow(""),
		subject: Joi.string().required().allow(""),
		cc: Joi.string().required().allow(""),
		message: Joi.string().required().allow(""),
	}),
	createdBy: Joi.string().required(),
	organization: Joi.string().required(),
	templateFields: Joi.array().items(
		Joi.object().keys({
			name: Joi.string().required(),
			type: Joi.string().valid("text", "image").required(),
			value: Joi.string().optional(),
		})
	),
	isArchived: Joi.boolean().required(),
});

export class Template implements ITemplate {
	_id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	canvas: Canvas;
	numberOfCertificates: number;
	imageRef: string;
	createdBy: string;
	organization: string;
	templateFields: TemplateField[];
	isArchived: boolean;
	mailTemplate: MailTemplate;
	constructor(template: ITemplate) {
		if (template._id) this._id = template._id;
		this.name = template.name;
		this.description = template.description;
		this.createdAt = template.createdAt;
		this.updatedAt = template.updatedAt;
		this.canvas = template.canvas;
		this.numberOfCertificates = template.numberOfCertificates;
		this.imageRef = template.imageRef;
		this.createdBy = template.createdBy;
		this.organization = template.organization;
		this.templateFields = template.templateFields;
		this.isArchived = template.isArchived;
		this.mailTemplate = template.mailTemplate;
	}

	validate(): { error: boolean; message: string } {
		const { error } = templateSchema.validate(this);
		if (error) {
			let message = "";
			error.details.forEach((detail) => {
				message += `${detail.message} ...`;
			});
			return {
				error: true,
				message,
			};
		} else {
			return {
				error: false,
				message: "",
			};
		}
	}

	create(
		dbCreateTemplate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		return new Promise((resolve, reject) => {
			dbCreateTemplate({ ...this })
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getOne(
		templateId: string,
		dbGetOneTemplate: (templateId: string) => Promise<ITemplate>
	): Promise<ITemplate> {
		return new Promise((resolve, reject) => {
			dbGetOneTemplate(templateId)
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	static getByOrganization(
		organizationId: string,
		dbGetByOrganization: (organizationId: string) => Promise<ITemplate[]>
	): Promise<ITemplate[]> {
		return new Promise((resolve, reject) => {
			dbGetByOrganization(organizationId)
				.then((templates) => {
					resolve(templates);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	update(
		dbUpdate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		return new Promise((resolve, reject) => {
			dbUpdate({ ...this })
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static delete(
		templateId: string,
		isUsedTemplate: (templateId: string) => Promise<boolean>,
		dbDelete: (templateId: string) => Promise<void>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			isUsedTemplate(templateId)
				.then((isUsed) => {
					if (isUsed)
						throw new Error(
							"Cannot delete template as it has been used to create certificates. Archive the template instead."
						);
					else return dbDelete(templateId);
				})
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	rename(
		name: string,
		dbUpdate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		const data = { ...this };
		data.name = name;
		return new Promise((resolve, reject) => {
			dbUpdate(data)
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	replaceFieldsWithValues(fields: TemplateField[]): ITemplate {
		const data = { ...this };
		data.templateFields = fields;
		return data;
	}

	getTemplateImageWithValues(
		fields: TemplateField[],
		getImageFromTemplate: (
			template: ITemplate,
			fields: TemplateField[]
		) => Promise<Buffer>
	): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			getImageFromTemplate({ ...this }, fields)
				.then((image) => {
					resolve(image);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	getAllFields(): TemplateField[] {
		const result: TemplateField[] = [];
		for (let i = 0; i < this.canvas.items.length; i++) {
			const item = this.canvas.items[i];
			if (item.type === "text") {
				const fields = getFieldsFromString(item.text);
				for (let j = 0; j < fields.length; j++) {
					const field = fields[j];
					if (!result.find((x) => x.name === field))
						result.push({ name: field, type: "text", value: "" });
				}
			}
		}
		return result;
	}

	static archive(
		templateId: string,
		dbArchive: (templateId: string) => Promise<void>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			dbArchive(templateId)
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	static getNumberOfCertificates = (
		templateId: string,
		dbGetNumberOfCertificates: (
			templateId: string
		) => Promise<{ issued: number; created: number; revoked: number }>
	) => {
		return new Promise((resolve, reject) => {
			dbGetNumberOfCertificates(templateId)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};
}

export const isTemplate = (x: any) => {
	return true;
};

const getFieldsFromString = (string: string): string[] => {
	const results = [];
	const re = /{{([^}]+)}}/g;
	let text;
	while ((text = re.exec(string))) {
		results.push(text[1]);
	}
	return results;
};
