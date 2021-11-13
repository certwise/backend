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
import { institution } from "../../types/institution";

const db = getFirestore();
export const getInstitution_ = async (
	uid: string
): Promise<institution | false> => {
	try {
		const institution = await getDoc(doc(collection(db, "institutions"), uid));
		return institution.data() as institution;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createInstitution_ = async (
	institution: institution
): Promise<string | false> => {
	try {
		const uDoc = collection(db, "institutions");
		const doc = await addDoc(uDoc, institution);
		return doc.id;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateInstitution_ = async (
	institution: institution
): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "institutions"), institution.id);
		await setDoc(uDoc, institution, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const setCustomFields_ = async (
	fields: Array<string>,
	institutionId: string
) => {
	try {
		const uDoc = doc(collection(db, "institutions"), institutionId);
		await setDoc(uDoc, { customFields: fields }, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
