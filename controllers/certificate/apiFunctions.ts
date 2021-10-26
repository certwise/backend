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
import { getStorage, uploadBytes, ref } from "firebase/storage";
import fs from "fs";
import { certificate } from "../../models/certificate";
import { getTemplateImage, makeid } from "../template/helperFunctions";

export const getCertificate_ = () => {
	return null;
};
export const getAllCertificatesByUID_ = async (
	uid: string
): Promise<certificate[] | false> => {
	const db = getFirestore();
	const result: certificate[] = [];
	try {
		const docs = await getDocs(
			query(collection(db, "certificates"), where("issuerId", "==", uid))
		);
		docs.forEach((doc) => {
			const x: certificate = {
				id: doc.id.toString(),
				...(doc.data() as certificate),
			};
			result.push(x);
		});
		return result;
	} catch (err) {
		console.log(err);
		return false;
	}
};
export const createSingleCertificate_ = (
	cert: certificate
): Promise<boolean> => {
	const templateId = cert.templateId.replace(/\s/g, "");
	const fields = cert.fields;
	const certificateName = `${cert.recipient.name}_${makeid(12)}.jpg`;
	const certificateRef = `${cert.issuerId}/certificates/${certificateName}`;
	return new Promise((resolve) => {
		getTemplateImage(templateId, fields)
			.then((buffer: any) => {
				console.log("Buffer created");
				fs.writeFileSync(`./storage/${certificateName}.jpg`, buffer);
				const file = fs.readFileSync(`./storage/${certificateName}.jpg`);
				return uploadBytes(ref(getStorage(), certificateRef), file);
			})
			.then(() => {
				console.log("File uploaded");
				const db = getFirestore();
				const certificate: certificate = {
					...cert,
					storageRef: certificateRef,
				};
				return addDoc(collection(db, "certificates"), certificate);
			})
			.then(() => {
				console.log("Document added to firestore");
				//fs.unlinkSync(`./storage/${certificateName}.jpg`);
				const db = getFirestore();
				return getDoc(doc(db, "templates", templateId));
			})
			.then((t) => {
				const template = { ...t.data() };
				if (template["numberOfCertificates"] > 0)
					template["numberOfCertificates"]++;
				else template["numberOfCertificates"] = 1;
				const db = getFirestore();
				return setDoc(doc(db, "templates", templateId), template);
			})
			.then(() => resolve(true))
			.catch(() => {
				resolve(false);
			});
	});
};
export const getCertificatesByTemplate_ = async (
	templateId: string
): Promise<certificate[] | false> => {
	const db = getFirestore();
	const result: certificate[] = [];
	try {
		const docs = await getDocs(
			query(
				collection(db, "certificates"),
				where("templateID", "==", templateId)
			)
		);
		docs.forEach((doc) => {
			result.push({ id: doc.id, ...(doc.data() as certificate) });
		});
		return result;
	} catch (err) {
		console.log(err);
		return false;
	}
};
export const bulkCreateCertificates_ = () => {
	return null;
};
export const updateCertificate_ = () => {
	return null;
};
export const bulkUpdateCertificates_ = () => {
	return null;
};
export const deleteCertificate_ = () => {
	return null;
};
export const bulkDeleteCertificates_ = () => {
	return null;
};
