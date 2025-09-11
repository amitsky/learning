import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDRjCBBBlf707HVy7l_YjA8IQ0lMaVUbP4",
    authDomain: "python-d27a5.firebaseapp.com",
    projectId: "python-d27a5",
    storageBucket: "python-d27a5.firebasestorage.app",
    messagingSenderId: "660520598684",
    appId: "1:660520598684:web:2f85028f1111d97b924159"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
