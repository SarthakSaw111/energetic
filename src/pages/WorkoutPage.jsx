import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Play,
  Pause,
  SkipForward,
  Check,
  Clock,
  Flame,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Zap,
  Camera,
} from "lucide-react";
import { useApp } from "../App";
import { generateWorkout, getEmergencyWorkout } from "../services/aiCoach";
import {
  getDailyLog,
  saveDailyLog,
  getStreakData,
  saveStreakData,
} from "../store/db";
import { getToday } from "../utils/dateUtils";
import { XP_REWARDS, MOODS } from "../utils/constants";

const REST_SOUND_MS = 100; // placeholder for vibration

function RestTimer({ seconds, onComplete }) {
  const [remaining, setRemaining] = useState(seconds);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || remaining <= 0) {
      if (remaining <= 0) onComplete();
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, paused]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-6 text-center"
    >
      <p className="text-sm text-gray-400 mb-2">Rest Time</p>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{remaining}s</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setPaused(!paused)}
          className="btn-secondary text-sm px-4 py-2"
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button
          onClick={onComplete}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-1"
        >
          <SkipForward size={16} /> Skip
        </button>
      </div>
    </motion.div>
  );
}

function ExerciseCard({
  exercise,
  exerciseIndex,
  onSetComplete,
  completedSets,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold">
          {exerciseIndex + 1}
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-white">{exercise.name}</p>
          <p className="text-xs text-gray-500">
            {exercise.muscle} • {exercise.sets} sets × {exercise.reps} reps
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {completedSets}/{exercise.sets}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            {exercise.tips && (
              <p className="text-xs text-gray-500 mb-3 italic">
                💡 {exercise.tips}
              </p>
            )}

            {exercise.weight > 0 && (
              <p className="text-xs text-brand-orange mb-3">
                Weight: {exercise.weight} kg
              </p>
            )}

            <div className="flex gap-2">
              {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                const done = setIdx < completedSets;
                return (
                  <button
                    key={setIdx}
                    onClick={() =>
                      !done && onSetComplete(exerciseIndex, setIdx)
                    }
                    disabled={done || setIdx > completedSets}
                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                      done
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : setIdx === completedSets
                          ? "bg-brand-orange text-white animate-pulse"
                          : "bg-dark-600 text-gray-500"
                    }`}
                  >
                    {done ? (
                      <Check size={16} className="mx-auto" />
                    ) : (
                      `Set ${setIdx + 1}`
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkoutPage() {
  const { profile, today, journeyDay, phase, xpData, updateXP, refresh } =
    useApp();

  const [state, setState] = useState("loading"); // loading | ready | active | rest | complete | emergency
  const [workout, setWorkout] = useState(null);
  const [completedSets, setCompletedSets] = useState([]); // array indexed by exercise
  const [currentExercise, setCurrentExercise] = useState(0);
  const [restDuration, setRestDuration] = useState(60);
  const [startTime, setStartTime] = useState(null);
  const [aiComment, setAiComment] = useState("");
  const [error, setError] = useState(null);

  // Load existing workout or generate new one
  useEffect(() => {
    loadWorkout();
  }, []);

  async function loadWorkout() {
    setState("loading");
    const todayLog = await getDailyLog(today);

    // Already completed today
    if (todayLog?.workoutDone && todayLog?.workout) {
      setWorkout(todayLog.workout);
      setCompletedSets(todayLog.workout.exercises.map((e) => e.sets));
      setAiComment(
        todayLog.workout.completionComment || "Great work today! 💪",
      );
      setState("complete");
      return;
    }

    // Cache check — reuse today's generated workout
    if (todayLog?.workout && !todayLog.workoutDone) {
      setWorkout(todayLog.workout);
      setCompletedSets(todayLog.workout.exercises.map(() => 0));
      setState("ready");
      return;
    }

    try {
      const todayMood = todayLog?.mood || 3;
      const result = await generateWorkout(profile, {
        mood: todayMood,
        journeyDay,
        phase,
        availableTime: 20,
      });

      const workoutData = result.data;
      const w = workoutData.workout || workoutData;

      // Normalize exercises
      const exercises = (w.exercises || []).map((ex) => ({
        name: ex.name || "Exercise",
        muscle: ex.muscle || "full body",
        sets: Math.max(1, ex.sets || 2),
        reps: ex.reps || 10,
        weight: ex.weight || 0,
        restSeconds: ex.restSeconds || 60,
        tips: ex.tips || "",
      }));

      const normalizedWorkout = {
        name: w.name || `Day ${journeyDay} Workout`,
        duration: w.duration || 15,
        exercises,
        greeting: workoutData.greeting || "",
        source: result.source,
      };

      setWorkout(normalizedWorkout);
      setCompletedSets(exercises.map(() => 0));
      setAiComment(workoutData.greeting || workoutData.aiComment || "");

      // Cache the workout
      await saveDailyLog(today, { workout: normalizedWorkout });
      setState("ready");
    } catch (err) {
      setError("Failed to generate workout");
      setState("ready");
    }
  }

  const handleStart = () => {
    setState("active");
    setStartTime(Date.now());
  };

  const handleSetComplete = useCallback(
    (exIdx, setIdx) => {
      setCompletedSets((prev) => {
        const next = [...prev];
        next[exIdx] = setIdx + 1;
        return next;
      });

      // Check if this was the last set of this exercise
      const exercise = workout.exercises[exIdx];
      if (setIdx + 1 >= exercise.sets) {
        // Move to next exercise or check if all done
        if (exIdx + 1 < workout.exercises.length) {
          setCurrentExercise(exIdx + 1);
        }
        // Rest between exercises
        setRestDuration(exercise.restSeconds || 60);
        setState("rest");
      } else {
        // Rest between sets (shorter)
        setRestDuration(Math.max(30, (exercise.restSeconds || 60) - 15));
        setState("rest");
      }
    },
    [workout],
  );

  const handleRestComplete = () => {
    // Check if all exercises done
    if (
      workout &&
      completedSets.every((s, i) => s >= workout.exercises[i].sets)
    ) {
      finishWorkout();
    } else {
      setState("active");
    }
  };

  const finishWorkout = async () => {
    const elapsed = startTime
      ? Math.round((Date.now() - startTime) / 60000)
      : 0;

    const completionData = {
      workoutDone: true,
      workoutCompletedAt: new Date().toISOString(),
      workoutDuration: elapsed,
      workout: {
        ...workout,
        completionComment:
          "Workout complete! You showed up and that's what matters. 🔥",
      },
    };

    await saveDailyLog(today, completionData);

    // Award XP
    const newXP = {
      ...xpData,
      totalXP: (xpData.totalXP || 0) + XP_REWARDS.WORKOUT_COMPLETE,
    };
    updateXP(newXP);

    // Update streak
    const streak = await getStreakData();
    streak.currentStreak = (streak.currentStreak || 0) + 1;
    streak.longestStreak = Math.max(
      streak.longestStreak || 0,
      streak.currentStreak,
    );
    streak.totalDaysActive = (streak.totalDaysActive || 0) + 1;
    await saveStreakData(streak);

    setAiComment("Workout complete! You showed up and that's what matters. 🔥");
    setState("complete");
    refresh();
  };

  const handleEmergency = async () => {
    setState("loading");
    try {
      const result = await getEmergencyWorkout(profile, { journeyDay, phase });
      const data = result.data;
      setWorkout({
        name: "Emergency Minimum",
        duration: 1,
        exercises: [
          {
            name: data.minimum?.exercise || "Bodyweight Squats",
            muscle: "full body",
            sets: 1,
            reps: data.minimum?.reps || 10,
            weight: 0,
            restSeconds: 0,
            tips: data.motivation || "Just show up.",
          },
        ],
        greeting: data.empathy,
        source: "emergency",
      });
      setCompletedSets([0]);
      setAiComment(
        data.empathy ||
          "Some days are tough. Just doing the minimum keeps your streak alive.",
      );
      setState("ready");
    } catch {
      setState("ready");
    }
  };

  const totalSets = workout?.exercises?.reduce((s, e) => s + e.sets, 0) || 0;
  const doneSets = completedSets.reduce((s, c) => s + c, 0);
  const progressPct =
    totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* LOADING */}
      {state === "loading" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Dumbbell size={40} className="text-brand-orange" />
          </motion.div>
          <p className="text-gray-400 mt-4">AI is crafting your workout...</p>
        </div>
      )}

      {/* READY STATE */}
      {state === "ready" && workout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {aiComment && (
            <div className="glass-card p-4">
              <p className="text-sm text-gray-300">{aiComment}</p>
            </div>
          )}

          <div className="glass-card p-4">
            <h2 className="text-xl font-bold text-white mb-1">
              {workout.name}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={14} /> ~{workout.duration} min
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell size={14} /> {workout.exercises.length} exercises
              </span>
              <span className="flex items-center gap-1">
                <Flame size={14} /> {totalSets} sets
              </span>
            </div>
            {workout.source && workout.source !== "ai" && (
              <p className="text-xs text-gray-600 mt-2">
                Mode: {workout.source}
              </p>
            )}
          </div>

          {/* Exercise preview */}
          <div className="space-y-2">
            {workout.exercises.map((ex, i) => (
              <div key={i} className="glass-card p-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-dark-600 text-gray-400 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{ex.name}</p>
                  <p className="text-xs text-gray-500">
                    {ex.sets}×{ex.reps}{" "}
                    {ex.weight > 0 ? `@ ${ex.weight}kg` : ""}
                  </p>
                </div>
                <span className="text-xs text-gray-600">{ex.muscle}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="btn-primary flex-1 py-4 text-lg flex items-center justify-center gap-2"
            >
              <Play size={20} /> Start Workout
            </button>
          </div>

          <button
            onClick={handleEmergency}
            className="w-full text-center text-sm text-gray-500 hover:text-brand-orange transition-colors py-2"
          >
            I really can't today... (emergency minimum)
          </button>
        </motion.div>
      )}

      {/* ACTIVE WORKOUT */}
      {state === "active" && workout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Progress bar */}
          <div className="glass-card p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">
                {progressPct}% Complete
              </span>
              <span className="text-xs text-gray-500">
                {doneSets}/{totalSets} sets
              </span>
            </div>
            <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-orange to-green-500 rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Exercise cards */}
          <div className="space-y-3">
            {workout.exercises.map((ex, i) => (
              <ExerciseCard
                key={i}
                exercise={ex}
                exerciseIndex={i}
                completedSets={completedSets[i]}
                onSetComplete={handleSetComplete}
              />
            ))}
          </div>

          {/* Manual finish button */}
          {progressPct > 50 && (
            <button
              onClick={finishWorkout}
              className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Check size={18} /> Finish Workout Early
            </button>
          )}
        </motion.div>
      )}

      {/* REST TIMER */}
      {state === "rest" && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <RestTimer seconds={restDuration} onComplete={handleRestComplete} />
        </div>
      )}

      {/* COMPLETE */}
      {state === "complete" && workout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 text-center pt-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, damping: 8 }}
            className="text-7xl"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Workout Done!</h2>
          <p className="text-gray-400">{aiComment}</p>

          <div className="glass-card p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">XP Earned</span>
              <span className="font-bold text-brand-orange">
                +{XP_REWARDS.WORKOUT_COMPLETE} XP
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Exercises</span>
              <span className="text-white">{workout.exercises.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Sets</span>
              <span className="text-white">{totalSets}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setState("loading");
              loadWorkout();
            }}
            className="btn-ghost w-full flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> View Workout Summary
          </button>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <div className="glass-card p-4 border-red-500/30 border">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
