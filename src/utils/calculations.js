// Fitness and nutrition calculations

/**
 * Calculate BMI
 */
export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return +(weightKg / (heightM * heightM)).toFixed(1);
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi) {
  if (bmi < 16) return { label: "Severely Underweight", color: "text-red-500" };
  if (bmi < 18.5) return { label: "Underweight", color: "text-yellow-500" };
  if (bmi < 25) return { label: "Normal", color: "text-green-500" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
  return { label: "Obese", color: "text-red-500" };
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure) using Mifflin-St Jeor
 * For weight GAIN, we add a surplus
 */
export function calculateTDEE(
  weightKg,
  heightCm,
  age,
  gender = "male",
  activityLevel = "sedentary",
) {
  let bmr;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
}

/**
 * Calculate daily calorie target for weight gain
 * Surplus of 400-500 calories for lean muscle gain
 */
export function calculateCalorieTarget(
  weightKg,
  heightCm,
  age,
  gender = "male",
) {
  const tdee = calculateTDEE(weightKg, heightCm, age, gender, "light");
  return Math.round(tdee + 450); // 450 calorie surplus for muscle gain
}

/**
 * Calculate protein target (2g per kg bodyweight for underweight gaining)
 */
export function calculateProteinTarget(weightKg, goalWeightKg) {
  // Use a value between current and goal weight
  const targetWeight = weightKg + (goalWeightKg - weightKg) * 0.3;
  return Math.round(targetWeight * 2);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Predict future weight based on current trend
 */
export function predictWeight(
  startWeight,
  currentWeight,
  daysElapsed,
  targetDays,
) {
  if (daysElapsed === 0) return currentWeight;
  const dailyGain = (currentWeight - startWeight) / daysElapsed;
  return +(currentWeight + dailyGain * targetDays).toFixed(1);
}

/**
 * Calculate current phase based on active days
 */
export function getCurrentPhase(activeDays) {
  if (activeDays < 14) return 1; // Seed: Week 1-2
  if (activeDays < 28) return 2; // Sprout: Week 3-4
  if (activeDays < 60) return 3; // Growth: Month 2-3
  return 4; // Tree: Month 3+
}

/**
 * Calculate workout duration based on phase and mood
 */
export function getTargetWorkoutDuration(phase, mood) {
  const baseDurations = { 1: 8, 2: 15, 3: 25, 4: 40 };
  const base = baseDurations[phase] || 8;
  const moodMultiplier =
    mood <= 2 ? 0.6 : mood === 3 ? 0.8 : mood >= 4 ? 1.0 : 1.0;
  return Math.round(base * moodMultiplier);
}

/**
 * Calculate total workout volume (weight × reps across all sets)
 */
export function calculateVolume(exercises) {
  return exercises.reduce((total, ex) => {
    return (
      total +
      ex.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight || 0) * (set.reps || 0);
      }, 0)
    );
  }, 0);
}

/**
 * Format weight with unit
 */
export function formatWeight(kg) {
  return `${kg} kg`;
}

/**
 * Format calories
 */
export function formatCalories(cal) {
  return `${Math.round(cal)} cal`;
}
