export type user = {
	uid: string;
	name: string;
	email: string;
	institution: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt?: Date;
	numberOfTemplatesCreated: number;
	numberOfCerificatesCreated: number;
};
