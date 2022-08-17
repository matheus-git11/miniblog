// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzwEhZpQHIOcy6iGnpB1XZiqRdBAI4myc",
  authDomain: "miniblog-e666b.firebaseapp.com",
  projectId: "miniblog-e666b",
  storageBucket: "miniblog-e666b.appspot.com",
  messagingSenderId: "297355340567",
  appId: "1:297355340567:web:214755a0cdd7f77ac4a552",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// getting the database
const db = getFirestore(app);

export { db };
