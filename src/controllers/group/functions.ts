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
import { group } from "../../models/group";

const db = getFirestore();
export const getGroup_ = async (id: string): Promise<group | false> => {
	try {
		const group = await getDoc(doc(collection(db, "groups"), id));
		return { ...group.data(), id: group.id } as group;
	} catch (e) {
		console.log(e);
		return false;
	}
};
export const getGroups_ = async (
	institutionId: string
): Promise<group[] | false> => {
	try {
		const group = await getDocs(collection(db, "groups"));
		const groups: group[] = [];
		group.forEach((g) => {
			if (g.data().institution === institutionId)
				groups.push({ ...g.data(), id: g.id } as group);
		});
		return groups as group[];
	} catch (e) {
		console.log(e);
		return false;
	}
};
export const createGroup_ = async (group: group): Promise<string | false> => {
	try {
		const uDoc = collection(db, "groups");
		const doc = await addDoc(uDoc, group);
		return doc.id;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateGroup_ = async (group: group): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "groups"), group.id);
		await setDoc(uDoc, group, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
