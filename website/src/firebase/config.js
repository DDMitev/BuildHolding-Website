/**
 * Firebase Configuration
 * 
 * Initializes Firebase app and exports Firebase services
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc4QBlX7wYqLF1Y9SVbCYzGQTqBc9w7Fo",
  authDomain: "buildholding-website.firebaseapp.com",
  projectId: "buildholding-website",
  storageBucket: "buildholding-website.firebasestorage.app",
  messagingSenderId: "561127806502",
  appId: "1:561127806502:web:956e830a406cddf4bab8e7",
  measurementId: "G-YRGFX9ZRWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
