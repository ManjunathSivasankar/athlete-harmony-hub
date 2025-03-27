// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_g04w-qJy-yNcsC6lUrz4wA8nfY0f5P0",
  authDomain: "athlze-c3ecc.firebaseapp.com",
  projectId: "athlze-c3ecc",
  storageBucket: "athlze-c3ecc.firebasestorage.app",
  messagingSenderId: "2539610472",
  appId: "1:2539610472:web:b013cf1a3d46bcc69d76dd",
  measurementId: "G-CHLWWGCBGD"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Configure auth persistence
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Auth persistence set to LOCAL");
    })
    .catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
  
  // Add error handling for Firestore operations
  db.enablePersistence()
    .then(() => {
      console.log("Firestore persistence enabled for offline use");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.error("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code === 'unimplemented') {
        console.error("The current browser does not support offline persistence.");
      }
    });
  
  // Export Firebase services
  window.firebaseServices = {
    auth,
    db,
    storage
  };
  