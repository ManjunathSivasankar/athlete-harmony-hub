// Firebase Configuration (Move these to a secure environment if possible)
const firebaseConfig = {
  apiKey: "AIzaSyC_g04w-qJy-yNcsC6lUrz4wA8nfY0f5P0",
  authDomain: "athlze-c3ecc.firebaseapp.com",
  projectId: "athlze-c3ecc",
  storageBucket: "athlze-c3ecc.firebasestorage.app",
  messagingSenderId: "2539610472",
  appId: "1:2539610472:web:7bffb073f221e9609d76dd",
  measurementId: "G-TSQ6R9BQ7S"
};

// 🔥 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 📢 Initialize Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ✅ Configure Authentication Persistence (LOCAL)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => console.log("✅ Auth persistence set to LOCAL"))
  .catch(error => console.error("❌ Error setting auth persistence:", error));

// ✅ Enable Firestore Offline Persistence with Multi-Tab Support
db.enablePersistence({ synchronizeTabs: true })
  .then(() => console.log("✅ Firestore persistence enabled for offline use"))
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.error("❌ Multiple tabs open. Firestore persistence can only be enabled in one tab.");
    } else if (err.code === 'unimplemented') {
      console.error("❌ Firestore persistence is not supported in this browser.");
    }
  });

// 🚀 Export Firebase Services (For Global Access)
window.firebaseServices = { auth, db, storage };
