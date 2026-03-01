import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Send,
  Plus,
  Trash2,
  Search,
  Lightbulb,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useApp } from "../App";
import { parseMeal, getMealSuggestions } from "../services/aiCoach";
import { getDailyLog, saveDailyLog } from "../store/db";
import { getToday } from "../utils/dateUtils";
import { MEAL_SLOTS, XP_REWARDS } from "../utils/constants";
import foodDatabase from "../data/foodDatabase";

function CalorieRing({ current, target, size = 140 }) {
  const pct = Math.min(100, (current / target) * 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const remaining = target - current;
  const color =
    pct >= 100
      ? "#22c55e"
      : pct >= 80
        ? "#FF6B35"
        : pct >= 50
          ? "#eab308"
          : "#6C35DE";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e1e2e"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-xs text-gray-500">/ {target} cal</span>
        {remaining > 0 && (
          <span className="text-xs text-gray-400 mt-1">{remaining} left</span>
        )}
      </div>
    </div>
  );
}

function QuickFoodPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return foodDatabase.slice(0, 15);
    const lower = search.toLowerCase();
    return foodDatabase
      .filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          (f.category && f.category.toLowerCase().includes(lower)),
      )
      .slice(0, 20);
  }, [search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white text-sm">Quick Add Food</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="relative mb-3">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          className="input-field pl-9 text-sm"
          placeholder="Search Indian foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1">
        {filtered.map((food, i) => (
          <button
            key={i}
            onClick={() => onSelect(food)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-dark-600 transition-colors text-left"
          >
            <div>
              <p className="text-sm text-white">{food.name}</p>
              <p className="text-xs text-gray-500">
                {food.calories} cal • {food.protein}g protein
              </p>
            </div>
            <Plus size={16} className="text-gray-500" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MealItem({ meal, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg"
    >
      <div className="flex-1">
        <p className="text-sm text-white">
          {meal.name || meal.items?.[0]?.name || "Meal"}
        </p>
        <p className="text-xs text-gray-500">
          {meal.calories || meal.totalCalories || 0} cal •{" "}
          {meal.protein || meal.totalProtein || 0}g protein
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}

export default function MealsPage() {
  const { profile, today, journeyDay, phase, xpData, updateXP, refresh } =
    useApp();

  const [meals, setMeals] = useState([]);
  const [input, setInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const inputRef = useRef(null);

  // Load today's meals
  useEffect(() => {
    async function loadMeals() {
      const log = await getDailyLog(today);
      if (log?.meals) {
        setMeals(log.meals);
      }
    }
    loadMeals();
  }, [today]);

  // Calorie stats
  const stats = useMemo(() => {
    const totalCal = meals.reduce(
      (s, m) => s + (m.calories || m.totalCalories || 0),
      0,
    );
    const totalProtein = meals.reduce(
      (s, m) => s + (m.protein || m.totalProtein || 0),
      0,
    );
    const totalCarbs = meals.reduce(
      (s, m) => s + (m.carbs || m.totalCarbs || 0),
      0,
    );
    const totalFats = meals.reduce(
      (s, m) => s + (m.fats || m.totalFats || 0),
      0,
    );
    return { totalCal, totalProtein, totalCarbs, totalFats };
  }, [meals]);

  const remaining = {
    cal: Math.max(0, (profile.dailyCalorieTarget || 2500) - stats.totalCal),
    protein: Math.max(0, (profile.proteinTarget || 100) - stats.totalProtein),
  };

  // Save meals to daily log
  async function saveMeals(newMeals) {
    setMeals(newMeals);
    await saveDailyLog(today, { meals: newMeals });

    // Check if calorie target hit
    const totalCal = newMeals.reduce(
      (s, m) => s + (m.calories || m.totalCalories || 0),
      0,
    );
    if (totalCal >= (profile.dailyCalorieTarget || 2500) * 0.8) {
      // Award XP for hitting 80%
      const log = await getDailyLog(today);
      if (!log?.calorieXPAwarded) {
        const newXP = {
          ...xpData,
          totalXP: (xpData.totalXP || 0) + XP_REWARDS.CALORIE_TARGET_80,
        };
        updateXP(newXP);
        await saveDailyLog(today, { calorieXPAwarded: true });
      }
    }

    // Check if all 4 meals logged
    if (newMeals.length >= 4) {
      const log = await getDailyLog(today);
      if (!log?.allMealsXPAwarded) {
        const newXP = {
          ...xpData,
          totalXP: (xpData.totalXP || 0) + XP_REWARDS.ALL_MEALS_LOGGED,
        };
        updateXP(newXP);
        await saveDailyLog(today, { allMealsXPAwarded: true });
      }
    }
  }

  // AI meal parsing
  async function handleSubmitMeal() {
    if (!input.trim()) return;
    setParsing(true);
    setParseResult(null);

    try {
      const result = await parseMeal(
        profile,
        { journeyDay, phase, todayCalories: stats.totalCal },
        input.trim(),
      );
      const data = result.data;

      // Normalize the parsed meal
      const mealEntry = {
        name: input.trim(),
        calories: data.totalCalories || 0,
        protein: data.totalProtein || 0,
        carbs: data.totalCarbs || 0,
        fats: data.totalFats || 0,
        items: data.items || [],
        comment: data.comment || "",
        source: result.source,
        time: new Date().toISOString(),
      };

      const newMeals = [...meals, mealEntry];
      saveMeals(newMeals);
      setParseResult({ success: true, data: mealEntry });
      setInput("");
    } catch (err) {
      setParseResult({
        success: false,
        error: "Failed to parse meal. Try again or use quick add.",
      });
    }
    setParsing(false);
  }

  // Quick add from database
  function handleQuickAdd(food) {
    const mealEntry = {
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      items: [food],
      source: "database",
      time: new Date().toISOString(),
    };
    saveMeals([...meals, mealEntry]);
    setShowQuickAdd(false);
  }

  function handleRemoveMeal(index) {
    const newMeals = meals.filter((_, i) => i !== index);
    saveMeals(newMeals);
  }

  // AI suggestions
  async function loadSuggestions() {
    setLoadingSuggestions(true);
    try {
      const hour = new Date().getHours();
      const timeOfDay =
        hour < 11
          ? "morning"
          : hour < 15
            ? "afternoon"
            : hour < 19
              ? "evening"
              : "night";
      const result = await getMealSuggestions(
        profile,
        remaining.cal,
        remaining.protein,
        timeOfDay,
      );
      setSuggestions(result.data);
    } catch {
      setSuggestions({
        suggestions: [],
        tip: "Try high-calorie foods like nuts, banana shakes, and paneer.",
      });
    }
    setLoadingSuggestions(false);
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Calorie Ring + Macros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 flex items-center gap-6"
      >
        <CalorieRing
          current={stats.totalCal}
          target={profile.dailyCalorieTarget || 2500}
        />
        <div className="flex-1 space-y-3">
          <MacroBar
            label="Protein"
            current={stats.totalProtein}
            target={profile.proteinTarget || 100}
            color="bg-blue-400"
            unit="g"
          />
          <MacroBar
            label="Carbs"
            current={stats.totalCarbs}
            target={Math.round(
              ((profile.dailyCalorieTarget || 2500) * 0.5) / 4,
            )}
            color="bg-yellow-400"
            unit="g"
          />
          <MacroBar
            label="Fats"
            current={stats.totalFats}
            target={Math.round(
              ((profile.dailyCalorieTarget || 2500) * 0.25) / 9,
            )}
            color="bg-pink-400"
            unit="g"
          />
        </div>
      </motion.div>

      {/* Natural language input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <p className="text-sm text-gray-400 mb-2">What did you eat?</p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="input-field flex-1 text-sm"
            placeholder="e.g. 2 roti with dal, a glass of milk..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitMeal()}
            disabled={parsing}
          />
          <button
            onClick={handleSubmitMeal}
            disabled={!input.trim() || parsing}
            className="btn-primary px-4"
          >
            {parsing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Zap size={18} />
              </motion.div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          AI will calculate calories and macros from your description
        </p>

        {/* Parse result feedback */}
        <AnimatePresence>
          {parseResult?.success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-xs text-green-400">
                ✓ Logged: {parseResult.data.calories} cal,{" "}
                {parseResult.data.protein}g protein
                {parseResult.data.comment && (
                  <span className="block text-gray-400 mt-1">
                    {parseResult.data.comment}
                  </span>
                )}
              </p>
            </motion.div>
          )}
          {parseResult?.success === false && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-xs text-red-400">{parseResult.error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Add + Suggestions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="btn-secondary flex-1 flex items-center justify-center gap-1 text-sm"
        >
          <Plus size={16} /> Quick Add
        </button>
        <button
          onClick={loadSuggestions}
          disabled={loadingSuggestions}
          className="btn-ghost flex-1 flex items-center justify-center gap-1 text-sm"
        >
          <Lightbulb size={16} />{" "}
          {loadingSuggestions ? "Thinking..." : "AI Suggest"}
        </button>
      </div>

      <AnimatePresence>
        {showQuickAdd && (
          <QuickFoodPicker
            onSelect={handleQuickAdd}
            onClose={() => setShowQuickAdd(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" /> AI
                Suggestions
              </h3>
              <button
                onClick={() => setSuggestions(null)}
                className="text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            {suggestions.tip && (
              <p className="text-xs text-gray-400 mb-3">{suggestions.tip}</p>
            )}
            <div className="space-y-2">
              {(suggestions.suggestions || []).map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const mealEntry = {
                      name: s.meal || s.name,
                      calories: s.calories || 300,
                      protein: s.protein || 10,
                      carbs: s.carbs || 30,
                      fats: s.fats || 8,
                      source: "suggestion",
                      time: new Date().toISOString(),
                    };
                    saveMeals([...meals, mealEntry]);
                    setSuggestions(null);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-dark-600 text-left"
                >
                  <div>
                    <p className="text-sm text-white">{s.meal || s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.calories} cal • {s.protein}g protein
                    </p>
                  </div>
                  <Plus size={16} className="text-brand-orange" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logged meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Today's Meals ({meals.length})
        </h2>
        <AnimatePresence>
          {meals.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <UtensilsCrossed
                className="mx-auto text-gray-600 mb-2"
                size={32}
              />
              <p className="text-sm text-gray-500">No meals logged yet</p>
              <p className="text-xs text-gray-600">
                Describe what you ate or use Quick Add
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {meals.map((meal, i) => (
                <MealItem
                  key={i}
                  meal={meal}
                  onRemove={() => handleRemoveMeal(i)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Remaining summary */}
      {remaining.cal > 0 && meals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 border-l-2 border-yellow-500/50"
        >
          <p className="text-sm text-gray-300">
            You still need{" "}
            <span className="text-brand-orange font-bold">
              {remaining.cal} cal
            </span>{" "}
            and{" "}
            <span className="text-blue-400 font-bold">
              {remaining.protein}g protein
            </span>{" "}
            to hit your goal today.
          </p>
        </motion.div>
      )}

      {stats.totalCal >= (profile.dailyCalorieTarget || 2500) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4 text-center border border-green-500/30"
        >
          <p className="text-lg">🎯</p>
          <p className="text-sm font-semibold text-green-400">
            Calorie target reached!
          </p>
          <p className="text-xs text-gray-500">
            Great job feeding your body what it needs.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function MacroBar({ label, current, target, color, unit }) {
  const pct =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">
          {current}/{target}
          {unit}
        </span>
      </div>
      <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
