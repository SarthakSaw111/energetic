import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  MessageCircle,
  Camera,
  Zap,
  Target,
  Award,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  CloudMoon,
} from "lucide-react";
import { useApp } from "../App";
import { getDailyLog, saveDailyLog, getStreakData } from "../store/db";
import { getTimeGreeting, getToday } from "../utils/dateUtils";
import { getDailyQuote } from "../data/quotes";
import { MOODS, XP_REWARDS } from "../utils/constants";
import { chatWithCoach } from "../services/aiCoach";

export default function DashboardPage() {
  const {
    profile,
    today,
    journeyDay,
    phase,
    levelInfo,
    xpData,
    updateXP,
    refresh,
  } = useApp();
  const navigate = useNavigate();

  const [todayLog, setTodayLog] = useState(null);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
  const [aiGreeting, setAiGreeting] = useState("");
  const [loadingGreeting, setLoadingGreeting] = useState(true);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  const quote = useMemo(() => getDailyQuote(), []);
  const greeting = getTimeGreeting();

  // Load today's log and streak
  useEffect(() => {
    async function loadData() {
      const log = (await getDailyLog(today)) || {};
      setTodayLog(log);
      setStreak(await getStreakData());

      // Check-in XP if first visit today
      if (!log.checkedIn) {
        await saveDailyLog(today, {
          checkedIn: true,
          checkedInAt: new Date().toISOString(),
        });
        // Give check-in XP
        const newXP = {
          ...xpData,
          totalXP: (xpData.totalXP || 0) + XP_REWARDS.DAILY_CHECKIN,
        };
        updateXP(newXP);
      }

      // Generate AI greeting
      generateGreeting(log);
    }
    loadData();
  }, [today]);

  async function generateGreeting(log) {
    setLoadingGreeting(true);
    try {
      const contextMsg = `Give me a very short (2-3 sentence) motivational greeting for Day ${journeyDay} of my fitness journey. ${
        log?.workoutDone
          ? "I already worked out today!"
          : "I haven't worked out yet today."
      } My mood today is ${log?.mood || "unknown"}. Keep it personal and energetic. Don't use emojis excessively.`;

      const result = await chatWithCoach(
        profile,
        { mood: log?.mood, journeyDay, phase },
        [{ role: "user", content: contextMsg }],
      );
      setAiGreeting(result.message);
    } catch {
      setAiGreeting(
        `Day ${journeyDay} of becoming unstoppable. Let's make it count! 💪`,
      );
    }
    setLoadingGreeting(false);
  }

  // Calculate today's stats
  const todayStats = useMemo(() => {
    if (!todayLog)
      return { calories: 0, protein: 0, workoutDone: false, mealsLogged: 0 };
    const meals = todayLog.meals || [];
    const calories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const protein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
    return {
      calories,
      protein,
      workoutDone: !!todayLog.workoutDone,
      mealsLogged: meals.length,
    };
  }, [todayLog]);

  const calPercent = profile.dailyCalorieTarget
    ? Math.min(
        100,
        Math.round((todayStats.calories / profile.dailyCalorieTarget) * 100),
      )
    : 0;
  const protPercent = profile.proteinTarget
    ? Math.min(
        100,
        Math.round((todayStats.protein / profile.proteinTarget) * 100),
      )
    : 0;

  const handleMoodSelect = async (mood) => {
    await saveDailyLog(today, { mood: mood.value });
    setTodayLog((prev) => ({ ...prev, mood: mood.value }));
    setShowMoodPicker(false);
  };

  const greetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 6) return <Moon size={20} className="text-purple-400" />;
    if (hour < 12) return <Sunrise size={20} className="text-yellow-400" />;
    if (hour < 18) return <Sun size={20} className="text-orange-400" />;
    return <CloudMoon size={20} className="text-blue-400" />;
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Greeting section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          {greetingIcon()}
          <h1 className="text-lg font-semibold text-white">
            {greeting}, {profile.name || "Champion"}!
          </h1>
        </div>

        {loadingGreeting ? (
          <div className="h-12 skeleton rounded-lg" />
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">{aiGreeting}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Flame size={14} className="text-brand-orange" />
            Day {journeyDay}
          </span>
          <span>
            Phase {phase}: {["", "Seed", "Sprout", "Growth", "Tree"][phase]}
          </span>
          {streak.currentStreak > 0 && (
            <span className="text-brand-orange font-semibold">
              🔥 {streak.currentStreak} day streak
            </span>
          )}
        </div>
      </motion.div>

      {/* Mood check (if not set) */}
      {!todayLog?.mood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <p className="text-sm text-gray-400 mb-3">
            How are you feeling right now?
          </p>
          <div className="flex justify-between">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-dark-600 transition-colors"
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-gray-500">{mood.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Today's Mission Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Today's Mission
        </h2>

        {/* Workout Card */}
        <button
          onClick={() => navigate("/workout")}
          className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-brand-orange/30 transition-colors"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              todayStats.workoutDone
                ? "bg-green-500/20 text-green-400"
                : "bg-brand-orange/20 text-brand-orange"
            }`}
          >
            {todayStats.workoutDone ? (
              <Award size={24} />
            ) : (
              <Dumbbell size={24} />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">
              {todayStats.workoutDone
                ? "Workout Complete! ✓"
                : "Start Today's Workout"}
            </p>
            <p className="text-xs text-gray-500">
              {todayStats.workoutDone
                ? `+${XP_REWARDS.WORKOUT_COMPLETE} XP earned`
                : `Phase ${phase} • AI-generated plan ready`}
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </button>

        {/* Meals Card */}
        <button
          onClick={() => navigate("/meals")}
          className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-green-500/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
            <UtensilsCrossed size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Meals</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1">
                <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${calPercent}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                {todayStats.calories}/{profile.dailyCalorieTarget} cal
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </button>

        {/* Progress Photo Card */}
        <button
          onClick={() => navigate("/progress")}
          className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-brand-purple/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-purple/20 text-brand-purple-light flex items-center justify-center">
            <Camera size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Track Progress</p>
            <p className="text-xs text-gray-500">
              Upload photos, view your journey
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </motion.div>

      {/* Quick stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-brand-orange">
            {todayStats.calories}
          </p>
          <p className="text-xs text-gray-500">Calories</p>
          <div className="mt-1 h-1 bg-dark-600 rounded">
            <div
              className="h-full bg-brand-orange rounded"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {todayStats.protein}g
          </p>
          <p className="text-xs text-gray-500">Protein</p>
          <div className="mt-1 h-1 bg-dark-600 rounded">
            <div
              className="h-full bg-blue-400 rounded"
              style={{ width: `${protPercent}%` }}
            />
          </div>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-brand-purple-light">
            {todayStats.mealsLogged}
          </p>
          <p className="text-xs text-gray-500">Meals</p>
          <div className="mt-1 h-1 bg-dark-600 rounded">
            <div
              className="h-full bg-brand-purple rounded"
              style={{
                width: `${Math.min(100, todayStats.mealsLogged * 25)}%`,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4 border-l-2 border-brand-orange/50"
      >
        <p className="text-sm text-gray-300 italic">"{quote.text}"</p>
        <p className="text-xs text-gray-500 mt-1">— {quote.author}</p>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={() => navigate("/workout")}
          className="btn-primary flex items-center justify-center gap-2 py-3"
        >
          <Zap size={18} />
          {todayStats.workoutDone ? "View Workout" : "Start Workout"}
        </button>
        <button
          onClick={() => navigate("/meals")}
          className="btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <UtensilsCrossed size={18} />
          Log Meal
        </button>
      </motion.div>
    </div>
  );
}
