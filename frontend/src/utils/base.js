//Noel Gregory
//2021-03-30
//This file contains firebase initialization

//imports
import firebase from "firebase/app";
import "firebase/firestore";

//initing the firebase
const app = firebase.initializeApp({
  apiKey: "AIzaSyDiUddtS0KDs9okreiSVbCqcMQF2OxN38c",
  authDomain: "cheater-a4c1b.firebaseapp.com",
  projectId: "cheater-a4c1b",
  storageBucket: "cheater-a4c1b.appspot.com",
  messagingSenderId: "684918680862",
  appId: "1:684918680862:web:862ae1f24dc62ff5632d0f",
  measurementId: "G-DT9Y6X17CQ",
});

const db = firebase.firestore(); //creating firestore instance

export { app, db };
