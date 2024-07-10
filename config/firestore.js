// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoYj6mK-RMA84q3lTJOBzv8wUs7MgYLHg",
  authDomain: "akkarapp-e19ea.firebaseapp.com",
  databaseURL: "https://akkarapp-e19ea-default-rtdb.firebaseio.com",
  projectId: "akkarapp-e19ea",
  storageBucket: "akkarapp-e19ea.appspot.com",
  messagingSenderId: "445385904834",
  appId: "1:445385904834:web:707974f794d05c21f2615b",
  measurementId: "G-BQLRMVWWMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);