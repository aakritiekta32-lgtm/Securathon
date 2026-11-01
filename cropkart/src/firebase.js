import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAXK-k_BdvcnDXwQjvue6iVxLejXKHtl9k",
  authDomain: "securathon-d8800.firebaseapp.com",
  projectId: "securathon-d8800",
  storageBucket: "securathon-d8800.firebasestorage.app",
  messagingSenderId: "124902623958",
  appId: "1:124902623958:web:34ef6214fcb2c48a545777",
  measurementId: "G-YKP4DS1GR2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false
});

console.log("Firebase App:", app.name);
console.log("Firebase Auth:", auth.app.name);
console.log("Firestore:", db.app.name);

window.firebaseTest = { app, auth, db };

export async function checkFirestore() {
  try {
    const testDoc = await getDoc(
      doc(db, "_connection_test", "ping")
    );

    return {
      status: "connected",
      projectId: app.options.projectId,
      documentExists: testDoc.exists()
    };

  } catch (error) {
    return {
      status: "failed",
      projectId: app.options.projectId,
      code: error.code,
      message: error.message
    };
  }
}

window.firebaseTest = { app, auth, db };
window.checkFirestore = checkFirestore;