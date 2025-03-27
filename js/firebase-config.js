// ✅ Secure Firebase Configuration (Move sensitive keys to environment variables if possible)
const firebaseConfig = {
  apiKey: "AIzaSyC_g04w-qJy-yNcsC6lUrz4wA8nfY0f5P0",
  authDomain: "athlze-c3ecc.firebaseapp.com",
  projectId: "athlze-c3ecc",
  storageBucket: "athlze-c3ecc.appspot.com", // 🔹 Fixed storage bucket URL
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
    switch (err.code) {
      case 'failed-precondition':
        console.warn("❌ Multiple tabs open. Firestore persistence disabled.");
        break;
      case 'unimplemented':
        console.warn("❌ Firestore persistence not supported in this browser.");
        break;
      default:
        console.error("🔥 Firestore persistence error:", err);
    }
  });

// ✅ Explicit Firestore Settings (Recommended)
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED, // Optimize cache size
  merge: true // Enable merging for consistent writes
});

// 🚀 Export Firebase Services (For Global Access)
window.firebaseServices = { auth, db, storage };
