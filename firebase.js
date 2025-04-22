import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmFXqZap0ZSPnGzmwfQCMR2EpJSB3QfsE",
  authDomain: "linkedin-29e3f.firebaseapp.com",
  projectId: "linkedin-29e3f",
  storageBucket: "linkedin-29e3f.firebasestorage.app",
  messagingSenderId: "940421714892",
  appId: "1:940421714892:web:2b7b45f2a7b5b51a6d0369"
};


// const app = initializeApp(firebaseConfig);

// Initialize Firebase

if(!firebase.apps.length){
     firebase.initializeApp(firebaseConfig);
}

export {firebase};