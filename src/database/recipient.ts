import { IRecipient } from "../models/recipient";
import db from ".";

const recipientCollection = db.get("recipients");

export const create = async (recipient: IRecipient) => {
	// check if recipient with given email already exists
	const check = await recipientCollection.find({
		email: recipient.email,
		organization: recipient.organization,
	});
	let result: IRecipient;
	if (check.length === 0) result = await recipientCollection.insert(recipient);
	else throw new Error("Recipient already exists");
	return result;
};

export const createBulk = async (recipients: IRecipient[]) => {
	const result = await recipientCollection.insert(recipients);
	return result;
};

export const get = async (_id: string) => {
	const result = await recipientCollection.findOne({ _id });
	return result as IRecipient;
};

export const getByOrganizaion = async (organization: string) => {
	const result = await recipientCollection.find({ organization });
	if (!result) throw new Error("No recipients in Organization");
	return result as IRecipient[];
};

export const getByGroup = async (group: string) => {
	const result = await recipientCollection.find({ groups: group });
	if (!result) throw new Error("No recipients in Group");
	return result as IRecipient[];
};

export const update = async (recipient: IRecipient) => {
	console.log(recipient);
	await recipientCollection.update(
		{ _id: recipient._id },
		{ $set: { ...recipient } }
	);
	return recipient;
};
