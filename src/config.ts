import { initializeApp } from "firebase/app";
import {
	initializeApp as adminInitializeApp,
	applicationDefault,
} from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

adminInitializeApp({
	credential: applicationDefault(),
	projectId: process.env.REACT_APP_FIREBASE_projectId,
});

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_apiKey,
	authDomain: process.env.REACT_APP_FIREBASE_authDomain,
	projectId: process.env.REACT_APP_FIREBASE_projectId,
	storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
	messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
	appId: process.env.REACT_APP_FIREBASE_appId,
	measurementId: process.env.REACT_APP_FIREBASE_measurementId,
};

// Gets port from Heroku
// eslint-disable-next-line no-undef

const PORT = process.env.PORT || 5000;

initializeApp(firebaseConfig);

const env = {
	PORT,
	GENERATE_CERTIFICATE_URL: process.env.GENERATE_CERTIFICATE_URL,
	GENERATE_CERTIFICATES_URL: process.env.GENERATE_CERTIFICATES_URL,
};

export default env;
