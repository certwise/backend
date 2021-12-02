import db from ".";
import { ref, getStorage, uploadBytes } from "firebase/storage";
import { ICertificate } from "../models/certificate";

const certificateCollection = db.get("certificates");

export const create = async (certificate: ICertificate) => {
	const result = await certificateCollection.insert(certificate);
	return result as ICertificate;
};

export const createMany = async (certificates: ICertificate[]) => {
	const result = await certificateCollection.insert(certificates);
	return result as Array<ICertificate>;
};

export const getOne = async (id: string) => {
	const result = await certificateCollection.findOne({ _id: id });
	if (!result) throw new Error("Certificate not found.");
	else return result as ICertificate;
};

export const getByTemplate = async (templateId: string) => {
	const result = await certificateCollection.find({ templateId: templateId });
	if (!result) throw new Error("No certificates created in this template.");
	else return result as ICertificate[];
};

export const getByGroup = async (group: string) => {
	const result = await certificateCollection.find({ group: group });
	if (!result) throw new Error("No certificates created in this group.");
	else return result as ICertificate[];
};

export const getByOrganization = async (organixation: string) => {
	const result = await certificateCollection.find({
		organization: organixation,
	});
	if (!result) throw new Error("No certificates created in this organization.");
	else return result as ICertificate[];
};

export const update = async (certificate: ICertificate) => {
	const result = await certificateCollection.update(
		{ _id: certificate._id },
		{ $set: { ...certificate } }
	);
	if (!result) throw new Error("Certificate not found.");
	else return certificate;
};

export const getByRecipient = async (recipient: string) => {
	const result = await certificateCollection.find({ recipient: recipient });
	if (!result) throw new Error("No certificates created for this recipient.");
	else return result as ICertificate[];
};

export const getByIssuer = async (issuer: string) => {
	const result = await certificateCollection.find({ issuer: issuer });
	if (!result) throw new Error("No certificates created by this issuer.");
	else return result as ICertificate[];
};

export const getRevokedByOrg = async (organization: string) => {
	const result = await certificateCollection.find({
		organization: organization,
		isRevoked: true,
	});
	if (!result) throw new Error("No revoked certificates in this organization.");
	else return result as ICertificate[];
};

export const getIssued = async (organization: string) => {
	const result = await certificateCollection.find({
		organization: organization,
		isIssued: true,
	});
	if (!result) throw new Error("No issued certificates in this organization.");
	else return result as ICertificate[];
};

export const getExpired = async (organization: string) => {
	const result = await certificateCollection.find({
		organization: organization,
		validTill: { $lt: new Date() },
	});
	if (!result) throw new Error("No expired certificates in this organization.");
	else return result as ICertificate[];
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

export const deleteCertificate = async (id: string) => {
	const result = await certificateCollection.remove({ _id: id });
	if (!result) throw new Error("Certificate not found.");
	else return result;
};
