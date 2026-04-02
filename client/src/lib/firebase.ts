import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCL67-TViQJI1nUFioEC6RnGbDZMwCNuUw",
  authDomain: "bilal-365f7.firebaseapp.com",
  projectId: "bilal-365f7",
  storageBucket: "bilal-365f7.firebasestorage.app",
  messagingSenderId: "795808040396",
  appId: "1:795808040396:web:9e621958c3a97182550969",
  measurementId: "G-VLBJG8DVQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
export const analytics = typeof window !== "undefined" ? 
  isSupported().then(yes => yes ? getAnalytics(app) : null) : 
  null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
