import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyABv8StypuUGeD6tC7mYZrbRXi4SnOTgMQ",
    authDomain: "restenpro.firebaseapp.com",
    projectId: "restenpro",
    storageBucket: "restenpro.appspot.com",
    messagingSenderId: "705618055390",
    appId: "1:705618055390:web:b4b33d887a18f3917cf24f"
  };
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
export const db = fb.firestore();