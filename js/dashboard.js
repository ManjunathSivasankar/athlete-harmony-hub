// Dashboard module for handling dashboard functionality

// Load dashboard data
function loadDashboardData() {
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated.");
    return;
  }

  // Show loading indicators
  const metricsElements = ['avg-speed', 'heart-rate', 'blood-pressure'];
  metricsElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
    }
  });

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
        
        const bloodPressureElement = document.getElementById('blood-pressure');
        if (bloodPressureElement) {
          bloodPressureElement.textContent = (data.systolic && data.diastolic) 
            ? `${data.systolic}/${data.diastolic}` 
            : '--';
        }

        // Load user profile for contextual suggestions
        db.collection('athletes').doc(user.uid).get()
          .then(doc => {
            const userProfile = doc.exists ? doc.data() : null;
            generateAIHealthSuggestions(data, userProfile);
          })
          .catch(error => {
            console.error('Error loading profile for suggestions:', error);
            generateAIHealthSuggestions(data, null);
          });
      } else {
        setDefaultMetrics();
      }
    })
    .catch(error => {
      console.error('Error loading dashboard data:', error);
      setDefaultMetrics();
    });
}

// Set default values if no data is found
function setDefaultMetrics() {
  ['avg-speed', 'heart-rate', 'blood-pressure'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = '--';
  });
  showNoMetricsMessage();
}

// Show message when no metrics are available
function showNoMetricsMessage() {
  const loadingElement = document.querySelector('.loading-suggestions');

  if (loadingElement) {
    loadingElement.innerHTML = `
      <p>No metrics recorded yet. Visit the Performance page to log your first metrics and receive personalized AI suggestions.</p>
      <button id="go-to-performance" class="btn btn-primary mt-3">Log Your Metrics</button>
    `;

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

  if (!window.HealthSuggestions) {
    console.error("HealthSuggestions not available. Make sure the script is loaded.");
    return;
  }

  setTimeout(() => {
    const loadingElement = document.querySelector('.loading-suggestions');
    const suggestionsContent = document.querySelector('.suggestions-content');

    if (loadingElement && suggestionsContent) {
      try {
        const suggestions = window.HealthSuggestions.getContextualAdvice(metrics, userProfile);
        console.log("Generated suggestions:", suggestions);

        updateSuggestions('training-suggestions', suggestions.training);
        updateSuggestions('nutrition-suggestions', suggestions.nutrition);
        updateSuggestions('recovery-suggestions', suggestions.recovery);

        loadingElement.style.display = 'none';
        suggestionsContent.style.display = 'block';

        document.querySelectorAll('.suggestions-category').forEach((category, index) => {
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

// Update UI with AI-generated suggestions
function updateSuggestions(elementId, suggestions) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = (suggestions && suggestions.length > 0)
      ? suggestions.map(suggestion => `<div class="suggestion-item"><p>${suggestion}</p></div>`).join('')
      : '<p class="no-suggestions">Track more metrics to get suggestions.</p>';
  }
}

// Export dashboard functions to global scope
window.dashboardService = {
  loadDashboardData,
  showNoMetricsMessage,
  animateNumber,
  generateAIHealthSuggestions
};
