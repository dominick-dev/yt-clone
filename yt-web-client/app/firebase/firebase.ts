// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "yt-clone-3fb75.firebaseapp.com",
  projectId: "yt-clone-3fb75",
  appId: "1:1032750545420:web:4ecc92ea6c0ddc3082cc29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup
 * @returns a promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out
 * @returns a promise that resolves when the user is signed out
 */
export function signOut() {
  return auth.signOut();
}

/**
 *
 * @param callBack Trigger a callback when user auth state changes
 * @returns a function to unsubscribe callback
 */
export function onAuthStateChangedHelper(
  callBack: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callBack);
}
