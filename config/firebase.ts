import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDqrFyBD0gAeX7QvAWvArGCLknPsykk9KU",
    authDomain: "filmbuddy-762b0.firebaseapp.com",
    projectId: "filmbuddy-762b0",
    storageBucket: "filmbuddy-762b0.firebasestorage.app",
    messagingSenderId: "198966357108",
    appId: "1:198966357108:web:e6522335648d0d67703521",
    measurementId: "G-MEXDKQ9L5N"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

