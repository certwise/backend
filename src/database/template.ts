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
	deleteDoc,
} from "firebase/firestore";
import { ITemplate } from "../models/template";

const db = getFirestore();
const templateCollection = collection(db, "templates");

export const create = async (template: ITemplate) => {
	const { id } = await addDoc(templateCollection, template);
	return { id, ...template };
};

export const getOne = async (templateId: string) => {
	const tDoc = doc(templateCollection, templateId);
	const template = await getDoc(tDoc);
	return { id: template.id, ...template.data() } as ITemplate;
};

export const getByOrganization = async (organization: string) => {
	const tQuery = query(
		templateCollection,
		where("organization", "==", organization)
	);
	const templates = await getDocs(tQuery);
	const res: ITemplate[] = [];
	templates.forEach((t) => {
		res.push({ id: t.id, ...t.data() } as ITemplate);
	});
	return res;
};

export const getByGroup = async (group: string) => {
	const tQuery = query(
		templateCollection,
		where("groups", "array-contains", group)
	);
	const templates = await getDocs(tQuery);
	const res: ITemplate[] = [];
	templates.forEach((t) => {
		res.push({ id: t.id, ...t.data() } as ITemplate);
	});
	return res;
};

export const update = async (template: ITemplate) => {
	const tDoc = doc(templateCollection, template.id);
	await setDoc(tDoc, template);
	return { id: template.id, ...template };
};

export const deleteTemplate = async (id: string) => {
	const tDoc = doc(templateCollection, id);
	await deleteDoc(tDoc);
	return;
};
