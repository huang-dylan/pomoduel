// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5RXUDClXRAUeyHVTAkAqZsB5UJpYE5B0",
  authDomain: "pomoduel.firebaseapp.com",
  projectId: "pomoduel",
  storageBucket: "pomoduel.appspot.com",
  messagingSenderId: "118173244262",
  appId: "1:118173244262:web:e75b56b3f7c025475f46a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db}