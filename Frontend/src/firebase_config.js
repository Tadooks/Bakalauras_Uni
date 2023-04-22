import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig=({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "bakalauras-8fdcd.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
//exporting so we could use in other files
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();


// export const signInWithGoogle = () => {
//   signInWithPopup(provider).then(function(result) {
//     // code which runs on success
//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     console.log(errorCode);
//     alert(errorCode);
  
//     var errorMessage = error.message;
//     console.log(errorMessage);
//     alert(errorMessage);
//   });
  
// };

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      
    })
    .catch((error) => {
      console.log(error);
    });
};