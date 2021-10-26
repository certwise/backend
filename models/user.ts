import { Timestamp } from "@firebase/firestore";

export type user = {
	id: string;
	name: string;
	email: string;
	isVerified: boolean;
	isAdmin: boolean;
	photoURL?: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	canvas: canvas;
};

type canvas = {
	exportCanvasAs: "jpg" | "png";
	//
	//
};
