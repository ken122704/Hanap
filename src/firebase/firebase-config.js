import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvOKNgJx1Ohh8YKdHT3K-4bb-geHgyYYg",
  authDomain: "hanap-9a95a.firebaseapp.com",
  projectId: "hanap-9a95a",
  storageBucket: "hanap-9a95a.firebasestorage.app",
  messagingSenderId: "245245484035",
  appId: "1:245245484035:web:22acae05c99a16b7474236",
  measurementId: "G-L4B3RQ8KXR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);