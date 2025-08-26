import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { FIREBASE_APIKEY, FIREBASE_APPID, FIREBASE_AUTHDOMAIN, FIREBASE_DATABASEURL, FIREBASE_MEASUREMENTID, FIREBASE_MESSAGINGSENDERID, FIREBASE_PROJECTID, FIREBASE_STOREAGEBUCKET } from "../lib/constants";

const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    databaseURL: FIREBASE_DATABASEURL,
    projectId: FIREBASE_PROJECTID,
    storageBucket: FIREBASE_STOREAGEBUCKET,
    messagingSenderId: FIREBASE_MESSAGINGSENDERID,
    appId: FIREBASE_APPID,
    measurementId: FIREBASE_MEASUREMENTID
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  // Configure auth providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  
  // Add scopes
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  facebookProvider.addScope('email');
  facebookProvider.addScope('public_profile');
  
  export {app, db, auth, googleProvider, facebookProvider}