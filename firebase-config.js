// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4anf0HztjmqM8cAuOY-btZl3HlDwk0l4",
  authDomain: "kinesis-f2b17.firebaseapp.com",
  projectId: "kinesis-f2b17",
  storageBucket: "kinesis-f2b17.firebasestorage.app",
  messagingSenderId: "838076750848",
  appId: "1:838076750848:web:1f14d39691d300d7dd0ce5",
  measurementId: "G-NG31LFHDJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);