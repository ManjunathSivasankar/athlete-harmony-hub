// Authentication module for handling user authentication

// Sign in with email and password
function signInWithEmail(email, password) {
  return new Promise((resolve, reject) => {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log('User signed in:', user.email);
        resolve(user);
      })
      .catch(error => {
        console.error('Sign in error:', error);
        const errorMessage = error.message;
        document.getElementById('auth-error').textContent = errorMessage;
        document.getElementById('auth-error').style.display = 'block';
        reject(error);
      });
  });
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then(result => {
      // Google sign in successful
      const user = result.user;
      console.log('Google sign in successful:', user.email);
      checkUserProfile(user);
    })
    .catch(error => {
      console.error('Google sign in error:', error);
      document.getElementById('auth-error').textContent = error.message;
      document.getElementById('auth-error').style.display = 'block';
    });
}

// Sign up with email, password, and display name
function signUpWithEmail(email, password, displayName) {
  return new Promise((resolve, reject) => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Created new user
        const user = userCredential.user;
        console.log('User created:', user.email);
        
        // Update user profile with display name
        return user.updateProfile({
          displayName: displayName
        }).then(() => {
          console.log('User profile updated with display name');
          createUserProfile(user, displayName);
          resolve(user);
        });
      })
      .catch(error => {
        console.error('Sign up error:', error);
        const errorMessage = error.message;
        document.getElementById('auth-error').textContent = errorMessage;
        document.getElementById('auth-error').style.display = 'block';
        reject(error);
      });
  });
}

// Sign out
function signOut() {
  auth.signOut()
    .then(() => {
      console.log('User signed out');
    })
    .catch(error => {
      console.error('Sign out error:', error);
    });
}

// Create user profile in Firestore
function createUserProfile(user, displayName) {
  db.collection('athletes').doc(user.uid).set({
    name: displayName || user.displayName,
    email: user.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('User profile created in Firestore');
  })
  .catch(error => {
    console.error('Error creating user profile:', error);
  });
}

// Check if user profile exists, if not create it
function checkUserProfile(user) {
  db.collection('athletes').doc(user.uid).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('User profile does not exist, creating...');
        createUserProfile(user, user.displayName);
      } else {
        console.log('User profile exists');
      }
    })
    .catch(error => {
      console.error('Error checking user profile:', error);
    });
}

// Export auth functions to global scope
window.authService = {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOut,
  checkUserProfile
};
