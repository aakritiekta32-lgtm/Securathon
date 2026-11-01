import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXK-k_BdvcnDXwQjvue6iVxLejXKHtl9k",
  authDomain: "securathon-d8806.firebaseapp.com",
  projectId: "securathon-d8806",
  storageBucket: "securathon-d8806.firebasestorage.app",
  messagingSenderId: "124902623958",
  appId: "1:124902623958:web:34ef6214fcb2c48a545777",
  measurementId: "G-YKP4DS1GR2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase App:", app.name);
console.log("Firebase Auth:", auth.app.name);
console.log("Firestore:", db.app.name);

window.firebaseTest = { app, auth, db };

window.checkFirestore = async () => {
  try {
    const testDoc = await getDoc(
      doc(db, "_connection_test", "ping")
    );

    console.log(
      "Firestore read successful. Document exists:",
      testDoc.exists()
    );
  } catch (error) {
    console.error("Firestore read failed:", error.code, error.message);
  }
};