import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import 'firebase/firestore';
// import 'firebase/analytics';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBq4Xkj7O4_BM2BHJIvwMXL59FIb71CaYM",
//   authDomain: "my-react-blog-500e1.firebaseapp.com",
//   projectId: "my-react-blog-500e1",
//   storageBucket: "my-react-blog-500e1.appspot.com",
//   messagingSenderId: "705882887416",
//   appId: "1:705882887416:web:7ace4abf724d401735570d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
