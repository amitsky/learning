import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBRvvs3k0y_rCVMkF0Iw1HZfb7NmwnfYkM",
    authDomain: "python-platform-c6298.firebaseapp.com",
    projectId: "python-platform-c6298",
    storageBucket: "python-platform-c6298.firebasestorage.app",
    messagingSenderId: "700567604832",
    appId: "1:700567604832:web:a06ae75ccae3c4c9833d05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
