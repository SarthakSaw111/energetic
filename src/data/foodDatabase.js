// Common Indian foods with nutritional data (per serving)
// Used as fallback when AI is unavailable
const foodDatabase = [
  // BREAKFAST
  {
    name: "2 Eggs (boiled/fried)",
    calories: 155,
    protein: 13,
    carbs: 1,
    fats: 11,
    category: "breakfast",
  },
  {
    name: "Egg Omelette (2 eggs)",
    calories: 190,
    protein: 14,
    carbs: 2,
    fats: 14,
    category: "breakfast",
  },
  {
    name: "Paratha (1 with butter)",
    calories: 280,
    protein: 5,
    carbs: 35,
    fats: 14,
    category: "breakfast",
  },
  {
    name: "Aloo Paratha (1)",
    calories: 300,
    protein: 6,
    carbs: 40,
    fats: 13,
    category: "breakfast",
  },
  {
    name: "Poha (1 plate)",
    calories: 250,
    protein: 5,
    carbs: 45,
    fats: 7,
    category: "breakfast",
  },
  {
    name: "Upma (1 bowl)",
    calories: 230,
    protein: 6,
    carbs: 38,
    fats: 7,
    category: "breakfast",
  },
  {
    name: "Idli (2 pieces)",
    calories: 130,
    protein: 4,
    carbs: 24,
    fats: 1,
    category: "breakfast",
  },
  {
    name: "Dosa (1 plain)",
    calories: 170,
    protein: 4,
    carbs: 27,
    fats: 5,
    category: "breakfast",
  },
  {
    name: "Masala Dosa",
    calories: 290,
    protein: 6,
    carbs: 42,
    fats: 11,
    category: "breakfast",
  },
  {
    name: "Bread Toast (2 slices with butter)",
    calories: 220,
    protein: 6,
    carbs: 28,
    fats: 10,
    category: "breakfast",
  },
  {
    name: "Cornflakes with milk",
    calories: 250,
    protein: 8,
    carbs: 42,
    fats: 5,
    category: "breakfast",
  },

  // MAIN MEALS
  {
    name: "Rice (1 plate/cup)",
    calories: 200,
    protein: 4,
    carbs: 45,
    fats: 0.5,
    category: "main",
  },
  {
    name: "Roti/Chapati (1)",
    calories: 100,
    protein: 3,
    carbs: 18,
    fats: 2,
    category: "main",
  },
  {
    name: "Dal (1 bowl)",
    calories: 180,
    protein: 12,
    carbs: 25,
    fats: 3,
    category: "main",
  },
  {
    name: "Rajma (1 bowl)",
    calories: 220,
    protein: 14,
    carbs: 30,
    fats: 4,
    category: "main",
  },
  {
    name: "Chole (1 bowl)",
    calories: 240,
    protein: 13,
    carbs: 32,
    fats: 7,
    category: "main",
  },
  {
    name: "Paneer Curry (1 bowl)",
    calories: 320,
    protein: 18,
    carbs: 12,
    fats: 22,
    category: "main",
  },
  {
    name: "Chicken Curry (1 bowl)",
    calories: 280,
    protein: 28,
    carbs: 8,
    fats: 15,
    category: "main",
  },
  {
    name: "Egg Curry (2 eggs)",
    calories: 250,
    protein: 16,
    carbs: 10,
    fats: 16,
    category: "main",
  },
  {
    name: "Mixed Veg Sabzi",
    calories: 120,
    protein: 4,
    carbs: 15,
    fats: 5,
    category: "main",
  },
  {
    name: "Aloo Gobi",
    calories: 150,
    protein: 4,
    carbs: 20,
    fats: 6,
    category: "main",
  },
  {
    name: "Biryani (1 plate)",
    calories: 450,
    protein: 18,
    carbs: 55,
    fats: 18,
    category: "main",
  },
  {
    name: "Curd/Yogurt (1 bowl)",
    calories: 100,
    protein: 5,
    carbs: 8,
    fats: 5,
    category: "main",
  },
  {
    name: "Raita (1 bowl)",
    calories: 80,
    protein: 4,
    carbs: 6,
    fats: 4,
    category: "main",
  },

  // SNACKS (calorie-dense for weight gain)
  {
    name: "Banana (1)",
    calories: 105,
    protein: 1,
    carbs: 27,
    fats: 0.4,
    category: "snack",
  },
  {
    name: "Banana Shake with milk",
    calories: 300,
    protein: 10,
    carbs: 50,
    fats: 7,
    category: "snack",
  },
  {
    name: "Banana PB Shake",
    calories: 500,
    protein: 18,
    carbs: 55,
    fats: 22,
    category: "snack",
  },
  {
    name: "Peanut Butter (2 tbsp)",
    calories: 190,
    protein: 8,
    carbs: 6,
    fats: 16,
    category: "snack",
  },
  {
    name: "Mixed Nuts (handful)",
    calories: 200,
    protein: 6,
    carbs: 8,
    fats: 18,
    category: "snack",
  },
  {
    name: "Samosa (1)",
    calories: 250,
    protein: 4,
    carbs: 28,
    fats: 14,
    category: "snack",
  },
  {
    name: "Bread Pakora (2)",
    calories: 280,
    protein: 6,
    carbs: 30,
    fats: 15,
    category: "snack",
  },
  {
    name: "Maggi (1 pack)",
    calories: 310,
    protein: 7,
    carbs: 42,
    fats: 13,
    category: "snack",
  },
  {
    name: "Biscuits (5 pieces)",
    calories: 200,
    protein: 3,
    carbs: 28,
    fats: 9,
    category: "snack",
  },
  {
    name: "Apple (1)",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
    category: "snack",
  },
  {
    name: "Mango (1)",
    calories: 200,
    protein: 3,
    carbs: 50,
    fats: 1,
    category: "snack",
  },
  {
    name: "Dates (5)",
    calories: 140,
    protein: 1,
    carbs: 37,
    fats: 0.2,
    category: "snack",
  },
  {
    name: "Chana (roasted, 1 cup)",
    calories: 180,
    protein: 10,
    carbs: 25,
    fats: 4,
    category: "snack",
  },

  // DRINKS
  {
    name: "Milk (1 glass)",
    calories: 150,
    protein: 8,
    carbs: 12,
    fats: 8,
    category: "drink",
  },
  {
    name: "Tea with milk",
    calories: 80,
    protein: 2,
    carbs: 10,
    fats: 3,
    category: "drink",
  },
  {
    name: "Coffee with milk",
    calories: 80,
    protein: 2,
    carbs: 10,
    fats: 3,
    category: "drink",
  },
  {
    name: "Lassi (1 glass)",
    calories: 200,
    protein: 6,
    carbs: 30,
    fats: 6,
    category: "drink",
  },
  {
    name: "Mango Lassi",
    calories: 280,
    protein: 7,
    carbs: 45,
    fats: 8,
    category: "drink",
  },
  {
    name: "Buttermilk (1 glass)",
    calories: 60,
    protein: 3,
    carbs: 5,
    fats: 2,
    category: "drink",
  },
  {
    name: "Protein Shake (with milk)",
    calories: 350,
    protein: 35,
    carbs: 25,
    fats: 10,
    category: "drink",
  },
  {
    name: "Mass Gainer Shake",
    calories: 600,
    protein: 25,
    carbs: 90,
    fats: 10,
    category: "drink",
  },

  // HIGH-CALORIE COMBOS (for weight gain suggestions)
  {
    name: "Rice + Dal + Sabzi",
    calories: 500,
    protein: 20,
    carbs: 85,
    fats: 8,
    category: "combo",
  },
  {
    name: "3 Rotis + Chicken Curry",
    calories: 580,
    protein: 34,
    carbs: 62,
    fats: 19,
    category: "combo",
  },
  {
    name: "3 Rotis + Paneer + Dal",
    calories: 600,
    protein: 30,
    carbs: 68,
    fats: 22,
    category: "combo",
  },
  {
    name: "2 Rotis + Egg Curry + Curd",
    calories: 450,
    protein: 24,
    carbs: 44,
    fats: 19,
    category: "combo",
  },
  {
    name: "Biryani + Raita",
    calories: 530,
    protein: 22,
    carbs: 61,
    fats: 22,
    category: "combo",
  },
];

export default foodDatabase;

/**
 * Search foods by keyword
 */
export function searchFoods(query) {
  const q = query.toLowerCase();
  return foodDatabase.filter((f) => f.name.toLowerCase().includes(q));
}

/**
 * Get calorie-dense options for weight gain
 */
export function getHighCalorieFoods() {
  return foodDatabase
    .filter((f) => f.calories >= 300)
    .sort((a, b) => b.calories - a.calories);
}

/**
 * Get foods by category
 */
export function getFoodsByCategory(category) {
  return foodDatabase.filter((f) => f.category === category);
}
