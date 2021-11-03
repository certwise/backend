export type user = {
	uid: string;
	name: string;
	email: string;
	institution: string;
	isVerified: boolean;
	createdAt: Date;
	photoURL?: string;
	updatedAt?: Date;

	numberOfCerificatesRemaining: number;
	numberOfCerificatesCreated: number;
	certificates?: string[];

	numberOfTemplatesRemaining: number;
	numberOfTemplatesCreated: number;
	templates: string[];

	currentPlan: string;
	previousSubscriptions: string[];
	topUps: string[];

	stripeCustomerId: string;
};
