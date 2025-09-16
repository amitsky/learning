import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCibl4l5T44mDFQaHGR0oTVGisslKWuBS8",
    authDomain: "python-4248e.firebaseapp.com",
    projectId: "python-4248e",
    storageBucket: "python-4248e.firebasestorage.app",
    messagingSenderId: "940870560039",
    appId: "1:940870560039:web:127f7ebb53732e0425e102"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
