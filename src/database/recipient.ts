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
import { IOrganization } from "../models/organization";
import { IRecipient } from "../models/recipient";

const db = getFirestore();
const recipientCollection = collection(db, "recipients");

export const create = async (recipient: IRecipient) => {
	// check if recipient with given email already exists
	const checkRecipientQuery = query(
		recipientCollection,
		where("email", "==", recipient.email),
		where("organization", "==", recipient.organization)
	);

	const checkRecipient = await getDocs(checkRecipientQuery);
	if (!checkRecipient.empty) {
		throw new Error("Recipient already exists in this organization.");
	} else {
		console.log(recipient);
		const ref = await addDoc(recipientCollection, recipient);
		console.log("Recipient2", recipient);
		const orgDoc = doc(collection(db, "organizations"), recipient.organization);
		const orgRes = await getDoc(orgDoc);
		const org = { id: orgRes.id, ...orgRes.data() } as IOrganization;
		if (org.recipients) org.recipients.push(ref.id);
		else org.recipients = [ref.id];
		console.log("Adding recipient to organization.");
		await setDoc(orgDoc, org);
		return { ...recipient, id: ref.id } as IRecipient;
	}
};

export const get = async (id: string) => {
	const ref = doc(recipientCollection, id);
	const res = await getDoc(ref);
	return { id: res.id, ...res.data() } as IRecipient;
};

export const getByOrganization = async (organization: string) => {
	const ref = query(
		recipientCollection,
		where("organization", "==", organization)
	);
	const res = await getDocs(ref);
	return res.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IRecipient));
};

export const getByGroup = async (group: string) => {
	const ref = query(
		recipientCollection,
		where("groups", "array-contains", group)
	);
	const res = await getDocs(ref);
	return res.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IRecipient));
};

export const update = async (recipient: IRecipient) => {
	const ref = doc(recipientCollection, recipient.id);
	await setDoc(ref, recipient);
	return recipient;
};
