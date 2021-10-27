"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Move all this to .env
var app_1 = require("firebase/app");
var firebaseConfig = {
    apiKey: "AIzaSyBaX8tNR8l6g596VD30jXrb8sqcIay1OQg",
    authDomain: "certify-4bf9a.firebaseapp.com",
    projectId: "certify-4bf9a",
    storageBucket: "certify-4bf9a.appspot.com",
    messagingSenderId: "943355489638",
    appId: "1:943355489638:web:6e608813cb8088a39e6ca7"
};
// Gets port from Heroku
// eslint-disable-next-line no-undef
var PORT = process.env.PORT;
var firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
var env = { firebaseConfig: firebaseConfig, PORT: PORT, firebaseApp: firebaseApp };
exports.default = env;
