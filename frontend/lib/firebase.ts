import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if firebase configuration exists
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

// Initialize Firebase
const app = isFirebaseConfigured
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

// Mock login helpers for local testing/evaluation when Firebase credentials aren't supplied
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export const mockLogin = (): Promise<MockUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uid: "mock-user-123",
        email: "eco.challenger@ecomind.ai",
        displayName: "Eco Twin Pilot",
        photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=eco",
      });
    }, 800);
  });
};
