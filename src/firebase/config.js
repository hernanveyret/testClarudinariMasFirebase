import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCIf4hHIDSPCK0sJj5YyL4j01InzOsZok",
  authDomain: "carrito-comida.firebaseapp.com",
  projectId: "carrito-comida",
  storageBucket: "carrito-comida.firebasestorage.app",
  messagingSenderId: "563278412590",
  appId: "1:563278412590:web:b827a99ed451a844c958bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };