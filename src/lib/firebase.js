import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnOUpymEid4b3lAJRikjKNGg9NOtl0plg",
  authDomain: "jot-ai-b1561.firebaseapp.com",
  projectId: "jot-ai-b1561",
  storageBucket: "jot-ai-b1561.firebasestorage.app",
  messagingSenderId: "79521104996",
  appId: "1:79521104996:web:80052404b05d5fb3864b71",
  measurementId: "G-C8T6MPHSRT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
