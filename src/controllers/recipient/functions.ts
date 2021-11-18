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
import { recipient } from "../../types/recipient";

const db = getFirestore();
export const getRecipient_ = async (uid: string): Promise<any | false> => {
	try {
		const recipient = await getDoc(doc(collection(db, "recipients"), uid));
		return { ...recipient.data(), id: recipient.id } as any;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const createRecipient_ = async (
	recipient: any,
	institutionId: string
): Promise<boolean> => {
	try {
		console.log(recipient);
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
	recipient: any
): Promise<string | false> => {
	try {
		const uDoc = doc(collection(db, "recipients"), recipient.id);
		await setDoc(uDoc, recipient, { merge: true });
		return recipient.id;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const getAllRecipientsInInstitution_ = async (institutionId: string) => {
	try {
		const iDoc = doc(collection(db, "institutions"), institutionId);
		const institution = await getDoc(iDoc);
		const iData: any = { ...institution.data() };
		const recipients = iData.recipients;
		const uDoc = collection(db, "recipients");
		const queryObj = query(uDoc, where("id", "in", recipients));
		const all = await getDocs(queryObj);
		const res: any = [];
		all.forEach((doc) => {
			res.push({ ...doc.data(), id: doc.id });
			console.log(doc.id);
		});
		return res;
	} catch (e) {
		console.log(e);
		return false;
	}
};
