import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCd5aAG8Sd9mPKq0Sq03ghPXZhWDrbfI60",
  authDomain: "joseact1-f75b2.firebaseapp.com",
  projectId: "joseact1-f75b2",
  storageBucket: "joseact1-f75b2.firebasestorage.app",
  messagingSenderId: "865715958497",
  appId: "1:865715958497:web:9416097d7a0c5e47e07da0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase}