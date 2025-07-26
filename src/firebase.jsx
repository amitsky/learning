import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    // apiKey: import.meta.env.VITE_FIREBASE_KEY,
    // authDomain: "react-firebase-chat-app-e3ad2.firebaseapp.com",
    // projectId: "react-firebase-chat-app-e3ad2",
    // storageBucket: "react-firebase-chat-app-e3ad2.appspot.com",
    // messagingSenderId: import.meta.env.VITE_SENDER_ID,
    // appId: import.meta.env.VITE_APP_ID,
    apiKey: "AIzaSyBNr5UV2aYdQjTflDi6abgS7hQidJTCQ8s",
    authDomain: "react-firebase-real-chat.firebaseapp.com",
    projectId: "react-firebase-real-chat",
    storageBucket: "react-firebase-real-chat.firebasestorage.app",
    messagingSenderId: "42028204661",
    appId: "1:42028204661:web:3c7dc9827a01d6bad86e3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
