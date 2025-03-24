// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2S6WEe7oRI1THd2Ma-Zh8QZZ28yOymho",
    authDomain: "afroseer-98.firebaseapp.com",
    projectId: "afroseer-98",
    storageBucket: "afroseer-98.firebasestorage.app",
    messagingSenderId: "894541581578",
    appId: "1:894541581578:web:9f98de1d0bcfee817bfef3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
