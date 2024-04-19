import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD7mK4QGiIxh2JuKUArac71_J8OwdlDbm8",
  authDomain: "ruins-auth.firebaseapp.com",
  projectId: "ruins-auth",
  storageBucket: "ruins-auth.appspot.com",
  messagingSenderId: "938938977587",
  appId: "1:938938977587:web:61ea6c514c246d222e4246"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth()