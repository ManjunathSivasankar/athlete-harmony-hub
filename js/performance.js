// Performance module for handling performance tracking functionality

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
      successMessage.style.cssText = `
        background-color: rgba(16, 185, 129, 0.1); 
        border-left: 3px solid var(--success-color); 
        color: var(--success-color); 
        padding: 0.75rem 1rem; 
        border-radius: 0 var(--rounded) var(--rounded) 0; 
        margin-bottom: 1rem; 
        animation: fadeIn 0.5s ease;
      `;
      successMessage.textContent = 'Performance data saved successfully!';
      
      const cardTitle = document.querySelector('.card-title');
      cardTitle.parentNode.insertBefore(successMessage, cardTitle.nextSibling);
      
      setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
      }, 3000);
      
      // Refresh dashboard data after saving
      if (window.dashboardService) {
        window.dashboardService.loadDashboardData();
      }
      
      resolve();
    })
    .catch(error => {
      console.error('Error saving performance data:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.style.cssText = `
        background-color: rgba(239, 68, 68, 0.1); 
        border-left: 3px solid var(--error-color); 
        color: var(--error-color); 
        padding: 0.75rem 1rem; 
        border-radius: 0 var(--rounded) var(--rounded) 0; 
        margin-bottom: 1rem; 
        animation: fadeIn 0.5s ease;
      `;
      errorMessage.textContent = 'Failed to save performance data. Please try again.';
      
      const cardTitle = document.querySelector('.card-title');
      cardTitle.parentNode.insertBefore(errorMessage, cardTitle.nextSibling);
      
      setTimeout(() => {
        errorMessage.style.opacity = '0';
        setTimeout(() => errorMessage.remove(), 500);
      }, 3000);
      
      reject(error);
    });
  });
}

// Load historical performance data for charts
function loadPerformanceHistory() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Use Chart.js for visualization if available
  if (window.Chart) {
    db.collection('metrics')
      .where('userId', '==', user.uid)
      .orderBy('timestamp', 'asc')
      .get()
      .then(snapshot => {
        const performanceData = {
          speed: [],
          heartRate: [],
          timestamps: []
        };
        
        snapshot.forEach(doc => {
          const data = doc.data();
          performanceData.speed.push(data.speed);
          performanceData.heartRate.push(data.heartRate);
          performanceData.timestamps.push(
            new Date(data.timestamp.toDate()).toLocaleDateString()
          );
        });
        
        renderPerformanceChart(performanceData);
      })
      .catch(error => {
        console.error('Error loading performance history:', error);
        document.getElementById('performance-chart').innerHTML = 
          '<p class="text-center text-error">Unable to load performance chart</p>';
      });
  }
}

// Render performance chart using Chart.js
function renderPerformanceChart(data) {
  const chartContainer = document.getElementById('performance-chart');
  chartContainer.innerHTML = ''; // Clear previous chart
  
  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);
  
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.timestamps,
      datasets: [
        {
          label: 'Speed (km/hr)',
          data: data.speed,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Heart Rate (bpm)',
          data: data.heartRate,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Performance Metrics Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Export performance functions to global scope
window.performanceService = {
  savePerformanceData,
  loadPerformanceHistory
};

// Enhancement for page loading
function initPerformancePage() {
  const performanceForm = document.getElementById('performance-form');
  if (performanceForm) {
    performanceForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Add button loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      
      window.performanceService.savePerformanceData()
        .then(() => {
          // Optional: Add success handling
          window.performanceService.loadPerformanceHistory();
        })
        .catch(error => {
          console.error('Performance data save failed:', error);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
  }
  
  // Load performance history when page loads
  loadPerformanceHistory();
}

// Add to page initialization logic
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#performance') {
    initPerformancePage();
  }
});