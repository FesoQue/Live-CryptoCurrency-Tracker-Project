import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig';

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(FirebaseApp);
const db = getFirestore(FirebaseApp);

export { auth, db };
