// App-wide constants
export const APP_NAME = "Energetic";
export const APP_VERSION = "1.0.0";

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: "energetic_user_profile",
  DAILY_LOGS: "energetic_daily_logs",
  STREAK_DATA: "energetic_streak_data",
  XP_DATA: "energetic_xp_data",
  CONVERSATIONS: "energetic_conversations",
  SETTINGS: "energetic_settings",
  GALLERY: "energetic_gallery",
  WORKOUT_CACHE: "energetic_workout_cache",
};

// Gemini config
export const GEMINI_MODEL = "gemini-2.5-flash-lite";
export const GEMINI_MODEL_VISION = "gemini-2.5-flash";

// Phases
export const PHASES = {
  SEED: 1, // Week 1-2: Micro-habits
  SPROUT: 2, // Week 3-4: Building
  GROWTH: 3, // Month 2-3: Real training
  TREE: 4, // Month 3+: Full program
};

// Mood levels
export const MOODS = [
  { value: 1, emoji: "😴", label: "Exhausted" },
  { value: 2, emoji: "😐", label: "Low" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🔥", label: "On Fire" },
];

// Meal slots
export const MEAL_SLOTS = ["breakfast", "lunch", "snack", "dinner"];

// XP rewards
export const XP_REWARDS = {
  WORKOUT_COMPLETE: 50,
  EMERGENCY_MINIMUM: 25,
  ALL_MEALS_LOGGED: 30,
  CALORIE_TARGET_80: 20,
  CALORIE_TARGET_100: 30,
  LOG_WEIGHT: 10,
  DAILY_CHECKIN: 5,
  STREAK_7: 100,
  STREAK_14: 200,
  STREAK_30: 500,
  STREAK_60: 1000,
  PHOTO_UPLOAD: 15,
};

// Coach personalities
export const COACH_TYPES = {
  BRO: "bro",
  DRILL: "drill",
  SCIENCE: "science",
  CHILL: "chill",
};

// Navigation items
export const NAV_ITEMS = [
  { path: "/", icon: "Home", label: "Home" },
  { path: "/workout", icon: "Dumbbell", label: "Workout" },
  { path: "/meals", icon: "UtensilsCrossed", label: "Meals" },
  { path: "/progress", icon: "TrendingUp", label: "Progress" },
  { path: "/profile", icon: "User", label: "Profile" },
];
