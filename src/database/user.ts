import {
	getFirestore,
	collection,
	addDoc,
	setDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	deleteDoc,
} from "firebase/firestore";
import { IUser } from "../models/user";

const db = getFirestore();
const usersCollection = collection(db, "users");

export const create = async (user: IUser) => {
	const userDoc = doc(usersCollection, user.uid);
	await setDoc(userDoc, user);
	return user;
};

export const get = async (id: string) => {
	const userRef = doc(usersCollection, id);
	const user = await getDoc(userRef);
	return { uid: user.id, ...user.data() } as IUser;
};

export const update = async (user: IUser) => {
	const userRef = doc(usersCollection, user.uid);
	await setDoc(userRef, user);
	return user;
};

export const deleteUser = async (id: string) => {
	const userRef = doc(usersCollection, id);
	await deleteDoc(userRef);
	return;
};
