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

export type recipient = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	certificates?: Array<string>;
};
