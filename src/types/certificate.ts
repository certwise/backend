import { recipient } from "./recipient";

export type certificate = {
	id?: string;
	issuerId: string;
	templateId: string;
	issueDate: Date | false;
	createdAt: Date;
	lastUpdated: Date;
	validTill: Date | true | undefined;
	recipient: recipient;
	fields: Array<Field>;
	storageRef?: string;
};

export type Field = {
	name: string;
	value: string;
};
