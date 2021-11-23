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
import { IGroup } from "../../models/group";

const db = getFirestore();
export const getGroup_ = async (id: string): Promise<IGroup | false> => {
	try {
		const group = await getDoc(doc(collection(db, "groups"), id));
		return { ...(group.data() as IGroup), id: group.id };
	} catch (e) {
		console.log(e);
		return false;
	}
};
export const getGroups_ = async (
	institutionId: string
): Promise<IGroup[] | false> => {
	try {
		const group = await getDocs(collection(db, "groups"));
		const groups: IGroup[] = [];
		group.forEach((g) => {
			if (g.data().institution === institutionId)
				groups.push({ ...(g.data() as IGroup), id: g.id });
		});
		return groups;
	} catch (e) {
		console.log(e);
		return false;
	}
};
export const createGroup_ = async (group: IGroup): Promise<string | false> => {
	try {
		const uDoc = collection(db, "groups");
		const doc = await addDoc(uDoc, group);
		return doc.id;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateGroup_ = async (group: IGroup): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "groups"), group.id);
		await setDoc(uDoc, group, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
