// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpI33JQZBAs7Tli18CPHRRQjhiVzH8u_s",
  authDomain: "inventory-mangement-677e9.firebaseapp.com",
  projectId: "inventory-mangement-677e9",
  storageBucket: "inventory-mangement-677e9.appspot.com",
  messagingSenderId: "320687848624",
  appId: "1:320687848624:web:7ec4bde1a1fea7e4948f75",
  measurementId: "G-3HDH1C5KJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}