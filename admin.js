const firebase = require('firebase-admin');
const dotenv = require('dotenv');
require('firebase/auth');
dotenv.config();

var config = {
    apiKey : process.env.apiKey,
    authDomain : process.env.appDomain,
    storageBucket : process.env.storageBucket,
    messagingSenderId : process.env.messagingSenderId
}

firebase.initializeApp(config);
