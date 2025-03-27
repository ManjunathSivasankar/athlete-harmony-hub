// Dashboard module for handling dashboard functionality

// Load dashboard data
function loadDashboardData() {
  const user = auth.currentUser;
  if (!user) return;

  const elements = {
    avgSpeed: document.getElementById("avg-speed"),
    heartRate: document.getElementById("heart-rate"),
    bloodPressure: document.getElementById("blood-pressure"),
  };

  // Show loading indicators
  Object.values(elements).forEach(el => {
    if (el) el.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
  });

  // Load latest metrics
  db.collection("metrics")
    .where("userId", "==", user.uid)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) return handleNoMetrics(elements);

      const data = snapshot.docs[0].data();A

      animateNumber(elements.avgSpeed, 0, data.speed || 0, 1500);
      animateNumber(elements.heartRate, 0, data.heartRate || 0, 1500);
      elements.bloodPressure.textContent = data.systolic && data.diastolic ? `${data.systolic}/${data.diastolic}` : "--";

      return db.collection("athletes").doc(user.uid).get();
    })
    .then(doc => {
      const userProfile = doc?.exists ? doc.data() : null;
      generateAIHealthSuggestions(userProfile);
    })
    .catch(error => {
      console.error("Error loading dashboard data:", error);
      handleNoMetrics(elements);
    });
}

// Handle no metrics available
function handleNoMetrics(elements) {
  Object.values(elements).forEach(el => el.textContent = "--");
  showNoMetricsMessage();
}

// Show message when no metrics are available
function showNoMetricsMessage() {
  const loadingElement = document.querySelector(".loading-suggestions");
  if (loadingElement) {
    loadingElement.innerHTML = `
      <p>No metrics recorded yet. Visit the Performance page to log your first metrics.</p>
      <button id="go-to-performance" class="btn btn-primary mt-3">Log Your Metrics</button>
    `;
    document.getElementById("go-to-performance")?.addEventListener("click", () => loadPage("performance"));
  }
}

// Animate number counting up
function animateNumber(element, start, end, duration) {
  if (!element) return;
  const range = end - start;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime > duration) {
      element.textContent = end.toFixed(1);
      return;
    }
    
    element.textContent = (start + (range * (elapsedTime / duration))).toFixed(1);
    requestAnimationFrame(updateNumber);
  }
  
  requestAnimationFrame(updateNumber);
}

// Generate AI health suggestions
function generateAIHealthSuggestions(userProfile) {
  console.log("Generating AI suggestions with profile:", userProfile);
  if (!window.HealthSuggestions) return console.error("HealthSuggestions not available");

  setTimeout(() => {
    try {
      const suggestions = window.HealthSuggestions.getContextualAdvice(userProfile);
      console.log("Generated suggestions:", suggestions);
      updateSuggestionUI(suggestions);
    } catch (error) {
      console.error("Error generating health suggestions:", error);
    }
  }, 1500);
}

// Update UI with AI suggestions
function updateSuggestionUI(suggestions) {
  const suggestionTypes = ["training", "nutrition", "recovery"];

  suggestionTypes.forEach(type => {
    const element = document.getElementById(`${type}-suggestions`);
    if (element) {
      element.innerHTML = suggestions?.[type]?.length ? suggestions[type].map(s => `<div class="suggestion-item"><p>${s}</p></div>`).join('') : `<p class="no-suggestions">Track more metrics to get ${type} suggestions.</p>`;
    }
  });
  
  document.querySelector(".loading-suggestions").style.display = "none";
  document.querySelector(".suggestions-content").style.display = "block";
}

// Export functions globally
window.dashboardService = { loadDashboardData, animateNumber, generateAIHealthSuggestions };
