import Joi from "joi";
export interface ITemplate {
	id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	uid: string;
	canvas: Canvas;
	numberOfCertificates: number;
	imageRef: string;
	group: string;
	createdBy: string;
	institution: string;
	templateFields: TemplateField[];
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
});

const itemSchema = Joi.object().valid(imageSchema, textSchema);

const canvasSchema = Joi.object().keys({
	exportCanvasAs: Joi.string().valid("jpg", "png").required(),
	height: Joi.number().required(),
	width: Joi.number().required(),
	items: Joi.array().items(itemSchema).required(),
});

export const templateSchema = Joi.object().keys({
	id: Joi.string().optional(),
	name: Joi.string().required(),
	description: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
	uid: Joi.string().required(),
	canvas: canvasSchema,
	numberOfCertificates: Joi.number().required(),
	imageRef: Joi.string().required(),
});

export class Template implements ITemplate {
	id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	uid: string;
	canvas: Canvas;
	numberOfCertificates: number;
	imageRef: string;
	group: string;
	createdBy: string;
	institution: string;
	templateFields: TemplateField[];

	constructor(template: ITemplate) {
		this.id = template.id;
		this.name = template.name;
		this.description = template.description;
		this.createdAt = template.createdAt;
		this.updatedAt = template.updatedAt;
		this.uid = template.uid;
		this.canvas = template.canvas;
		this.numberOfCertificates = template.numberOfCertificates;
		this.imageRef = template.imageRef;
		this.group = template.group;
		this.createdBy = template.createdBy;
		this.institution = template.institution;
		this.templateFields = template.templateFields;
	}

	validate(): { error: boolean; message: string } {
		const { error } = templateSchema.validate(this);
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
		dbCreateTemplate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		return new Promise((resolve, reject) => {
			dbCreateTemplate(this)
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	update(
		dbUpdateTemplate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		return new Promise((resolve, reject) => {
			dbUpdateTemplate(this)
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	delete(
		dbDeleteTemplate: (template: ITemplate) => Promise<ITemplate>
	): Promise<void> {
		return new Promise((resolve, reject) => {
			dbDeleteTemplate(this)
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
		dbUpdateTemplate: (template: ITemplate) => Promise<ITemplate>
	): Promise<ITemplate> {
		const data = { ...this };
		data.name = name;
		return new Promise((resolve, reject) => {
			dbUpdateTemplate(data)
				.then((template) => {
					resolve(template);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	// generateImage
}

export const isTemplate = (x: any) => {
	return true;
};
