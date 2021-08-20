import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXrmWG409a0Lrkc6aP_tUC1LgOFP-ytYs",
  authDomain: "cracktheweb-d7c69.firebaseapp.com",
  projectId: "cracktheweb-d7c69",
  storageBucket: "cracktheweb-d7c69.appspot.com",
  messagingSenderId: "653290182593",
  appId: "1:653290182593:web:27c203b792c8fb84fbc140",
  measurementId: "G-K6K2D4KPP4",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const storage = firebaseApp.storage();

export default storage;
