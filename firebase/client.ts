// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDabOfoVtlyjN8v29-pUFsIVYGZ5sTTIIw",
  authDomain: "mentormic-3ec8e.firebaseapp.com",
  projectId: "mentormic-3ec8e",
  storageBucket: "mentormic-3ec8e.firebasestorage.app",
  messagingSenderId: "72689404934",
  appId: "1:72689404934:web:c5b749dd0a78fce2cb4787",
  measurementId: "G-VPLF7PJ7QM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);