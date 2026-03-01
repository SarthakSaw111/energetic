import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Clock,
  Key,
  User,
} from "lucide-react";
import {
  calculateCalorieTarget,
  calculateProteinTarget,
  calculateBMI,
} from "../utils/calculations";
import { getToday } from "../utils/dateUtils";
import { saveUserProfile } from "../store/db";
import { initGemini } from "../services/gemini";

const STEPS = [
  "welcome",
  "stats",
  "goal",
  "equipment",
  "schedule",
  "apikey",
  "personality",
  "ready",
];

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    height: 173,
    startWeight: 49,
    age: 22,
    gender: "male",
    goalWeight: 65,
    equipment: ["dumbbells", "bench"],
    wakeTime: "08:00",
    sleepTime: "00:00",
    mealTimes: ["09:00", "13:00", "17:00", "21:00"],
    apiKey: "",
    coachType: "bro",
  });

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    const calTarget = calculateCalorieTarget(
      form.startWeight,
      form.height,
      form.age,
      form.gender,
    );
    const protTarget = calculateProteinTarget(
      form.startWeight,
      form.goalWeight,
    );

    const profile = {
      ...form,
      dailyCalorieTarget: calTarget,
      proteinTarget: protTarget,
      createdAt: getToday(),
      currentPhase: 1,
    };

    await saveUserProfile(profile);
    if (form.apiKey) {
      initGemini(form.apiKey);
    }
    onComplete(profile);
  };

  const slideVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-dark-700">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-orange to-brand-purple"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* STEP: WELCOME */}
            {step === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-7xl mb-6"
                >
                  🔥
                </motion.div>
                <h1 className="text-3xl font-bold mb-3">
                  Welcome to{" "}
                  <span className="text-brand-orange">Energetic</span>
                </h1>
                <p className="text-gray-400 mb-2 text-lg">
                  Your AI-Powered Transformation Coach
                </p>
                <p className="text-gray-500 text-sm max-w-sm">
                  I'm going to help you build the body you want. Not with
                  willpower — with a system that makes it impossible to fail.
                </p>
                <p className="text-gray-600 text-xs mt-6">
                  Powered by Google Gemini AI
                </p>
              </div>
            )}

            {/* STEP: STATS */}
            {step === 1 && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-brand-orange" size={24} />
                  <h2 className="text-2xl font-bold">Your Stats</h2>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  Let me know your current numbers so I can calculate everything
                  for you.
                </p>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="What should I call you?"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.height}
                        onChange={(e) => update("height", +e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.startWeight}
                        onChange={(e) => update("startWeight", +e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Age
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.age}
                        onChange={(e) => update("age", +e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Gender
                      </label>
                      <select
                        className="input-field"
                        value={form.gender}
                        onChange={(e) => update("gender", e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Live calculation */}
                  <div className="glass-card p-4 mt-4">
                    <p className="text-xs text-gray-500 mb-2">Current BMI</p>
                    <p className="text-xl font-bold text-brand-orange">
                      {calculateBMI(form.startWeight, form.height)}
                    </p>
                    <p className="text-xs text-yellow-500 mt-1">
                      {calculateBMI(form.startWeight, form.height) < 18.5
                        ? "Underweight — let's fix this together!"
                        : "Healthy range"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP: GOAL */}
            {step === 2 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Set Your Goal</h2>
                <p className="text-gray-400 mb-6 text-sm">
                  A realistic first target. We can always adjust later.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Goal Weight (kg)
                    </label>
                    <input
                      type="number"
                      className="input-field text-2xl text-center font-bold"
                      value={form.goalWeight}
                      onChange={(e) => update("goalWeight", +e.target.value)}
                    />
                  </div>

                  {/* Preset goals */}
                  <div className="flex gap-2">
                    {[55, 60, 65, 70].map((w) => (
                      <button
                        key={w}
                        onClick={() => update("goalWeight", w)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          form.goalWeight === w
                            ? "bg-brand-orange text-white"
                            : "bg-dark-600 text-gray-400 hover:bg-dark-500"
                        }`}
                      >
                        {w} kg
                      </button>
                    ))}
                  </div>

                  <div className="glass-card p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Weight to gain</span>
                      <span className="font-semibold text-brand-orange">
                        +{form.goalWeight - form.startWeight} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Estimated time</span>
                      <span className="font-semibold text-white">
                        ~{Math.ceil((form.goalWeight - form.startWeight) / 2)}{" "}
                        months
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Daily calorie target
                      </span>
                      <span className="font-semibold text-green-400">
                        {calculateCalorieTarget(
                          form.startWeight,
                          form.height,
                          form.age,
                          form.gender,
                        )}{" "}
                        cal
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Daily protein target
                      </span>
                      <span className="font-semibold text-blue-400">
                        {calculateProteinTarget(
                          form.startWeight,
                          form.goalWeight,
                        )}
                        g
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP: EQUIPMENT */}
            {step === 3 && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Dumbbell className="text-brand-orange" size={24} />
                  <h2 className="text-2xl font-bold">Equipment</h2>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  What do you have available? (You can change this later)
                </p>

                <div className="space-y-3">
                  {[
                    { id: "dumbbells", label: "Dumbbells", emoji: "🏋️" },
                    { id: "bench", label: "Flat/Incline Bench", emoji: "🪑" },
                    { id: "pullup_bar", label: "Pull-up Bar", emoji: "🔩" },
                    {
                      id: "resistance_bands",
                      label: "Resistance Bands",
                      emoji: "🎗️",
                    },
                    {
                      id: "none",
                      label: "Nothing — bodyweight only",
                      emoji: "🤸",
                    },
                  ].map((eq) => {
                    const isSelected = form.equipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        onClick={() => {
                          if (eq.id === "none") {
                            update("equipment", []);
                          } else {
                            update(
                              "equipment",
                              isSelected
                                ? form.equipment.filter((e) => e !== eq.id)
                                : [
                                    ...form.equipment.filter(
                                      (e) => e !== "none",
                                    ),
                                    eq.id,
                                  ],
                            );
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          isSelected
                            ? "border-brand-orange bg-brand-orange/10"
                            : "border-dark-500/30 bg-dark-700/50 hover:border-dark-400"
                        }`}
                      >
                        <span className="text-2xl">{eq.emoji}</span>
                        <span
                          className={`font-medium ${isSelected ? "text-white" : "text-gray-400"}`}
                        >
                          {eq.label}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-brand-orange text-lg">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP: SCHEDULE */}
            {step === 4 && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-brand-orange" size={24} />
                  <h2 className="text-2xl font-bold">Your Schedule</h2>
                </div>
                <p className="text-gray-400 mb-6 text-sm">
                  So I can plan meals and workouts around your day.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Wake up
                      </label>
                      <input
                        type="time"
                        className="input-field"
                        value={form.wakeTime}
                        onChange={(e) => update("wakeTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">
                        Sleep
                      </label>
                      <input
                        type="time"
                        className="input-field"
                        value={form.sleepTime}
                        onChange={(e) => update("sleepTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Preferred meal times
                    </label>
                    <div className="space-y-2">
                      {["Breakfast", "Lunch", "Snack", "Dinner"].map(
                        (meal, i) => (
                          <div key={meal} className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 w-20">
                              {meal}
                            </span>
                            <input
                              type="time"
                              className="input-field flex-1"
                              value={form.mealTimes[i]}
                              onChange={(e) => {
                                const newTimes = [...form.mealTimes];
                                newTimes[i] = e.target.value;
                                update("mealTimes", newTimes);
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP: API KEY */}
            {step === 5 && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="text-brand-orange" size={24} />
                  <h2 className="text-2xl font-bold">AI Brain Setup</h2>
                </div>
                <p className="text-gray-400 mb-4 text-sm">
                  Enter your free Google Gemini API key to enable the AI coach.
                </p>

                <div className="glass-card p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-2">
                    How to get a free key:
                  </p>
                  <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                    <li>
                      Go to{" "}
                      <span className="text-brand-orange">
                        aistudio.google.com/apikey
                      </span>
                    </li>
                    <li>Sign in with Google</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy and paste it below</li>
                  </ol>
                </div>

                <input
                  type="password"
                  className="input-field mb-3"
                  placeholder="Paste your Gemini API key here..."
                  value={form.apiKey}
                  onChange={(e) => update("apiKey", e.target.value)}
                />

                {form.apiKey && (
                  <p className="text-xs text-green-400">
                    ✓ API key entered — AI features will be enabled!
                  </p>
                )}
                {!form.apiKey && (
                  <p className="text-xs text-gray-500">
                    You can skip this and add it later. The app works without AI
                    too (just less smart).
                  </p>
                )}
              </div>
            )}

            {/* STEP: PERSONALITY */}
            {step === 6 && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">Choose Your Coach</h2>
                <p className="text-gray-400 mb-6 text-sm">
                  How should your AI coach talk to you?
                </p>

                <div className="space-y-3">
                  {[
                    {
                      id: "bro",
                      emoji: "🤙",
                      name: "Bro Coach",
                      desc: "Casual, encouraging, like your gym buddy",
                    },
                    {
                      id: "drill",
                      emoji: "🎖️",
                      name: "Drill Sergeant",
                      desc: "Strict, no excuses, tough love",
                    },
                    {
                      id: "science",
                      emoji: "🧪",
                      name: "Science Nerd",
                      desc: "Data-driven, explains the why",
                    },
                    {
                      id: "chill",
                      emoji: "😌",
                      name: "Chill Friend",
                      desc: "Relaxed, zero pressure, gentle",
                    },
                  ].map((coach) => (
                    <button
                      key={coach.id}
                      onClick={() => update("coachType", coach.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        form.coachType === coach.id
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-dark-500/30 bg-dark-700/50 hover:border-dark-400"
                      }`}
                    >
                      <span className="text-3xl">{coach.emoji}</span>
                      <div>
                        <p
                          className={`font-semibold ${form.coachType === coach.id ? "text-white" : "text-gray-300"}`}
                        >
                          {coach.name}
                        </p>
                        <p className="text-xs text-gray-500">{coach.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP: READY */}
            {step === 7 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="text-7xl mb-6"
                >
                  💪
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">
                  You're All Set, {form.name || "Champion"}!
                </h2>
                <p className="text-gray-400 mb-6">
                  Day 1 starts now. Your first workout is going to be
                  <span className="text-brand-orange font-semibold">
                    {" "}
                    ridiculously easy
                  </span>{" "}
                  — and that's by design.
                </p>

                <div className="glass-card p-4 w-full text-left space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Daily Calories</span>
                    <span className="font-semibold text-green-400">
                      {calculateCalorieTarget(
                        form.startWeight,
                        form.height,
                        form.age,
                        form.gender,
                      )}{" "}
                      cal
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Daily Protein</span>
                    <span className="font-semibold text-blue-400">
                      {calculateProteinTarget(
                        form.startWeight,
                        form.goalWeight,
                      )}
                      g
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Phase</span>
                    <span className="font-semibold text-brand-orange">
                      1 — The Seed
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Coach</span>
                    <span className="font-semibold text-brand-purple-light">
                      {form.coachType === "bro"
                        ? "🤙 Bro Coach"
                        : form.coachType === "drill"
                          ? "🎖️ Drill Sergeant"
                          : form.coachType === "science"
                            ? "🧪 Science Nerd"
                            : "😌 Chill Friend"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={finish}
                  className="btn-primary w-full text-lg py-4"
                >
                  Let's Begin 🔥
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 7 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={prev}
                className="btn-secondary flex items-center gap-1"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="btn-primary flex-1 flex items-center justify-center gap-1"
              disabled={step === 1 && !form.name}
            >
              {step === 0 ? "Let's Go" : "Continue"}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
