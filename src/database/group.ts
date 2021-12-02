import db from ".";
import { IGroup } from "../models/group";

const groupCollection = db.get("groups");

export const create = async (group: IGroup): Promise<IGroup> => {
	const createdOrganization = await groupCollection.insert(group);
	return createdOrganization as IGroup;
};

export const getOne = async (groupId: string): Promise<IGroup> => {
	const group = await groupCollection.findOne({ _id: groupId });
	return group as IGroup;
};

export const getByOrganization = async (
	organization: string
): Promise<IGroup[]> => {
	const groups = await groupCollection.find({ organization: organization });
	return groups as IGroup[];
};

export const update = async (group: IGroup): Promise<IGroup> => {
	await groupCollection.update({ _id: group._id }, { $set: { ...group } });
	return group;
};

export const deleteGroup = async (groupId: string) => {
	await groupCollection.remove({ _id: groupId });
};
