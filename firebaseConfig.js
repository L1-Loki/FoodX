import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
const app = initializeApp(firebaseConfig);


// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });


let auth;
if (process.env.NODE_ENV !== "test") {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = {}; // Bỏ qua khởi tạo auth trong môi trường test
}


// const auth = getAuth(app)
// Khởi tạo các dịch vụ khác
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);
export { app, auth, db, database, storage };
