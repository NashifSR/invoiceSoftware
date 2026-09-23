import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Safe initialization for Next.js hot-reloads
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth instances
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// EXPORT EVERYTHING so your AuthContext can use them!
export { auth, googleProvider, signInWithPopup, signOut };