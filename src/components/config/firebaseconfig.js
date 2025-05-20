import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUMuWkPJAoHyp0Da2IfrhcL2Owgssbb0o",
  authDomain: "fypsupervisor-397f0.firebaseapp.com",
  projectId: "fypsupervisor-397f0",
  storageBucket: "fypsupervisor-397f0.firebasestorage.app",
  messagingSenderId: "254868741234",
  appId: "1:254868741234:web:3f687bc6b6d48ec6a776eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;