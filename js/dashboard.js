// Dashboard module for handling dashboard functionality

// Load dashboard data
function loadDashboardData() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Show loading indicators
  document.getElementById('avg-speed').innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
  document.getElementById('heart-rate').innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
  document.getElementById('blood-pressure').innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
  
  // Load latest metrics
  db.collection('metrics')
    .where('userId', '==', user.uid)
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        
        // Add animation to the metric values
        animateNumber('avg-speed', 0, data.speed || 0, 1500);
        animateNumber('heart-rate', 0, data.heartRate || 0, 1500);
        
        if (data.systolic && data.diastolic) {
          document.getElementById('blood-pressure').textContent = `${data.systolic}/${data.diastolic}`;
        } else {
          document.getElementById('blood-pressure').textContent = '--';
        }
        
        // Load user profile for contextual suggestions
        db.collection('athletes').doc(user.uid).get()
          .then(doc => {
            let userProfile = null;
            if (doc.exists) {
              userProfile = doc.data();
            }
            
            // Generate AI health suggestions using our service
            generateAIHealthSuggestions(data, userProfile);
          })
          .catch(error => {
            console.error('Error loading profile for suggestions:', error);
            generateAIHealthSuggestions(data, null);
          });
      } else {
        document.getElementById('avg-speed').textContent = '--';
        document.getElementById('heart-rate').textContent = '--';
        document.getElementById('blood-pressure').textContent = '--';
        
        showNoMetricsMessage();
      }
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
      document.getElementById('avg-speed').textContent = '--';
      document.getElementById('heart-rate').textContent = '--';
      document.getElementById('blood-pressure').textContent = '--';
      
      showNoMetricsMessage();
    });
}

// Show message when no metrics are available
function showNoMetricsMessage() {
  const suggestionsContent = document.querySelector('.suggestions-content');
  const loadingElement = document.querySelector('.loading-suggestions');
  
  if (loadingElement) {
    loadingElement.innerHTML = `
      <p>No metrics recorded yet. Visit the Performance page to log your first metrics and receive personalized AI suggestions.</p>
      <button id="go-to-performance" class="btn btn-primary mt-3">Log Your Metrics</button>
    `;
    
    // Add event listener for the button
    setTimeout(() => {
      const perfButton = document.getElementById('go-to-performance');
      if (perfButton) {
        perfButton.addEventListener('click', (e) => {
          e.preventDefault();
          loadPage('performance');
        });
      }
    }, 0);
  }
}

// Animate number counting up
function animateNumber(elementId, start, end, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const range = end - start;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime > duration) {
      element.textContent = end.toFixed(1);
      return;
    }
    
    const value = start + (range * (elapsedTime / duration));
    element.textContent = value.toFixed(1);
    requestAnimationFrame(updateNumber);
  }
  
  requestAnimationFrame(updateNumber);
}

// Generate AI health suggestions
function generateAIHealthSuggestions(metrics, userProfile) {
  console.log("Generating AI suggestions with:", metrics);
  
  // Make sure we have the HealthSuggestions service available
  if (!window.HealthSuggestions) {
    console.error("HealthSuggestions not available. Make sure the script is loaded.");
    return;
  }
  
  // Short timeout to simulate AI processing
  setTimeout(() => {
    const loadingElement = document.querySelector('.loading-suggestions');
    const suggestionsContent = document.querySelector('.suggestions-content');
    
    if (loadingElement && suggestionsContent) {
      try {
        // Get suggestions from our AI service
        const suggestions = window.HealthSuggestions.getContextualAdvice(metrics, userProfile);
        console.log("Generated suggestions:", suggestions);
        
        // Populate training suggestions
        const trainingElement = document.getElementById('training-suggestions');
        if (trainingElement && suggestions.training && suggestions.training.length > 0) {
          trainingElement.innerHTML = suggestions.training.map(suggestion => 
            `<div class="suggestion-item">
              <p>${suggestion}</p>
            </div>`
          ).join('');
        } else if (trainingElement) {
          trainingElement.innerHTML = '<p class="no-suggestions">Track more metrics to get training suggestions.</p>';
        }
        
        // Populate nutrition suggestions
        const nutritionElement = document.getElementById('nutrition-suggestions');
        if (nutritionElement && suggestions.nutrition && suggestions.nutrition.length > 0) {
          nutritionElement.innerHTML = suggestions.nutrition.map(suggestion => 
            `<div class="suggestion-item">
              <p>${suggestion}</p>
            </div>`
          ).join('');
        } else if (nutritionElement) {
          nutritionElement.innerHTML = '<p class="no-suggestions">Track more metrics to get nutrition suggestions.</p>';
        }
        
        // Populate recovery suggestions
        const recoveryElement = document.getElementById('recovery-suggestions');
        if (recoveryElement && suggestions.recovery && suggestions.recovery.length > 0) {
          recoveryElement.innerHTML = suggestions.recovery.map(suggestion => 
            `<div class="suggestion-item">
              <p>${suggestion}</p>
            </div>`
          ).join('');
        } else if (recoveryElement) {
          recoveryElement.innerHTML = '<p class="no-suggestions">Track more metrics to get recovery suggestions.</p>';
        }
        
        // Hide loading, show content with animation
        loadingElement.style.display = 'none';
        suggestionsContent.style.display = 'block';
        
        // Animate suggestion categories appearing
        const categories = document.querySelectorAll('.suggestions-category');
        categories.forEach((category, index) => {
          category.style.opacity = '0';
          category.style.transform = 'translateY(20px)';
          category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          
          setTimeout(() => {
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
          }, 300 + (index * 150));
        });
      } catch (error) {
        console.error("Error generating health suggestions:", error);
        loadingElement.innerHTML = `
          <p>Unable to generate health suggestions. Please try again later.</p>
          <button onclick="window.dashboardService.loadDashboardData()" class="mt-2">Retry</button>
        `;
      }
    }
  }, 1500);
}

// Export dashboard functions to global scope
window.dashboardService = {
  loadDashboardData,
  showNoMetricsMessage,
  animateNumber,
  generateAIHealthSuggestions
};
