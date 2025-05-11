//firebase.js
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firebase-messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAXpvZ7OLd9xhYtqzcHTyLuZJOyvBNYroE",
  authDomain: "tagamaly-d6fe4.firebaseapp.com",
  projectId: "tagamaly-d6fe4",
  storageBucket: "tagamaly-d6fe4.firebasestorage.app",
  messagingSenderId: "451531457200",
  appId: "1:451531457200:web:93fd9875929ead25703175",
  measurementId: "G-4JSQY1T8B1"
};

firebase.initializeApp(firebaseConfig);

export default firebase.messaging();
