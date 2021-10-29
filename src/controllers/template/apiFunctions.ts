import { isTemplate, items, template } from "../../models/template";
import { getTemplateFields } from "./helperFunctions";
import {
	getFirestore,
	collection,
	addDoc,
	getDoc,
	getDocs,
	where,
	setDoc,
	doc,
	deleteDoc,
	query,
} from "firebase/firestore";

export const createTemplate_ = async (
	template: template
): Promise<string | false> => {
	const db = getFirestore();
	if (isTemplate(template)) {
		try {
			const docRef = await addDoc(collection(db, "templates"), template);
			console.log(
				"Creating a new template for user: ",
				template.uid,
				"with name: ",
				template.name
			);
			console.log("Template:", template);
			return "Template created successfully with id: " + docRef.id;
		} catch (err) {
			console.log("Error creating template - ", err);
			return false;
		}
	} else {
		console.log("Template is not valid (in createTemplate_)");
		return false;
	}
};

export const getTemplateById_ = async (
	id: string
): Promise<template | false> => {
	const db = getFirestore();
	try {
		const template = await getDoc(doc(db, "templates", id));
		console.log("Getting template with id: ", id);
		if (template.data()) {
			console.log("Template data: ", template.data() as template);
			return { ...(template.data() as template), id: template.id };
		} else {
			console.error("Template does not exist");
			return false;
		}
	} catch (error) {
		console.log("Error getting template by id - ", error);
		return false;
	}
};

export const getTemplatesByUid_ = async (
	uid: string
): Promise<template[] | false> => {
	const db = getFirestore();
	const result: template[] = [];
	try {
		const templates = await getDocs(
			query(collection(db, "templates"), where("uid", "==", uid))
		);
		templates.forEach((res) => {
			result.push({ ...(res.data() as template), id: res.id });
		});
		console.log("Getting templates of user with uid :", uid);
		console.log("Result :", result);
		return result;
	} catch (error) {
		console.log("Error getting templates by uid - ", error);
		return false;
	}
};

export const deleteTemplate_ = async (id: string): Promise<boolean> => {
	const db = getFirestore();
	try {
		console.log("Deleting template with id: ", id);
		await deleteDoc(doc(db, "templates", id));
		return true;
	} catch (e) {
		console.log("Error deleting templates - ", e);
		return false;
	}
};

export const updateTemplate_ = async (template: template): Promise<boolean> => {
	const db = getFirestore();
	console.log("Updating");
	if (isTemplate(template) && template.id !== undefined) {
		try {
			console.log("Updating template with id: ", template.id);
			const docRef = doc(db, "templates", template.id.trim());
			await setDoc(docRef, template, {
				merge: true,
			});
			return true;
		} catch (e) {
			console.log("Error updating templates - ", e);
			return false;
		}
	} else {
		console.log("Template is not valid (in updateTemplate_)");
		return false;
	}
};

export const updateItems_ = (templateId: string, items: items) => {
	return templateId + items;
};

export const getFieldsFromTemplate_ = async (
	templateId: string
): Promise<string[] | false> => {
	console.log("Getting fields...");
	try {
		const fields = await getTemplateFields(templateId.replace(/\s/g, ""));
		console.log("Fields:", fields);
		return fields;
	} catch (err) {
		console.log("Error getting fields from templates - ", err);
		return false;
	}
};

export const getNumberOfCertificatesInTemplate_ = async (
	templateId: string
): Promise<number | false> => {
	const db = getFirestore();
	try {
		const docs = await getDocs(
			query(
				collection(db, "certificates"),
				where("templateId", "==", templateId)
			)
		);
		let count = 0;
		docs.forEach(() => {
			count++;
		});
		return count;
	} catch (e) {
		console.log("Error getting number of certificates in templates - ", e);

		return false;
	}
};

export const getTemplatesNamesByUid_ = async (
	uid: string
): Promise<string[] | false> => {
	const db = getFirestore();
	console.log("Getting templates names by uid - ", uid);
	try {
		const result = await getDocs(
			query(collection(db, "templates"), where("issuerId", "==", uid))
		);
		const res: string[] = [];
		result.forEach((template) => {
			if (template.data().uid === uid) {
				const name = template.data().name;
				res.push(name);
			}
		});
		console.log(res);
		return res;
	} catch (e) {
		console.log("Error getting templates names by uid - ", e);
		return false;
	}
};

export const getTemplateByNameAndUid_ = async (
	templateName: string,
	uid: string
): Promise<template | false> => {
	console.log("Getting template by name and uid - ", templateName, uid);
	return new Promise((resolve) => {
		const db = getFirestore();
		getDocs(query(collection(db, "templates"), where("uid", "==", uid))).then(
			(results) => {
				results.forEach((template) => {
					if (
						template.data().name.toLowerCase().replace(/\s/g, "") ===
						templateName
					) {
						resolve({
							...(template.data() as template),
							id: template.id,
						} as template);
					}
				});
			}
		);
	});
};

export const renameTemplate_ = async (
	id: string,
	name: string
): Promise<boolean> => {
	console.log("Renaming template with id: ", id);
	const db = getFirestore();
	const templateRef = doc(db, "templates", id);
	await setDoc(templateRef, { name: name }, { merge: true });
	return true;
};
