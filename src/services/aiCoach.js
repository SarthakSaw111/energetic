// AI Coach service — the brain of Energetic
// Orchestrates all AI interactions with fallback support

import {
  sendPrompt,
  sendStructuredPrompt,
  sendChat,
  analyzeImage,
  isGeminiReady,
} from "./gemini";
import {
  getWorkoutPrompt,
  getMealParsingPrompt,
  getChatPrompt,
  getWeeklyReportPrompt,
  getPhotoAnalysisPrompt,
  getMealSuggestionPrompt,
  getEmergencyPrompt,
} from "./aiPrompts";
import { getDailyQuote } from "../data/quotes";
import exerciseLibrary from "../data/exerciseLibrary";
import foodDatabase from "../data/foodDatabase";

/**
 * Generate today's workout using AI (with fallback)
 */
export async function generateWorkout(profile, recentData) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getWorkoutPrompt(profile, recentData);
    const result = await sendStructuredPrompt(
      prompt,
      `Generate today's workout. Mood: ${recentData.mood || 3}/5. Available time: ${recentData.availableTime || 15} minutes.`,
    );
    return { success: true, data: result, source: "ai" };
  } catch (err) {
    console.warn("AI workout generation failed, using fallback:", err.message);
    return {
      success: true,
      data: generateFallbackWorkout(profile, recentData),
      source: "fallback",
    };
  }
}

/**
 * Parse a meal description using AI (with fallback)
 */
export async function parseMeal(profile, recentData, description) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getMealParsingPrompt(profile, recentData);
    const result = await sendStructuredPrompt(prompt, description);
    return { success: true, data: result, source: "ai" };
  } catch (err) {
    console.warn("AI meal parsing failed, using fallback:", err.message);
    return {
      success: true,
      data: parseMealFallback(description),
      source: "fallback",
    };
  }
}

/**
 * Chat with AI coach
 */
export async function chatWithCoach(profile, recentData, messages) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const systemPrompt = getChatPrompt(profile, recentData);
    const response = await sendChat(systemPrompt, messages);
    return { success: true, message: response, source: "ai" };
  } catch (err) {
    console.warn("AI chat failed:", err.message);
    const quote = getDailyQuote();
    return {
      success: true,
      message: `I'm having trouble connecting right now, but here's something for you: "${quote.text}" — ${quote.author}. Try again in a moment!`,
      source: "fallback",
    };
  }
}

/**
 * Generate weekly report
 */
export async function generateWeeklyReport(profile, weekData) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getWeeklyReportPrompt(profile, weekData);
    const response = await sendPrompt(
      prompt,
      "Generate this week's progress report.",
    );
    return { success: true, report: response, source: "ai" };
  } catch (err) {
    console.warn("AI weekly report failed:", err.message);
    return {
      success: true,
      report: generateFallbackReport(weekData),
      source: "fallback",
    };
  }
}

/**
 * Analyze progress photo
 */
export async function analyzeProgressPhoto(imageBase64, context = "progress") {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getPhotoAnalysisPrompt(context);
    const response = await analyzeImage(prompt, imageBase64);

    // Try to parse as JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return { success: true, data: JSON.parse(jsonMatch[0]), source: "ai" };
    }
    return {
      success: true,
      data: {
        observation: response,
        encouragement: "Keep going!",
        tags: ["progress"],
      },
      source: "ai",
    };
  } catch (err) {
    console.warn("AI photo analysis failed:", err.message);
    return {
      success: true,
      data: {
        verified: true,
        observation: "Photo saved to your journey!",
        encouragement:
          "Every photo is a milestone marker on your transformation journey.",
        confidence: "default",
        tags: ["progress"],
      },
      source: "fallback",
    };
  }
}

/**
 * Get meal suggestions for remaining calories
 */
export async function getMealSuggestions(
  profile,
  remainingCal,
  remainingProtein,
  timeOfDay,
) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getMealSuggestionPrompt(
      profile,
      remainingCal,
      remainingProtein,
      timeOfDay,
    );
    const result = await sendStructuredPrompt(
      prompt,
      "Suggest meals for the remaining calories.",
    );
    return { success: true, data: result, source: "ai" };
  } catch (err) {
    const suggestions = foodDatabase
      .filter((f) => f.calories >= 200 && f.calories <= remainingCal)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((f) => ({
        meal: f.name,
        calories: f.calories,
        protein: f.protein,
        easyLevel: "easy",
      }));

    return {
      success: true,
      data: {
        suggestions,
        tip: "Try to eat calorie-dense foods like banana shakes, nuts, and milk.",
      },
      source: "fallback",
    };
  }
}

/**
 * Get emergency minimum workout
 */
export async function getEmergencyWorkout(profile, recentData) {
  try {
    if (!isGeminiReady()) throw new Error("AI not available");

    const prompt = getEmergencyPrompt(profile, recentData);
    const result = await sendStructuredPrompt(
      prompt,
      "I really cannot work out today.",
    );
    return { success: true, data: result, source: "ai" };
  } catch (err) {
    return {
      success: true,
      data: {
        empathy: "Hey, that's completely okay. Everyone has off days.",
        minimum: {
          exercise: "Bodyweight Squats",
          reps: 10,
          timeEstimate: "30 seconds",
        },
        motivation:
          "Showing up for 30 seconds keeps the chain alive. That's what matters.",
      },
      source: "fallback",
    };
  }
}

// ============ FALLBACK GENERATORS ============

function generateFallbackWorkout(profile, recentData) {
  const phase = recentData.phase || 1;
  const mood = recentData.mood || 3;
  const equipment = profile.equipment || [];
  const hasDB = equipment.includes("dumbbells");
  const hasBench = equipment.includes("bench");

  // Filter exercises by equipment
  let available = exerciseLibrary.filter((ex) => {
    if (ex.equipment === "none") return true;
    const required = ex.equipment.split(",");
    return required.every((req) => {
      if (req === "dumbbells") return hasDB;
      if (req === "bench") return hasBench;
      return false;
    });
  });

  // Phase-based config
  const config = {
    1: { count: 3, sets: 1, reps: 8 },
    2: { count: 4, sets: 2, reps: 10 },
    3: { count: 5, sets: 3, reps: 12 },
    4: { count: 6, sets: 3, reps: 10 },
  }[phase] || { count: 3, sets: 1, reps: 8 };

  // Mood adjustment
  if (mood <= 2) {
    config.count = Math.max(2, config.count - 1);
    config.sets = Math.max(1, config.sets - 1);
  }

  // Pick exercises (try to vary muscle groups)
  const muscles = ["legs", "chest", "back", "arms", "shoulders", "core"];
  const selected = [];
  for (const muscle of muscles) {
    if (selected.length >= config.count) break;
    const options = available.filter((ex) => ex.muscle === muscle);
    if (options.length > 0) {
      selected.push(options[Math.floor(Math.random() * options.length)]);
    }
  }

  const exercises = selected.map((ex) => ({
    name: ex.name,
    muscle: ex.muscle,
    sets: config.sets,
    reps: config.reps,
    weight: ex.equipment.includes("dumbbells") ? 5 : 0,
    restSeconds: 60,
    tips: ex.description,
  }));

  return {
    greeting: `Day ${recentData.journeyDay || 1}! Let's get it done.`,
    workout: {
      name: `Phase ${phase} Workout`,
      duration: Math.round(exercises.length * config.sets * 1.5),
      exercises,
    },
    aiComment:
      "Solid work. Every rep counts toward the person you're becoming.",
  };
}

function parseMealFallback(description) {
  const lower = description.toLowerCase();
  let totalCal = 0,
    totalProtein = 0,
    totalCarbs = 0,
    totalFats = 0;
  const items = [];

  for (const food of foodDatabase) {
    const keywords = food.name.toLowerCase().split(/[\s()\/]+/);
    if (keywords.some((kw) => kw.length > 3 && lower.includes(kw))) {
      items.push({ name: food.name, quantity: "1 serving", ...food });
      totalCal += food.calories;
      totalProtein += food.protein;
      totalCarbs += food.carbs;
      totalFats += food.fats;
    }
  }

  if (items.length === 0) {
    // Default estimate for unknown food
    return {
      items: [
        {
          name: description,
          quantity: "1 serving",
          calories: 350,
          protein: 12,
          carbs: 45,
          fats: 10,
        },
      ],
      totalCalories: 350,
      totalProtein: 12,
      totalCarbs: 45,
      totalFats: 10,
      comment:
        "I estimated this roughly. The AI will be more accurate when it's available!",
    };
  }

  return {
    items,
    totalCalories: totalCal,
    totalProtein: totalProtein,
    totalCarbs: totalCarbs,
    totalFats: totalFats,
    comment: `Logged ${items.length} item(s). Keep eating well!`,
  };
}

function generateFallbackReport(weekData) {
  return `📊 **Weekly Report** (Offline Mode)

**Workouts:** ${weekData.workoutsCompleted}/7
**Calories avg:** ${weekData.avgCalories} cal
**Weight:** ${weekData.weightChange >= 0 ? "+" : ""}${weekData.weightChange}kg this week

Keep going! The AI report will have more detailed insights when back online.`;
}
