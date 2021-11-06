export type recipient = {
	id: string;
	email: string;
	name: string;
	phone?: string;
	address?: string;
	institution: Array<string>;
	createdAt: string;
	instituitionId: Array<string>;
};
