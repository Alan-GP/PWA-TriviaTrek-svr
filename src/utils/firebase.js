const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyArEJFDnLDCbhFtbsPblHZzoTKgacBO68Q",
    authDomain: "triviatrek-187ec.firebaseapp.com",
    databaseURL: "https://triviatrek-187ec-default-rtdb.firebaseio.com",
    projectId: "triviatrek-187ec",
    storageBucket: "triviatrek-187ec.appspot.com",
    messagingSenderId: "593211191281",
    appId: "1:593211191281:web:c7708be5233b1a6c1d5e50",
    measurementId: "G-2GBPGZ5KSY"
  };

const app = initializeApp(firebaseConfig);

// Initialize Firebase Firestore

const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { app, auth, db };