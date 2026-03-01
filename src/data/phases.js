// Workout phase definitions
const phases = [
  {
    id: 1,
    name: "The Seed",
    subtitle: "Building the habit (Week 1-2)",
    description:
      "Start incredibly small. The goal is NOT fitness — it's showing up every day.",
    minDays: 0,
    maxDays: 14,
    targetDuration: { min: 3, max: 10 },
    targetSets: { min: 1, max: 2 },
    targetReps: { min: 5, max: 12 },
    exercisesPerWorkout: { min: 2, max: 4 },
    restDays: 1, // per week
    focus: "Habit formation, basic movement patterns",
    tips: [
      "If you do just ONE exercise, you win",
      "Don't add weight yet — bodyweight is enough",
      "The workout should feel easy. That's the point.",
    ],
  },
  {
    id: 2,
    name: "The Sprout",
    subtitle: "Building foundation (Week 3-4)",
    description:
      "Now we introduce real structure. Push/pull splits and dumbbells.",
    minDays: 14,
    maxDays: 28,
    targetDuration: { min: 10, max: 20 },
    targetSets: { min: 2, max: 3 },
    targetReps: { min: 8, max: 12 },
    exercisesPerWorkout: { min: 3, max: 5 },
    restDays: 2,
    focus: "Introduce dumbbells, push/pull structure",
    tips: [
      "Start with the lightest dumbbell and focus on form",
      "If 5kg feels heavy, that's totally normal at this stage",
      "Push day = chest + shoulders + triceps. Pull day = back + biceps",
    ],
  },
  {
    id: 3,
    name: "The Growth",
    subtitle: "Real training (Month 2-3)",
    description: "Full structured workouts with progressive overload.",
    minDays: 28,
    maxDays: 60,
    targetDuration: { min: 20, max: 35 },
    targetSets: { min: 3, max: 4 },
    targetReps: { min: 8, max: 15 },
    exercisesPerWorkout: { min: 4, max: 6 },
    restDays: 2,
    focus: "Progressive overload, compound movements, push/pull/legs",
    tips: [
      "Try to increase weight OR reps every week",
      "If you can do 12 reps easily, it's time to go heavier",
      "Push/Pull/Legs split or Upper/Lower split",
    ],
  },
  {
    id: 4,
    name: "The Tree",
    subtitle: "Full program (Month 3+)",
    description:
      "You're now training like someone who takes fitness seriously.",
    minDays: 60,
    maxDays: Infinity,
    targetDuration: { min: 35, max: 50 },
    targetSets: { min: 3, max: 4 },
    targetReps: { min: 6, max: 12 },
    exercisesPerWorkout: { min: 5, max: 7 },
    restDays: 2,
    focus: "Advanced overload, hypertrophy focus, deload weeks",
    tips: [
      "Every 4th week, reduce weight by 30% (deload)",
      "Focus on mind-muscle connection",
      "Progressive overload is king — track every set",
    ],
  },
];

export default phases;

/**
 * Get phase for day count
 */
export function getPhaseForDay(dayCount) {
  for (let i = phases.length - 1; i >= 0; i--) {
    if (dayCount >= phases[i].minDays) return phases[i];
  }
  return phases[0];
}
