// Move all this to .env
import { initializeApp } from "firebase/app";
const firebaseConfig = {
	apiKey: "AIzaSyBaX8tNR8l6g596VD30jXrb8sqcIay1OQg",
	authDomain: "certify-4bf9a.firebaseapp.com",
	projectId: "certify-4bf9a",
	storageBucket: "certify-4bf9a.appspot.com",
	messagingSenderId: "943355489638",
	appId: "1:943355489638:web:6e608813cb8088a39e6ca7",
};

// Gets port from Heroku
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

const firebaseApp = initializeApp(firebaseConfig);

const env = { firebaseConfig, PORT, firebaseApp };
export default env;
