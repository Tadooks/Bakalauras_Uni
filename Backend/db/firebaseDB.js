'use strict';

import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdDQg97wkwKR3M2PEljeOLl2u4tHpJHko",
    authDomain: "melonter-ed65b.firebaseapp.com",
    databaseURL: "https://melonter-ed65b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "melonter-ed65b",
    storageBucket: "melonter-ed65b.appspot.com",
    messagingSenderId: "55137342194",
    appId: "1:55137342194:web:ea805390b4a7c9bde4366b",
    measurementId: "G-9CPBV9W135"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);


export {database};