export type template = {
	id?: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	uid: string;
	canvas: canvas;
	numberOfCertificates: number;
	image?: any;
};

export type canvas = {
	exportCanvasAs: "jpg" | "png";
	height: number;
	width: number;
	items: items;
	activeItem: item | undefined;
	stageRef?: any;
};

export type image = {
	name: string;
	id: string;
	type: "image";
	isConstant: boolean;
	imageStorageRef: string;
	height: number;
	width: number;
	x: number;
	y: number;
	opacity: number;
	rotation: number;
	alt?: string;
	scaleX?: number;
	scaleY?: number;
	flipX?: boolean;
	flipY?: boolean;
	draggable?: boolean;
	src?: HTMLImageElement;
};

export type text = {
	id: string;
	type: "text";
	x: number;
	y: number;
	name: string;
	height: number;
	fill: string;
	width: number;
	isConstant: boolean;
	text: string;
	fontSize: number;
	fontFamily: string;
	textAlign: string;
	rotation: number;
	opacity: number;
	fontStyle?: string;
	fontWeight?: string;
	textDecoration?: string;
	fontFileLink?: string;
	fontFileName?: string;
	fontDisplaySize?: number;
	draggable?: boolean;
};

export type baseImage = {
	name: string;
	id: string;
	type: "base-image";
	imageStorageRef: string;
	height: number;
	width: number;
	x: number;
	y: number;
	opacity: number;
	rotation: number;
	alt?: string;
	scaleX?: number;
	scaleY?: number;
	src: null;
	isConstant: true;
};

export type field = {
	name: string;
	value: string;
};

export type items = Array<image | text | baseImage>;
export type item = image | text | baseImage;

export function isTemplate(template: template): template is template {
	const bool =
		template.name !== undefined &&
		template.uid !== undefined &&
		template.description !== undefined &&
		template.createdAt !== undefined &&
		template.updatedAt !== undefined &&
		template.numberOfCertificates !== undefined &&
		template.name !== null &&
		template.uid !== null &&
		template.description !== null &&
		template.createdAt !== null &&
		template.updatedAt !== null &&
		template.numberOfCertificates !== null &&
		isCanvas(template.canvas);
	if (!bool) console.log("Invalid template (isTemp func in models)");
	return bool;
}

export function isCanvas(canvas: canvas): canvas is canvas {
	const bool =
		canvas.exportCanvasAs !== undefined &&
		canvas.height !== undefined &&
		canvas.width !== undefined &&
		canvas.exportCanvasAs !== null &&
		canvas.height !== null &&
		canvas.width !== null &&
		isItems(canvas.items);
	if (!bool) console.log("Invalid canvas");
	return bool;
}

export function isItem(item: item): item is item {
	const bool =
		item.type !== undefined &&
		item.id !== undefined &&
		item.name !== undefined &&
		item.height !== undefined &&
		item.width !== undefined &&
		item.x !== undefined &&
		item.y !== undefined &&
		item.opacity !== undefined &&
		item.rotation !== undefined &&
		item.isConstant !== undefined &&
		item.type !== null &&
		item.id !== null &&
		item.name !== null &&
		item.height !== null &&
		item.width !== null &&
		item.x !== null &&
		item.y !== null &&
		item.opacity !== null &&
		item.rotation !== null &&
		item.isConstant !== null;
	if (!bool) console.log("Invalid item");
	return bool;
}

export function isItems(items: items): items is items {
	const bool = items.every((item) => isItem(item));
	if (!bool) console.log("Invalid items");
	return bool;
}
