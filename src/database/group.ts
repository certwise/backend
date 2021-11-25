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
import { IGroup } from "../models/group";
import { IOrganization } from "../models/organization";
import dotenv from "dotenv";
dotenv.config();

const db = getFirestore();
const groupsCollection = collection(db, "groups");

export const create = async (group: IGroup) => {
	const groupRef = await addDoc(groupsCollection, group);

	const orgRef = collection(db, "organizations");
	const orgDoc = doc(orgRef, group.organization);
	const orgRes = await getDoc(orgDoc);
	const org = orgRes.data() as IOrganization;
	if (org.groups) org.groups.push(groupRef.id);
	else org.groups = [groupRef.id];
	await setDoc(orgDoc, org);

	return { id: groupRef.id, ...group } as IGroup;
};

export const getOne = async (groupId: string) => {
	const groupRef = doc(groupsCollection, groupId);
	const groupRes = await getDoc(groupRef);
	const group = { id: groupId, ...groupRes.data() } as IGroup;
	return group;
};

export const getByOrganization = async (organization: string) => {
	const gQuery = query(
		groupsCollection,
		where("organization", "==", organization)
	);
	const groups = await getDocs(gQuery);
	const res: IGroup[] = [];
	groups.forEach((group) => {
		res.push({ ...group.data(), id: group.id } as IGroup);
	});
	return res;
};

export const update = async (group: IGroup) => {
	const groupRef = doc(groupsCollection, group.id);
	await setDoc(groupRef, group);
	return group;
};

export const deleteGroup = async (groupId: string) => {
	const groupRef = doc(groupsCollection, groupId);
	await deleteDoc(groupRef);
	return;
};
