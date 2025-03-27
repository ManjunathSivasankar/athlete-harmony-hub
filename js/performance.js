// Performance module for handling performance tracking functionality

// Save performance data
function savePerformanceData() {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (!user) return reject(new Error('No user logged in'));
    
    const speed = document.getElementById('speed').value;
    const heartRate = document.getElementById('heart-rate').value;
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;
    const notes = document.getElementById('notes').value;
    
    db.collection('metrics').add({
      userId: user.uid,
      speed: parseFloat(speed),
      heartRate: parseInt(heartRate),
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      notes: notes,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Performance data saved');
      document.getElementById('performance-form').reset();
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.style.cssText = 'background-color: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--success-color); color: var(--success-color); padding: 0.75rem 1rem; border-radius: 0 var(--rounded) var(--rounded) 0; margin-bottom: 1rem; animation: fadeIn 0.5s ease;';
      successMessage.textContent = 'Performance data saved successfully!';
      
      const cardTitle = document.querySelector('.card-title');
      cardTitle.parentNode.insertBefore(successMessage, cardTitle.nextSibling);
      
      setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
      
      resolve();
    })
    .catch(error => {
      console.error('Error saving performance data:', error);
      reject(error);
    });
  });
}

// Load historical performance data for charts
function loadPerformanceHistory() {
  const user = auth.currentUser;
  if (!user) return;
  
  // TODO: Implement chart visualization using a library like Chart.js
  console.log('Loading performance history for charts...');
}

// Export performance functions to global scope
window.performanceService = {
  savePerformanceData,
  loadPerformanceHistory
};
