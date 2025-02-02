import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAoZkvXPXtcyRHdGdLhGeWg4DQERYp6teY",
  authDomain: "chat-ai-8fab2.firebaseapp.com",
  projectId: "chat-ai-8fab2",
  storageBucket: "chat-ai-8fab2.firebasestorage.app",
  messagingSenderId: "7926505901",
  appId: "1:7926505901:web:690cfdf9765b98ac5b0124"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
