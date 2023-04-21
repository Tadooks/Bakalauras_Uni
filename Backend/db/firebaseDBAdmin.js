'use strict';


// https://firebase.google.com/docs/admin/setup?authuser=0
import {initializeApp,cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { createRequire } from 'module'
const require = createRequire(import.meta.url);

var serviceAccount = require("../bakalauras-8fdcd-firebase-adminsdk-hwcyk-f9fd4b0636.json");

const defaultApp = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://bakalauras-8fdcd-default-rtdb.europe-west1.firebasedatabase.app"
});

const auth = getAuth();

export {auth};