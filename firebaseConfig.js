import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEp0PGZCf0cRHKvHX_3q00dCFUBotrRG4",
  authDomain: "quan-ly-do-an-d3be6.firebaseapp.com",
  projectId: "quan-ly-do-an-d3be6",
  storageBucket: "quan-ly-do-an-d3be6.appspot.com",
  messagingSenderId: "412206916441",
  appId: "1:412206916441:web:ab41f52aee2007267ee248",
  measurementId: "G-QPV13KRKRF",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const fb_auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, database, storage, fb_auth };
