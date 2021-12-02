import { ITemplate } from "../models/template";
import db from ".";

const templateCollection = db.get("templates");

export const create = async (template: ITemplate) => {
	const result = await templateCollection.insert(template);
	return result as ITemplate;
};

export const getOne = async (templateId: string) => {
	const result = await templateCollection.findOne({ _id: templateId });
	return result as ITemplate;
};

export const getByOrganization = async (organization: string) => {
	const result = await templateCollection.find({ organization: organization });
	return result as ITemplate[];
};

export const getByGroup = async (group: string) => {
	const result = await templateCollection.find({ group: group });
	return result as ITemplate[];
};

export const update = async (template: ITemplate) => {
	console.log("Template id", template._id);
	await templateCollection.findOneAndUpdate(
		{ _id: template._id },
		{ $set: { ...template } }
	);
	return template;
};

export const deleteTemplate = async (id: string) => {
	await templateCollection.remove({ _id: id });
};

export const getArchivedByOrganization = async (organization: string) => {
	const result = await templateCollection.find({
		organization: organization,
		archived: true,
	});
	return result as ITemplate[];
};
