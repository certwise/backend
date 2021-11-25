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
import { IOrganization, Organization } from "../models/organization";
import { IUser } from "../models/user";

const db = getFirestore();
const orgCollection = collection(db, "organizations");

export const create = async (organization: IOrganization) => {
	const org = await addDoc(orgCollection, organization);

	const userCollection = collection(db, "users");
	const uDoc = doc(userCollection, organization.createdBy);
	const user = await getDoc(uDoc);
	const userData = { uid: user.id, ...user.data() } as IUser;
	userData.organization = org.id;
	await setDoc(uDoc, userData);

	return { ...organization, id: org.id } as IOrganization;
};

export const get = async (organizationId: string) => {
	const orgDoc = doc(orgCollection, organizationId);
	const org = await getDoc(orgDoc);
	return { ...org.data(), id: org.id } as IOrganization;
};

export const update = async (organization: IOrganization) => {
	const orgDoc = doc(orgCollection, organization.id);
	await setDoc(orgDoc, organization);
	return organization;
};
