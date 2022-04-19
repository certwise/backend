import { ITemplate } from "../models/template";
import db from ".";
import { ICollection } from "monk";
import { ICertificate } from "../models/certificate";

const templateCollection: ICollection<ITemplate> = db.get("templates");

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
		{ $set: { ...template, updatedAt: new Date() } }
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

export const isUsedTemplate = async (templateId: string): Promise<boolean> => {
	const certificateCollection: ICollection<ICertificate> =
		db.get("certificates");
	const result = await certificateCollection.findOne({
		templateId,
	});
	console.log("isUsedTemplate", !!result);
	return !!result;
};

export const archive = async (templateId: string) => {
	await templateCollection.findOneAndUpdate(
		{ _id: templateId },
		{ $set: { isArchived: true, updatedAt: new Date() } }
	);
};

export const unarchive = async (templateId: string) => {
	await templateCollection.findOneAndUpdate(
		{ _id: templateId },
		{ $set: { isArchived: false, updatedAt: new Date() } }
	);
};

export const getNumberOfCertificates = async (
	templateId: string
): Promise<{ issued: number; created: number; revoked: number }> => {
	const certificateCollection: ICollection<ICertificate> =
		db.get("certificates");
	const issued = await certificateCollection.find({
		templateId,
		isIssued: true,
		isRevoked: false,
	});
	const created = await certificateCollection.find({
		templateId,
		isIssued: false,
		isRevoked: false,
	});
	const revoked = await certificateCollection.find({
		templateId,
		isRevoked: true,
	});

	return {
		issued: issued.length,
		created: created.length,
		revoked: revoked.length,
	};
};
