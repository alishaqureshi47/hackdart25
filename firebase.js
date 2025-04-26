import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkOu1pKbJxb2s_eOo8vTCcRBlFMTwd8Ns",
  authDomain: "quipp-7bd70.firebaseapp.com",
  projectId: "quipp-7bd70",
  storageBucket: "quipp-7bd70.firebasestorage.app",
  messagingSenderId: "701053124519",
  appId: "1:701053124519:web:8e3007c4879def5e488082",
  measurementId: "G-309WF6N9ZC"
};

// Initialize Firebase if it hasn't been initialized already
export const firebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Initialize Analytics (only in browser environment)
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(firebaseApp);
  }
  return null;
};