/**
 * Health Suggestions Service
 * Provides AI-driven health recommendations based on user metrics
 */

const HealthSuggestions = (function() {
  // Private variables and methods
  const HEART_RATE_RANGES = {
    LOW: { min: 0, max: 59, category: "low" },
    NORMAL: { min: 60, max: 100, category: "normal" },
    ELEVATED: { min: 101, max: 999, category: "elevated" }
  };

  const BLOOD_PRESSURE_RANGES = {
    LOW: { systolic: { min: 0, max: 89 }, diastolic: { min: 0, max: 59 }, category: "low" },
    NORMAL: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 }, category: "normal" },
    ELEVATED: { systolic: { min: 121, max: 139 }, diastolic: { min: 81, max: 89 }, category: "elevated" },
    HIGH: { systolic: { min: 140, max: 999 }, diastolic: { min: 90, max: 999 }, category: "high" }
  };

  // Get heart rate category
  function getHeartRateCategory(heartRate) {
    if (!heartRate) return null;
    if (heartRate < HEART_RATE_RANGES.LOW.max) return HEART_RATE_RANGES.LOW.category;
    if (heartRate <= HEART_RATE_RANGES.NORMAL.max) return HEART_RATE_RANGES.NORMAL.category;
    return HEART_RATE_RANGES.ELEVATED.category;
  }

  // Get blood pressure category
  function getBloodPressureCategory(systolic, diastolic) {
    if (!systolic || !diastolic) return null;
    
    if (systolic >= BLOOD_PRESSURE_RANGES.HIGH.systolic.min || 
        diastolic >= BLOOD_PRESSURE_RANGES.HIGH.diastolic.min) {
      return BLOOD_PRESSURE_RANGES.HIGH.category;
    }
    
    if (systolic >= BLOOD_PRESSURE_RANGES.ELEVATED.systolic.min || 
        diastolic >= BLOOD_PRESSURE_RANGES.ELEVATED.diastolic.min) {
      return BLOOD_PRESSURE_RANGES.ELEVATED.category;
    }
    
    if (systolic < BLOOD_PRESSURE_RANGES.LOW.systolic.max || 
        diastolic < BLOOD_PRESSURE_RANGES.LOW.diastolic.max) {
      return BLOOD_PRESSURE_RANGES.LOW.category;
    }
    
    return BLOOD_PRESSURE_RANGES.NORMAL.category;
  }

  // Training intensity suggestions based on heart rate and blood pressure
  const trainingIntensitySuggestions = {
    heartRate: {
      low: [
        "Your resting heart rate is quite low, which often indicates excellent cardiovascular fitness. Athletes typically have lower resting heart rates.",
        "A low heart rate suggests your heart is efficient at pumping blood. Continue your current endurance training routine.",
        "Your low heart rate indicates good cardiovascular health. Consider gradually increasing training intensity to maintain this fitness level."
      ],
      normal: [
        "Your heart rate is in a healthy range. Continue with your balanced training program.",
        "Normal heart rate indicates good cardiovascular health. Mix high-intensity intervals with recovery periods for optimal training.",
        "Your heart rate is within normal range. Consider incorporating both aerobic and anaerobic exercises in your routine."
      ],
      elevated: [
        "Your elevated heart rate suggests you may need more recovery time between intense training sessions.",
        "Consider focusing on lower intensity workouts and proper recovery until your heart rate normalizes.",
        "An elevated heart rate may indicate overtraining or stress. Prioritize sleep, hydration, and rest days in your training plan."
      ]
    },
    bloodPressure: {
      low: [
        "Your blood pressure is on the lower side. Ensure you're staying properly hydrated before, during, and after exercise.",
        "Low blood pressure can sometimes cause dizziness during position changes. Rise slowly after floor exercises.",
        "With lower blood pressure, focus on adequate sodium intake on heavy training days, especially in hot weather."
      ],
      normal: [
        "Your blood pressure is in the ideal range. Maintain your current balance of cardio and strength training.",
        "Normal blood pressure is a sign of good cardiovascular health. Continue your healthy lifestyle practices.",
        "Your blood pressure readings are optimal. Your current training and recovery approach is working well."
      ],
      elevated: [
        "Your blood pressure is slightly elevated. Consider incorporating more regular cardio sessions at moderate intensity.",
        "Elevated blood pressure may benefit from increased aerobic exercise and reduced sodium intake.",
        "Focus on deep breathing exercises and stress management techniques alongside your regular training."
      ],
      high: [
        "Your blood pressure readings are high. Consult with a healthcare provider before continuing with high-intensity exercise.",
        "High blood pressure requires attention. Focus on consistent, moderate exercise rather than intense sessions until it normalizes.",
        "Consider monitoring your blood pressure regularly and focusing on exercises known to help reduce blood pressure, such as walking, swimming, and cycling."
      ]
    }
  };

  // Nutrition suggestions based on metrics
  const nutritionSuggestions = {
    heartRate: {
      low: [
        "Ensure adequate calorie intake to support your athletic performance despite your efficient cardiovascular system.",
        "Include quality carbohydrates like whole grains to maintain energy levels for training."
      ],
      normal: [
        "Maintain a balanced diet with lean protein, complex carbohydrates, and healthy fats to support your activity level.",
        "Stay hydrated throughout the day, aiming for at least 2-3 liters of water daily."
      ],
      elevated: [
        "Focus on anti-inflammatory foods like berries, fatty fish, and leafy greens to support recovery.",
        "Consider reducing caffeine intake which can elevate heart rate further."
      ]
    },
    bloodPressure: {
      low: [
        "Include adequate sodium in your diet, especially on heavy training days.",
        "Stay well-hydrated and consider electrolyte beverages during intense training sessions."
      ],
      normal: [
        "Continue your balanced dietary approach with plenty of fruits, vegetables, and whole foods.",
        "Maintain adequate potassium intake through foods like bananas, potatoes, and leafy greens."
      ],
      elevated: [
        "Consider following the DASH diet (Dietary Approaches to Stop Hypertension) which emphasizes fruits, vegetables, and low-fat dairy.",
        "Reduce sodium intake by limiting processed foods and using herbs and spices for flavoring instead of salt."
      ],
      high: [
        "Significantly reduce sodium intake and increase potassium-rich foods like bananas, oranges, and potatoes.",
        "Consider incorporating heart-healthy foods like oats, berries, and fatty fish rich in omega-3s."
      ]
    }
  };

  // Recovery suggestions based on metrics
  const recoverySuggestions = {
    heartRate: {
      low: [
        "Your low resting heart rate suggests your recovery systems are working efficiently. Continue your current recovery practices.",
        "Monitor heart rate variability (HRV) if possible, as it's another excellent indicator of recovery status."
      ],
      normal: [
        "Practice active recovery between intense training days, such as light jogging, swimming, or yoga.",
        "Ensure 7-9 hours of quality sleep to optimize recovery and performance."
      ],
      elevated: [
        "Prioritize extra recovery time with your elevated heart rate. Consider adding an additional rest day this week.",
        "Focus on quality sleep, as sleep deprivation can contribute to elevated resting heart rate."
      ]
    },
    bloodPressure: {
      low: [
        "Focus on gradual transitions from lying to standing positions to avoid dizziness during recovery sessions.",
        "Consider compression garments to support blood flow, especially after intense training."
      ],
      normal: [
        "Your blood pressure indicates good recovery balance. Continue alternating between high and low-intensity training days.",
        "Practice progressive muscle relaxation or meditation to maintain healthy blood pressure levels."
      ],
      elevated: [
        "Incorporate regular deep breathing exercises and meditation to support your nervous system.",
        "Consider gentle yoga or tai chi as recovery activities that may help reduce blood pressure."
      ],
      high: [
        "Prioritize stress reduction techniques like deep breathing, meditation, or gentle yoga.",
        "Monitor your blood pressure regularly and consider discussing with a healthcare provider if it remains high."
      ]
    }
  };

  // Get random suggestions from the appropriate category
  function getRandomSuggestion(category, type, metric) {
    const suggestions = type[metric];
    if (!suggestions) return null;
    
    const index = Math.floor(Math.random() * suggestions.length);
    return suggestions[index];
  }

  // Public methods
  return {
    generateSuggestions: function(metrics) {
      console.log("Generating suggestions for metrics:", metrics);
      
      const result = {
        training: [],
        nutrition: [],
        recovery: []
      };
      
      // Generate heart rate based suggestions
      if (metrics.heartRate) {
        const heartRateCategory = getHeartRateCategory(metrics.heartRate);
        
        if (heartRateCategory) {
          const trainingHRSuggestion = getRandomSuggestion(heartRateCategory, trainingIntensitySuggestions.heartRate, heartRateCategory);
          if (trainingHRSuggestion) result.training.push(trainingHRSuggestion);
          
          const nutritionHRSuggestion = getRandomSuggestion(heartRateCategory, nutritionSuggestions.heartRate, heartRateCategory);
          if (nutritionHRSuggestion) result.nutrition.push(nutritionHRSuggestion);
          
          const recoveryHRSuggestion = getRandomSuggestion(heartRateCategory, recoverySuggestions.heartRate, heartRateCategory);
          if (recoveryHRSuggestion) result.recovery.push(recoveryHRSuggestion);
        }
      }
      
      // Generate blood pressure based suggestions
      if (metrics.systolic && metrics.diastolic) {
        const bpCategory = getBloodPressureCategory(metrics.systolic, metrics.diastolic);
        
        if (bpCategory) {
          const trainingBPSuggestion = getRandomSuggestion(bpCategory, trainingIntensitySuggestions.bloodPressure, bpCategory);
          if (trainingBPSuggestion) result.training.push(trainingBPSuggestion);
          
          const nutritionBPSuggestion = getRandomSuggestion(bpCategory, nutritionSuggestions.bloodPressure, bpCategory);
          if (nutritionBPSuggestion) result.nutrition.push(nutritionBPSuggestion);
          
          const recoveryBPSuggestion = getRandomSuggestion(bpCategory, recoverySuggestions.bloodPressure, bpCategory);
          if (recoveryBPSuggestion) result.recovery.push(recoveryBPSuggestion);
        }
      }
      
      // Add default suggestions if none were generated
      if (result.training.length === 0) {
        result.training.push("For optimal performance, mix high and low intensity training throughout your week.");
      }
      
      if (result.nutrition.length === 0) {
        result.nutrition.push("Focus on a balanced diet with adequate protein, complex carbohydrates, and healthy fats to support your training.");
      }
      
      if (result.recovery.length === 0) {
        result.recovery.push("Ensure you're getting 7-9 hours of quality sleep each night for optimal recovery and performance.");
      }

      return result;
    },
    
    getContextualAdvice: function(metrics, userProfile) {
      console.log("Getting contextual advice for:", metrics, userProfile);
      
      // This method incorporates user profile info like age, sport type, etc.
      // for even more personalized suggestions
      const suggestions = this.generateSuggestions(metrics);
      
      // Add contextual advice based on the user's sport if available
      if (userProfile && userProfile.sport) {
        const sport = userProfile.sport.toLowerCase();
        
        if (sport.includes('running') || sport.includes('marathon')) {
          suggestions.training.push("For runners, consider the 80/20 rule: 80% of training at easy pace, 20% at moderate to high intensity.");
        } else if (sport.includes('cycling') || sport.includes('bike')) {
          suggestions.training.push("For cyclists, incorporate interval training to improve power output and endurance.");
        } else if (sport.includes('swimming')) {
          suggestions.training.push("For swimmers, focus on technique drills to improve efficiency and reduce injury risk.");
        } else if (sport.includes('weightlifting') || sport.includes('strength')) {
          suggestions.nutrition.push("For strength athletes, ensure adequate protein intake of 1.6-2.2g per kg of bodyweight.");
        }
      }
      
      return suggestions;
    }
  };
})();

// Make this available globally
window.HealthSuggestions = HealthSuggestions;

// Log that the service has been loaded
console.log("Health Suggestions service loaded successfully");
