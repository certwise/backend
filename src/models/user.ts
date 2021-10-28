import { User } from "@firebase/auth";

export declare interface user extends User {
	name: string;
	avatar?: string;
	certificates?: string[];
	isVerified: boolean;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt?: Date;
	subscription?: subscription;
	isSignedIn?: boolean;
}

export type subscription = {
	numberOfCerificatesRemaining: number;
	numberOfCerificatesCreated: number;
	numberOfTemplateRemaining: number;
	numberOfTemplateCreated: number;
	createdTemplates: string[];
	createdCertificates: string[];
	currentPlan: string;
	previousSubscriptions: string[];
	topUps: string[];
};
