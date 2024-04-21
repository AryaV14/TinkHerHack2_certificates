import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyCI5cFmFbpgQ79qcHuZpzmJJ8U83wdjXOk",
  authDomain: "certificate-generator-f6954.firebaseapp.com",
  projectId: "certificate-generator-f6954",
  storageBucket: "certificate-generator-f6954.appspot.com",
  messagingSenderId: "71059314516",
  appId: "1:71059314516:web:5ee9d73a82fb9d019a9ac1"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);