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
import { ref, getStorage, uploadBytes } from "firebase/storage";
import { ICertificate } from "../models/certificate";
import { ITemplate } from "../models/template";
import { IOrganization } from "../models/organization";
import { IRecipient } from "../models/recipient";
import { IGroup } from "../models/group";

const db = getFirestore();
const certificateCollection = collection(db, "certificates");

export const create = async (certificate: ICertificate) => {
	const templateCollection = collection(db, "templates");
	const certRef = await addDoc(certificateCollection, certificate);
	const templateDoc = doc(templateCollection, certificate.templateId);
	const templateRes = await getDoc(templateDoc);

	const template = templateRes.data() as ITemplate;
	console.log("create cert template:", template);
	template.numberOfCertificates++;
	if (template.certificates) template.certificates.push(certRef.id);
	else template.certificates = [certRef.id];
	await setDoc(templateDoc, template); //set in template

	const organizationCollection = collection(db, "organizations");
	const oDoc = doc(organizationCollection, certificate.organization);
	const oRes = await getDoc(oDoc);
	const organization = oRes.data() as IOrganization;
	console.log("create cert org:", organization);
	if (organization.certificates) organization.certificates.push(certRef.id);
	else organization.certificates = [certRef.id];
	await setDoc(oDoc, organization); //set in organization

	const recipientCollection = collection(db, "recipients");
	const recipientDoc = doc(recipientCollection, certificate.recipient);
	const recipientRes = await getDoc(recipientDoc);
	const recipient = recipientRes.data() as IRecipient;
	console.log("create cert reci:", recipient);

	if (recipient?.certificates) recipient.certificates.push(certRef.id);
	else recipient.certificates = [certRef.id];
	await setDoc(recipientDoc, recipient); //set in recipient

	const groupCollection = collection(db, "groups");
	if (certificate.group !== false) {
		const groupDoc = doc(groupCollection, certificate.group);
		const groupRes = await getDoc(groupDoc);
		const group = groupRes.data() as IGroup;
		if (group.certificates) group.certificates.push(certRef.id);
		else group.certificates = [certRef.id];
		await setDoc(groupDoc, group); //set in group
	}

	return { id: certRef.id, ...certificate } as ICertificate;
};

export const getOne = async (id: string) => {
	const cert = await getDoc(doc(certificateCollection, id));
	return { ...cert.data(), id } as ICertificate;
};

export const getByTemplate = async (templateId: string) => {
	const cQuery = query(
		certificateCollection,
		where("templateId", "==", templateId)
	);
	const certs = await getDocs(cQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const getByGroup = async (group: string) => {
	const gQuery = query(certificateCollection, where("group", "==", group));
	const certs = await getDocs(gQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const getByOrganization = async (
	organization: string
): Promise<ICertificate[]> => {
	const oQuery = query(
		certificateCollection,
		where("organization", "==", organization)
	);
	const certs = await getDocs(oQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const update = async (certificate: ICertificate) => {
	const cDoc = doc(certificateCollection, certificate.id);
	await setDoc(cDoc, certificate);
	return certificate;
};

export const getByRecipient = async (recipient: string) => {
	const rQuery = query(
		certificateCollection,
		where("recipient", "==", recipient)
	);
	const certs = await getDocs(rQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const getByIssuer = async (issuer: string) => {
	const iQuery = query(certificateCollection, where("issuer", "==", issuer));
	const certs = await getDocs(iQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const getRevokedByOrg = async (organization: string) => {
	const iQuery = query(
		certificateCollection,
		where("organization", "==", organization),
		where("revoked", "==", true)
	);
	const certs = await getDocs(iQuery);
	const res: ICertificate[] = [];
	certs.forEach((cert) => {
		res.push({ ...cert.data(), id: cert.id } as ICertificate);
	});
	return res;
};

export const uploadCertificateBuffertoStorage = async (
	buffer: Buffer,
	storageRef: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const storage = getStorage();
		const cRef = ref(storage, storageRef);
		uploadBytes(cRef, buffer)
			.then(() => {
				resolve(storageRef);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
