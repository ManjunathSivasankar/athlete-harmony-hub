// Profile module for handling profile functionality

// Load profile data
function loadProfileData() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Update UI with known user data
  document.getElementById('profile-name').textContent = user.displayName || 'Athlete';
  document.getElementById('profile-email').textContent = user.email;
  
  // Set default avatar or user's avatar
  const avatarElement = document.getElementById('profile-avatar');
  if (user.photoURL) {
    avatarElement.src = user.photoURL;
  } else {
    avatarElement.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'Athlete') + '&background=0D8ABC&color=fff';
  }
  
  // Load athlete data from Firestore
  db.collection('athletes').doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        
        // Populate profile fields
        document.getElementById('profile-sport').textContent = data.sport || '--';
        document.getElementById('profile-age').textContent = data.age || '--';
        document.getElementById('profile-height').textContent = data.height ? `${data.height} cm` : '--';
        document.getElementById('profile-weight').textContent = data.weight ? `${data.weight} kg` : '--';
        
        // Also populate form fields for editing
        if (data.sport) document.getElementById('sport').value = data.sport;
        if (data.age) document.getElementById('age').value = data.age;
        if (data.height) document.getElementById('height').value = data.height;
        if (data.weight) document.getElementById('weight').value = data.weight;
      } else {
        console.log('No profile data found');
      }
    })
    .catch(error => {
      console.error('Error loading profile data:', error);
    });
}

// Toggle profile edit mode
function toggleProfileEdit(editMode) {
  const profileDetails = document.getElementById('profile-details');
  const profileForm = document.getElementById('profile-form');
  
  if (editMode) {
    profileDetails.style.display = 'none';
    profileForm.style.display = 'block';
  } else {
    profileDetails.style.display = 'block';
    profileForm.style.display = 'none';
  }
}

// Update profile in Firestore
function updateProfile() {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (!user) return reject(new Error('No user logged in'));
    
    const sport = document.getElementById('sport').value;
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    
    db.collection('athletes').doc(user.uid).update({
      sport: sport,
      age: parseInt(age) || 0,
      height: parseInt(height) || 0,
      weight: parseInt(weight) || 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Profile updated');
      
      // Update display
      document.getElementById('profile-sport').textContent = sport || '--';
      document.getElementById('profile-age').textContent = age || '--';
      document.getElementById('profile-height').textContent = height ? `${height} cm` : '--';
      document.getElementById('profile-weight').textContent = weight ? `${weight} kg` : '--';
      
      // Hide form, show details
      toggleProfileEdit(false);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.style.cssText = 'background-color: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--success-color); color: var(--success-color); padding: 0.75rem 1rem; border-radius: 0 var(--rounded) var(--rounded) 0; margin-bottom: 1rem; animation: fadeIn 0.5s ease;';
      successMessage.textContent = 'Profile updated successfully!';
      
      const cardTitle = document.querySelector('.card-title');
      cardTitle.parentNode.insertBefore(successMessage, cardTitle.nextSibling);
      
      setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
      
      resolve();
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      reject(error);
    });
  });
}

// Export profile functions to global scope
window.profileService = {
  loadProfileData,
  toggleProfileEdit,
  updateProfile
};
