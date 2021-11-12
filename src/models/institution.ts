export type institution = {
	id: string;
	name: string;
	createdBy: string;
	createdAt: Date;
	recipients: Array<string>;
	subscriptions: Array<string>;
	activeSubscription: string;
	templates: Array<string>;
	certificates: Array<string>;
	admins: Array<string>;
	customFields: Array<string>;
};
