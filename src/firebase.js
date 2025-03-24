// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEjJ6vCjKB8BfoorQQWGIVygTG8_rqc0M",
  authDomain: "afroseer-99.firebaseapp.com",
  projectId: "afroseer-99",
  storageBucket: "afroseer-99.firebasestorage.app",
  messagingSenderId: "881765553779",
  appId: "1:881765553779:web:2263b8ce654bae8bd23c06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
