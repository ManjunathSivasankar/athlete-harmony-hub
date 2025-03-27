// Object to store page content
const pages = {
  login: `
    <div class="auth-container">
      <h2 class="auth-title">Sign In to Athlete Harmony Hub</h2>
      <p class="auth-description">Track your athletic performance, monitor vital health metrics, and receive AI-powered training recommendations to reach your peak condition.</p>
      <div id="auth-error" class="error-message" style="display: none;"></div>
      <form id="login-form" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required placeholder="Your password">
        </div>
        <button type="submit">Sign In</button>
      </form>
      
      <div class="auth-divider">
        <span>or</span>
      </div>
      
      <div class="social-login">
        <button id="google-login" class="google-btn">
        
          Sign in with Google
        </button>
      </div>
      
      <div class="auth-footer">
        <p>Don't have an account? <a href="#" id="go-to-signup">Sign Up</a></p>
        <p class="auth-benefits">Join thousands of athletes who optimize their training with data-driven insights.</p>
      </div>
    </div>
  `,
  
  signup: `
    <div class="auth-container">
      <h2 class="auth-title">Create Your Athlete Account</h2>
      <p class="auth-description">Begin your journey to peak performance with personalized analytics, health monitoring, and AI coaching tailored to your athletic profile.</p>
      <div id="auth-error" class="error-message" style="display: none;"></div>
      <form id="signup-form" class="auth-form">
        <div class="form-group">
          <label for="displayName">Full Name</label>
          <input type="text" id="displayName" required placeholder="John Doe">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required placeholder="Minimum 6 characters">
        </div>
        <button type="submit">Create Account</button>
      </form>
      
      <div class="auth-divider">
        <span>or</span>
      </div>
      
      <div class="social-login">
        <button id="google-signup" class="google-btn">
      
          Sign up with Google
        </button>
      </div>
      
      <div class="auth-footer">
        <p>Already have an account? <a href="#" id="go-to-login">Sign In</a></p>
        <p class="auth-benefits">What you'll get:</p>
        <ul class="features-list">
          <li>Performance tracking dashboard</li>
          <li>Health metrics monitoring</li>
          <li>AI-powered training recommendations</li>
          <li>Nutrition and recovery insights</li>
        </ul>
      </div>
    </div>
  `,
  
  dashboard: `
    <nav class="navbar">
      <div class="container flex justify-between items-center">
        <a href="#" class="logo">Athlete Harmony Hub</a>
        <ul>
          <li><a href="#" id="nav-dashboard" class="active">Dashboard</a></li>
          <li><a href="#" id="nav-performance">Performance</a></li>
          <li><a href="#" id="nav-profile">Profile</a></li>
          <li><a href="#" id="sign-out">Sign Out</a></li>
        </ul>
      </div>
    </nav>
    
    <div class="container mt-4">
      <h1>Dashboard</h1>
      <p class="mb-4">Welcome to your athlete dashboard. Track your performance metrics and health indicators.</p>
      
      <div class="dashboard-grid">
        <div class="card metric-card">
          <h3 class="metric-label">Average Speed</h3>
          <div class="metric-value" id="avg-speed">--</div>
          <p>km/hr</p>
        </div>
        
        <div class="card metric-card">
          <h3 class="metric-label">Heart Rate</h3>
          <div class="metric-value" id="heart-rate">--</div>
          <p>bpm</p>
        </div>
        
        <div class="card metric-card">
          <h3 class="metric-label">Blood Pressure</h3>
          <div class="metric-value" id="blood-pressure">--</div>
          <p>mmHg</p>
        </div>
      </div>
      
      <div class="card mt-4">
        <h2 class="card-title">Performance History</h2>
        <div id="performance-chart" class="chart-container">
          <p class="text-center">Loading chart data...</p>
        </div>
      </div>
      
      <div class="card mt-4">
        <h2 class="card-title">AI Health Suggestions</h2>
        <div id="health-suggestions">
          <div class="loading-suggestions">
            <div class="spinner"></div>
            <p>Analyzing your metrics for personalized recommendations...</p>
          </div>
          <div class="suggestions-content" style="display: none;">
            <div class="suggestions-category">
              <h3><span class="icon">🏋️‍♂️</span> Training Recommendations</h3>
              <div id="training-suggestions" class="suggestions-list"></div>
            </div>
            <div class="suggestions-category">
              <h3><span class="icon">🥗</span> Nutrition Advice</h3>
              <div id="nutrition-suggestions" class="suggestions-list"></div>
            </div>
            <div class="suggestions-category">
              <h3><span class="icon">🧘</span> Recovery Tips</h3>
              <div id="recovery-suggestions" class="suggestions-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  profile: `
    <nav class="navbar">
      <div class="container flex justify-between items-center">
        <a href="#" class="logo">Athlete Harmony Hub</a>
        <ul>
          <li><a href="#" id="nav-dashboard">Dashboard</a></li>
          <li><a href="#" id="nav-performance">Performance</a></li>
          <li><a href="#" id="nav-profile" class="active">Profile</a></li>
          <li><a href="#" id="sign-out">Sign Out</a></li>
        </ul>
      </div>
    </nav>
    
    <div class="container mt-4">
      <div class="card">
        <div class="profile-header">
          <img id="profile-avatar" src="default-avatar.png" alt="Profile Avatar" class="profile-avatar">
          <div class="profile-info">
            <h1 id="profile-name" class="profile-name">Athlete Name</h1>
            <p id="profile-email" class="profile-role">athlete@example.com</p>
            <button id="edit-profile" class="secondary">Edit Profile</button>
          </div>
        </div>
        
        <div class="mt-4">
          <h2 class="card-title">Athlete Information</h2>
          <div id="profile-details">
            <div class="form-group">
              <label>Sport</label>
              <p id="profile-sport">--</p>
            </div>
            <div class="form-group">
              <label>Age</label>
              <p id="profile-age">--</p>
            </div>
            <div class="form-group">
              <label>Height</label>
              <p id="profile-height">--</p>
            </div>
            <div class="form-group">
              <label>Weight</label>
              <p id="profile-weight">--</p>
            </div>
          </div>
          
          <div id="profile-form" style="display: none;">
            <form id="update-profile-form">
              <div class="form-group">
                <label for="sport">Sport</label>
                <input type="text" id="sport" placeholder="e.g. Cricket, Football">
              </div>
              <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" placeholder="Your age">
              </div>
              <div class="form-group">
                <label for="height">Height (cm)</label>
                <input type="number" id="height" placeholder="Height in cm">
              </div>
              <div class="form-group">
                <label for="weight">Weight (kg)</label>
                <input type="number" id="weight" placeholder="Weight in kg">
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" id="cancel-edit" class="secondary ml-2">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  
  performance: `
    <nav class="navbar">
      <div class="container flex justify-between items-center">
        <a href="#" class="logo">Athlete Harmony Hub</a>
        <ul>
          <li><a href="#" id="nav-dashboard">Dashboard</a></li>
          <li><a href="#" id="nav-performance" class="active">Performance</a></li>
          <li><a href="#" id="nav-profile">Profile</a></li>
          <li><a href="#" id="sign-out">Sign Out</a></li>
        </ul>
      </div>
    </nav>
    
    <div class="container mt-4">
      <h1>Performance Tracking</h1>
      <p class="mb-4">Track your vital metrics to monitor your performance and health.</p>
      
      <div class="card">
        <h2 class="card-title">Log Today's Metrics</h2>
        <form id="performance-form">
          <div class="form-group">
            <label for="speed">Speed (km/hr)</label>
            <input type="number" id="speed" step="0.1" required placeholder="Enter your average speed">
          </div>
          
          <div class="form-group">
            <label for="heart-rate">Heart Rate (bpm)</label>
            <input type="number" id="heart-rate" required placeholder="Enter your heart rate">
          </div>
          
          <div class="form-group">
            <label for="systolic">Systolic Pressure (mmHg)</label>
            <input type="number" id="systolic" required placeholder="Top number">
          </div>
          
          <div class="form-group">
            <label for="diastolic">Diastolic Pressure (mmHg)</label>
            <input type="number" id="diastolic" required placeholder="Bottom number">
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" rows="3" placeholder="Any additional notes about today's performance"></textarea>
          </div>
          
          <button type="submit">Save Metrics</button>
        </form>
      </div>
    </div>
  `
};

// Load page content
function loadPage(page) {
  const appElement = document.getElementById('app');
  
  if (appElement && pages[page]) {
    appElement.innerHTML = pages[page];
    
    // Add slide-in animation
    appElement.style.opacity = 0;
    appElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      appElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      appElement.style.opacity = 1;
      appElement.style.transform = 'translateY(0)';
    }, 50);
    
    initPageEvents(page);
  } else {
    console.error('Page not found:', page);
  }
}

// Initialize page-specific event listeners
function initPageEvents(page) {
  if (page === 'login') {
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      
      // Add button loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      window.authService.signInWithEmail(email, password)
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
    
    document.getElementById('google-login').addEventListener('click', () => {
      window.authService.signInWithGoogle();
    });
    
    document.getElementById('go-to-signup').addEventListener('click', e => {
      e.preventDefault();
      loadPage('signup');
    });
  }
  
  if (page === 'signup') {
    document.getElementById('signup-form').addEventListener('submit', e => {
      e.preventDefault();
      
      // Add button loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
      
      const displayName = document.getElementById('displayName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      window.authService.signUpWithEmail(email, password, displayName)
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });
    
    document.getElementById('google-signup').addEventListener('click', () => {
      window.authService.signInWithGoogle();
    });
    
    document.getElementById('go-to-login').addEventListener('click', e => {
      e.preventDefault();
      loadPage('login');
    });
  }
  
  if (page === 'dashboard' || page === 'profile' || page === 'performance') {
    // Navigation events
    document.getElementById('nav-dashboard').addEventListener('click', e => {
      e.preventDefault();
      loadPage('dashboard');
    });
    
    document.getElementById('nav-performance').addEventListener('click', e => {
      e.preventDefault();
      loadPage('performance');
    });
    
    document.getElementById('nav-profile').addEventListener('click', e => {
      e.preventDefault();
      loadPage('profile');
    });
    
    document.getElementById('sign-out').addEventListener('click', e => {
      e.preventDefault();
      if (window.authService) {
        window.authService.signOut();
      } else {
        // For demo: go back to login
        loadPage('login');
      }
    });
    
    // Page specific initializations
    if (page === 'dashboard') {
      if (window.dashboardService) {
        window.dashboardService.loadDashboardData();
      } else {
        console.log("Using demo data for dashboard");
        // Demo data for testing without Firebase
        const demoMetrics = {
          speed: 12.5,
          heartRate: 72,
          systolic: 120,
          diastolic: 80
        };
        
        // Update the UI with demo data
        const avgSpeedEl = document.getElementById('avg-speed');
        const heartRateEl = document.getElementById('heart-rate');
        const bloodPressureEl = document.getElementById('blood-pressure');
        
        if (avgSpeedEl) avgSpeedEl.textContent = demoMetrics.speed;
        if (heartRateEl) heartRateEl.textContent = demoMetrics.heartRate;
        if (bloodPressureEl) bloodPressureEl.textContent = `${demoMetrics.systolic}/${demoMetrics.diastolic}`;
        
        // Generate AI suggestions with demo data
        if (window.HealthSuggestions) {
          setTimeout(() => {
            const loadingElement = document.querySelector('.loading-suggestions');
            const suggestionsContent = document.querySelector('.suggestions-content');
            
            const suggestions = window.HealthSuggestions.getContextualAdvice(demoMetrics, {sport: 'Running'});
            
            // Populate training suggestions
            const trainingElement = document.getElementById('training-suggestions');
            if (trainingElement && suggestions.training.length > 0) {
              trainingElement.innerHTML = suggestions.training.map(suggestion => 
                `<div class="suggestion-item"><p>${suggestion}</p></div>`
              ).join('');
            }
            
            // Populate nutrition suggestions
            const nutritionElement = document.getElementById('nutrition-suggestions');
            if (nutritionElement && suggestions.nutrition.length > 0) {
              nutritionElement.innerHTML = suggestions.nutrition.map(suggestion => 
                `<div class="suggestion-item"><p>${suggestion}</p></div>`
              ).join('');
            }
            
            // Populate recovery suggestions
            const recoveryElement = document.getElementById('recovery-suggestions');
            if (recoveryElement && suggestions.recovery.length > 0) {
              recoveryElement.innerHTML = suggestions.recovery.map(suggestion => 
                `<div class="suggestion-item"><p>${suggestion}</p></div>`
              ).join('');
            }
            
            // Hide loading, show content
            if (loadingElement) loadingElement.style.display = 'none';
            if (suggestionsContent) suggestionsContent.style.display = 'block';
            
            // Animate suggestion categories
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
          }, 1500);
        }
      }
    } else if (page === 'profile') {
      window.profileService.loadProfileData();
      
      document.getElementById('edit-profile').addEventListener('click', () => {
        window.profileService.toggleProfileEdit(true);
      });
      
      document.getElementById('cancel-edit').addEventListener('click', () => {
        window.profileService.toggleProfileEdit(false);
      });
      
      document.getElementById('update-profile-form').addEventListener('submit', e => {
        e.preventDefault();
        
        // Add button loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        window.profileService.updateProfile()
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
      });
    } else if (page === 'performance') {
      document.getElementById('performance-form').addEventListener('submit', e => {
        e.preventDefault();
        
        // Add button loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        window.performanceService.savePerformanceData()
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
      });
    }
  }
}

// Check auth state or load demo for viewing
if (typeof auth !== 'undefined') {
  auth.onAuthStateChanged(user => {
    const loader = document.getElementById('loader');
    
    if (user) {
      console.log('User logged in:', user.email);
      // Check if user data exists in Firestore, if not create profile
      if (window.authService) {
        window.authService.checkUserProfile(user);
      }
      loadPage('dashboard');
    } else {
      console.log('No user logged in');
      loadPage('login');
    }
    
    // Hide loader
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  });
} else {
  // For demo without Firebase
  console.log("Running in demo mode without Firebase");
  const loader = document.getElementById('loader');
  // Hide loader
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
  // Load dashboard directly for demo
  loadPage('dashboard');
}

console.log("Application initialized");
