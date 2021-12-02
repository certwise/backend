import db from ".";
import { IUser } from "../models/user";
const userCollection = db.get("users");
userCollection.options = {
	castIds: false,
};
export const create = async (user: IUser) => {
	const req = { _id: user.uid.toString(), ...user };
	const newUser = await userCollection.insert(req, {
		castIds: false,
	});
	return newUser as IUser;
};

export const get = async (uid: string) => {
	const user = await userCollection.findOne({ _id: uid });
	if (!user) throw new Error("User not found");
	else return user as IUser;
};

export const update = async (user: IUser) => {
	console.log("User:", user);
	await userCollection.update({ _id: user.uid }, { $set: { ...user } });
	return user;
};

export const deleteUser = async (uid: string) => {
	await userCollection.remove({ _id: uid });
};
