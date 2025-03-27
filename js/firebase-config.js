// ✅ Import Firebase Modules (Ensure Firebase v9+ Modular Syntax)
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔒 Move sensitive credentials to environment variables if possible
const firebaseConfig = {
  apiKey: "AIzaSyC_g04w-qJy-yNcsC6lUrz4wA8nfY0f5P0",
  authDomain: "athlze-c3ecc.firebaseapp.com",
  projectId: "athlze-c3ecc",
  storageBucket: "athlze-c3ecc.appspot.com",  // Fix incorrect storageBucket URL
  messagingSenderId: "2539610472",
  appId: "1:2539610472:web:7bffb073f221e9609d76dd",
  measurementId: "G-TSQ6R9BQ7S"
};

// 🔥 Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// ✅ Initialize Firestore with new persistence settings
const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({ tabManager: true }) // Replaces enablePersistence()
});
console.log("✅ Firestore initialized with new persistence settings");

// ✅ Initialize Authentication & Set Local Persistence
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Auth persistence set to LOCAL"))
  .catch(error => console.error("❌ Error setting auth persistence:", error));

// ✅ Initialize Firebase Storage
const storage = getStorage(firebaseApp);

// 🚀 Export Firebase Services for Global Access
export { auth, db, storage };
