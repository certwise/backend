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
} from "firebase/firestore";
import { user } from "../../types/user";
import { createStripeCustomer } from "../payment";

const db = getFirestore();
export const getUser_ = async (uid: string): Promise<user | false> => {
	try {
		const user = await getDoc(doc(collection(db, "users"), uid));
		console.log("ID:", user.id);
		if (!user.data()) return false;
		else return user.data() as user;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createUser_ = async (user: user): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "users"), user.uid);
		await setDoc(uDoc, user);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateUser_ = async (user: user): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "users"), user.uid);
		await setDoc(uDoc, user, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createStripeCustomer_ = async (
	uid: string,
	name: string,
	email: string
) => {
	try {
		const uDoc = doc(collection(db, "users"), uid);
		const customer = await createStripeCustomer(name, email);
		console.log("Customer created:", customer);
		if (customer) {
			await setDoc(uDoc, { stripeCustomerId: customer }, { merge: true });
			return customer;
		} else {
			return false;
		}
	} catch (e) {
		console.log(e);
		return false;
	}
};
