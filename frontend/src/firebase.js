import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web App Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB34v7xlgFczimq8XYu1ok1LGcEGdDUmg",
  authDomain: "nexuscart-fc3a2.firebaseapp.com",
  projectId: "nexuscart-fc3a2",
  storageBucket: "nexuscart-fc3a2.firebasestorage.app",
  messagingSenderId: "8971079657",
  appId: "1:8971079657:web:b206a639c25b7d04e34578",
  measurementId: "G-32CF298WFD"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analytics };
export default app;
