// Complete exercise library with descriptions and muscle groups
// Used as fallback and reference for AI-generated workouts

const exerciseLibrary = [
  // BODYWEIGHT
  {
    id: "pushups",
    name: "Push-ups",
    muscle: "chest",
    equipment: "none",
    description:
      "Hands shoulder-width apart, lower chest to floor, push back up",
    difficulty: 1,
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    muscle: "legs",
    equipment: "none",
    description:
      "Feet shoulder-width, sit back and down like sitting in a chair",
    difficulty: 1,
  },
  {
    id: "lunges",
    name: "Lunges",
    muscle: "legs",
    equipment: "none",
    description: "Step forward, lower back knee toward ground, push back up",
    difficulty: 1,
  },
  {
    id: "plank",
    name: "Plank",
    muscle: "core",
    equipment: "none",
    description: "Hold forearm plank position, keep body straight",
    difficulty: 1,
  },
  {
    id: "mountain_climbers",
    name: "Mountain Climbers",
    muscle: "core",
    equipment: "none",
    description: "Plank position, alternate driving knees to chest",
    difficulty: 2,
  },
  {
    id: "burpees",
    name: "Burpees",
    muscle: "full_body",
    equipment: "none",
    description:
      "Squat down, kick feet back, pushup, jump back, stand and jump",
    difficulty: 3,
  },
  {
    id: "crunches",
    name: "Crunches",
    muscle: "core",
    equipment: "none",
    description: "Lie on back, curl shoulders toward knees",
    difficulty: 1,
  },
  {
    id: "glute_bridge",
    name: "Glute Bridge",
    muscle: "glutes",
    equipment: "none",
    description: "Lie on back, feet flat, push hips up squeezing glutes",
    difficulty: 1,
  },
  {
    id: "wall_sit",
    name: "Wall Sit",
    muscle: "legs",
    equipment: "none",
    description: "Back against wall, slide down to 90° knee angle, hold",
    difficulty: 1,
  },
  {
    id: "superman",
    name: "Superman Hold",
    muscle: "back",
    equipment: "none",
    description: "Lie face down, lift arms and legs off ground, hold",
    difficulty: 1,
  },
  {
    id: "high_knees",
    name: "High Knees",
    muscle: "legs",
    equipment: "none",
    description: "Run in place bringing knees to hip height",
    difficulty: 1,
  },
  {
    id: "jumping_jacks",
    name: "Jumping Jacks",
    muscle: "full_body",
    equipment: "none",
    description: "Jump feet apart while raising arms overhead, repeat",
    difficulty: 1,
  },

  // DUMBBELL - CHEST
  {
    id: "db_bench_press",
    name: "Dumbbell Bench Press",
    muscle: "chest",
    equipment: "dumbbells,bench",
    description: "Lie on bench, press dumbbells up from chest level",
    difficulty: 2,
  },
  {
    id: "db_flyes",
    name: "Dumbbell Flyes",
    muscle: "chest",
    equipment: "dumbbells,bench",
    description:
      "Lie on bench, arms wide, bring dumbbells together above chest",
    difficulty: 2,
  },
  {
    id: "db_incline_press",
    name: "Incline Dumbbell Press",
    muscle: "chest",
    equipment: "dumbbells,bench",
    description: "Bench at 30-45°, press dumbbells up",
    difficulty: 2,
  },
  {
    id: "db_pullover",
    name: "Dumbbell Pullover",
    muscle: "chest",
    equipment: "dumbbells,bench",
    description:
      "Lie on bench, one dumbbell above chest, lower behind head, pull back",
    difficulty: 2,
  },

  // DUMBBELL - BACK
  {
    id: "db_rows",
    name: "Dumbbell Rows",
    muscle: "back",
    equipment: "dumbbells,bench",
    description: "One knee on bench, pull dumbbell up to hip",
    difficulty: 2,
  },
  {
    id: "db_bent_over_rows",
    name: "Bent Over Dumbbell Rows",
    muscle: "back",
    equipment: "dumbbells",
    description: "Hinge at hips, pull dumbbells to waist",
    difficulty: 2,
  },
  {
    id: "db_reverse_flyes",
    name: "Reverse Flyes",
    muscle: "back",
    equipment: "dumbbells",
    description:
      "Bent over, raise dumbbells out to sides squeezing shoulder blades",
    difficulty: 2,
  },

  // DUMBBELL - SHOULDERS
  {
    id: "db_shoulder_press",
    name: "Dumbbell Shoulder Press",
    muscle: "shoulders",
    equipment: "dumbbells",
    description: "Seated or standing, press dumbbells overhead",
    difficulty: 2,
  },
  {
    id: "db_lateral_raise",
    name: "Lateral Raises",
    muscle: "shoulders",
    equipment: "dumbbells",
    description: "Arms at sides, raise dumbbells out to shoulder height",
    difficulty: 2,
  },
  {
    id: "db_front_raise",
    name: "Front Raises",
    muscle: "shoulders",
    equipment: "dumbbells",
    description: "Raise dumbbells in front to shoulder height, alternate arms",
    difficulty: 2,
  },
  {
    id: "db_shrugs",
    name: "Dumbbell Shrugs",
    muscle: "shoulders",
    equipment: "dumbbells",
    description: "Hold dumbbells at sides, shrug shoulders up toward ears",
    difficulty: 1,
  },

  // DUMBBELL - ARMS
  {
    id: "db_bicep_curls",
    name: "Bicep Curls",
    muscle: "arms",
    equipment: "dumbbells",
    description: "Standing, curl dumbbells up toward shoulders",
    difficulty: 1,
  },
  {
    id: "db_hammer_curls",
    name: "Hammer Curls",
    muscle: "arms",
    equipment: "dumbbells",
    description: "Neutral grip (palms facing in), curl dumbbells up",
    difficulty: 1,
  },
  {
    id: "db_concentration_curls",
    name: "Concentration Curls",
    muscle: "arms",
    equipment: "dumbbells,bench",
    description: "Seated, elbow on inner thigh, curl one dumbbell",
    difficulty: 2,
  },
  {
    id: "db_tricep_overhead",
    name: "Overhead Tricep Extension",
    muscle: "arms",
    equipment: "dumbbells",
    description:
      "One dumbbell overhead with both hands, lower behind head, extend",
    difficulty: 2,
  },
  {
    id: "db_tricep_kickback",
    name: "Tricep Kickbacks",
    muscle: "arms",
    equipment: "dumbbells",
    description: "Bent over, extend forearm back while keeping upper arm still",
    difficulty: 2,
  },
  {
    id: "db_wrist_curls",
    name: "Wrist Curls",
    muscle: "arms",
    equipment: "dumbbells",
    description: "Forearms on thighs, curl wrists up with dumbbells",
    difficulty: 1,
  },

  // DUMBBELL - LEGS
  {
    id: "db_goblet_squat",
    name: "Goblet Squats",
    muscle: "legs",
    equipment: "dumbbells",
    description: "Hold one dumbbell at chest, squat down and up",
    difficulty: 2,
  },
  {
    id: "db_lunges",
    name: "Dumbbell Lunges",
    muscle: "legs",
    equipment: "dumbbells",
    description: "Hold dumbbells at sides, step forward into lunge",
    difficulty: 2,
  },
  {
    id: "db_romanian_deadlift",
    name: "Romanian Deadlift",
    muscle: "legs",
    equipment: "dumbbells",
    description: "Hold dumbbells, hinge at hips keeping legs slightly bent",
    difficulty: 2,
  },
  {
    id: "db_calf_raises",
    name: "Calf Raises",
    muscle: "legs",
    equipment: "dumbbells",
    description: "Hold dumbbells, rise up on toes, lower slowly",
    difficulty: 1,
  },
  {
    id: "db_sumo_squat",
    name: "Sumo Squats",
    muscle: "legs",
    equipment: "dumbbells",
    description: "Wide stance, hold dumbbell between legs, squat deep",
    difficulty: 2,
  },
  {
    id: "db_step_ups",
    name: "Step-ups",
    muscle: "legs",
    equipment: "dumbbells,bench",
    description: "Hold dumbbells, step up onto bench alternating legs",
    difficulty: 2,
  },

  // DUMBBELL - CORE
  {
    id: "db_russian_twist",
    name: "Russian Twist",
    muscle: "core",
    equipment: "dumbbells",
    description: "Seated, lean back, rotate dumbbell side to side",
    difficulty: 2,
  },
  {
    id: "db_weighted_crunch",
    name: "Weighted Crunches",
    muscle: "core",
    equipment: "dumbbells",
    description: "Hold dumbbell on chest, perform crunches",
    difficulty: 2,
  },
  {
    id: "db_side_bend",
    name: "Side Bends",
    muscle: "core",
    equipment: "dumbbells",
    description: "Hold dumbbell in one hand, bend sideways, return upright",
    difficulty: 1,
  },
];

export default exerciseLibrary;

/**
 * Get exercises filtered by equipment available
 */
export function getAvailableExercises(equipment = []) {
  return exerciseLibrary.filter((ex) => {
    if (ex.equipment === "none") return true;
    const required = ex.equipment.split(",");
    return required.every((req) => equipment.includes(req));
  });
}

/**
 * Get exercises by muscle group
 */
export function getExercisesByMuscle(muscle, equipment = []) {
  return getAvailableExercises(equipment).filter((ex) => ex.muscle === muscle);
}
