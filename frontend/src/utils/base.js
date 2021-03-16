import firebase from "firebase/app";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDGQEeY4WAxVnkEc8g8Yvx-OhveqaDseK8",
  authDomain: "cheaterchecker-202ee.firebaseapp.com",
  projectId: "cheaterchecker-202ee",
  storageBucket: "cheaterchecker-202ee.appspot.com",
  messagingSenderId: "910367486585",
  appId: "1:910367486585:web:1d47256801e71b1a535aa8",
  measurementId: "G-XSK9QN5PJM",
});

const db = firebase.firestore();

export { app, db };
