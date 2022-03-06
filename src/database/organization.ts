import db from ".";
import { IOrganization } from "../models/organization";
import { IUser } from "../models/user";
import { get as getUser, update as updateUser } from "./user";

const orgCollection = db.get("organizations");

export const create = async (organization: IOrganization) => {
	const createdOrganization: IOrganization = await orgCollection.insert(
		organization
	);
	try {
		const user: IUser = await getUser(organization.createdBy);
		user.organization = createdOrganization._id as string;
		await updateUser(user);
		return createdOrganization as IOrganization;
	} catch (e: any) {
		console.log(e);
		orgCollection.remove({ _id: createdOrganization._id });
		throw new Error("Error updating user");
	}
};

export const get = async (organizationId: string) => {
	const organization = await orgCollection.findOne({ _id: organizationId });
	return organization as IOrganization;
};

export const update = async (organization: IOrganization) => {
	await orgCollection.update(
		{ _id: organization._id },
		{ $set: { ...organization } }
	);
	return organization as IOrganization;
};

export const getByUser = async (userId: string) => {
	const organization = await orgCollection.findOne({
		createdBy: userId,
	});
	return organization as IOrganization;
};
