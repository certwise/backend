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
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import fs from "fs";
import { ICertificate } from "../../models/certificate";
import { ITemplate as template } from "../../models/template";
import { user } from "../../models/user";
import { getTemplateImage, makeid } from "../template/helperFunctions";
import dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MailerSend, { Recipient, EmailParams } from "mailersend";
dotenv.config();
const mailersend = new MailerSend({
	api_key: process.env.MAILERSEND_API_KEY,
});

export const getCertificate_ = () => {
	return null;
};
export const getAllCertificatesByUID_ = async (
	uid: string
): Promise<ICertificate[] | false> => {
	const db = getFirestore();
	const result: ICertificate[] = [];
	try {
		const docs = await getDocs(
			query(collection(db, "certificates"), where("issuerId", "==", uid))
		);
		docs.forEach((doc) => {
			const x: ICertificate = {
				id: doc.id.toString(),
				...(doc.data() as ICertificate),
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
	cert: ICertificate
): Promise<boolean> => {
	const templateId = cert.templateId.replace(/\s/g, "");
	const fields = cert.fields;
	const certificateName = `${cert.recipient}_${makeid(12)}.jpg`;
	const certificateRef = `${cert.issuerId}/certificates/${certificateName}`;
	const db = getFirestore();
	let certificateId = "";
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
				const certificate: ICertificate = {
					...cert,
					storageRef: certificateRef,
				};
				return addDoc(collection(db, "certificates"), certificate);
			})
			.then((docRef) => {
				certificateId = docRef.id;
				console.log("Document added to firestore");
				fs.unlinkSync(`./storage/${certificateName}.jpg`);
				return getDoc(doc(db, "templates", templateId));
			})
			.then((t) => {
				const template: template = { ...(t.data() as template) };
				template.numberOfCertificates++;
				const db = getFirestore();
				return setDoc(doc(db, "templates", templateId), template);
			})
			.then(() => {
				const userRef = doc(collection(db, "users"), cert.issuerId);
				return getDoc(userRef);
			})
			.then((user) => {
				const x: user = user.data() as user;
				const userRef = doc(collection(db, "users"), cert.issuerId);
				x.numberOfCerificatesCreated++;
				return setDoc(userRef, x);
			})
			.then(() => {
				const store = getStorage();
				const storageRef = ref(store, certificateRef);
				return getDownloadURL(storageRef);
			})
			.then((imageLink) => {
				const db = getFirestore();
				const rDoc = doc(collection(db, "recipients"), cert.recipient);
				getDoc(rDoc).then((recipient) => {
					sendMail(recipient.data()?.email, recipient.data()?.name, imageLink);
					resolve(true);
				});
			})
			.catch((e) => {
				console.log(e);
				resolve(false);
			});
	});
};
export const getCertificatesByTemplate_ = async (
	templateId: string
): Promise<ICertificate[] | false> => {
	const db = getFirestore();
	const result: ICertificate[] = [];
	try {
		const docs = await getDocs(
			query(
				collection(db, "certificates"),
				where("templateID", "==", templateId)
			)
		);
		docs.forEach((doc) => {
			result.push({ id: doc.id, ...(doc.data() as ICertificate) });
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
export const updateCertificate_ = async (certificate: ICertificate) => {
	const db = getFirestore();
	try {
		const cert = doc(collection(db, "certificates"), certificate.id);
		const x = await setDoc(cert, certificate);
		console.log(x);
	} catch (err) {
		console.log(err);
		return false;
	}
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

const sendMail = (email: any, name: any, imageLink: any) => {
	console.log("Sending mail", email, name, imageLink);
	const recipients = [new Recipient(email, name)];
	const personalization = [
		{
			email,
			data: {
				name,
				issuer: {
					name: "Sivaram",
				},
				credential: {
					link: imageLink,
					reason: "Certificate",
				},
			},
		},
	];
	const emailParams = new EmailParams()
		.setFrom("credential_noreply@notify.certwise.app")
		.setFromName("Certwise")
		.setRecipients(recipients)
		.setSubject("Digital Credential")
		.setTemplateId("pr9084z2j84w63dn")
		.setPersonalization(personalization);
	mailersend.send(emailParams);
};
