'use strict';
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url);
// require('dotenv').config();
// https://www.npmjs.com/package/dotenv
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjLcKDKBz0RsDqWxXbFxWw_1cZazlHR_o",
    authDomain: "bakalauras-8fdcd.firebaseapp.com",
    databaseURL: "https://bakalauras-8fdcd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bakalauras-8fdcd",
    storageBucket: "bakalauras-8fdcd.appspot.com",
    messagingSenderId: "709385383917",
    appId: "1:709385383917:web:db15e427bf728a5abf41e4",
    measurementId: "G-RB8XZ1X5LJ"

};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);


export {database};