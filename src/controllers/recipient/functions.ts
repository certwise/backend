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
import { institution } from "../../models/institution";
import { recipient } from "../../models/recipient";

const db = getFirestore();
export const getRecipient_ = async (
	uid: string
): Promise<recipient | false> => {
	try {
		const recipient = await getDoc(doc(collection(db, "recipients"), uid));
		return { ...recipient.data(), id: recipient.id } as recipient;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createRecipient_ = async (
	recipient: recipient,
	institutionId: string
): Promise<boolean> => {
	try {
		const uDoc = collection(db, "recipients");
		const all = await getDocs(uDoc);
		let bool = true;
		all.forEach((doc) => {
			if (doc.data().email === recipient.email) {
				bool = false;
			}
		});
		if (bool) {
			const iDoc = doc(collection(db, "institutions"), institutionId);
			const institution = await getDoc(iDoc);
			const iData: institution = { ...(institution.data() as institution) };
			console.log("Inst id", institutionId);
			console.log("idata :", iData);
			const res = await addDoc(uDoc, recipient);
			iData.recipients.push(res.id);
			await setDoc(doc(collection(db, "institutions"), institutionId), iData);
			return true;
		} else return false;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateRecipient_ = async (
	recipient: recipient
): Promise<boolean> => {
	try {
		const uDoc = doc(collection(db, "recipients"), recipient.id);
		await setDoc(uDoc, recipient, { merge: true });
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
