import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Camera,
  Image,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Flame,
  Scale,
  Award,
} from "lucide-react";
import { useApp } from "../App";
import {
  getDailyLogs,
  getGallery,
  saveGalleryPhoto,
  deleteGalleryPhoto,
  saveDailyLog,
  getDailyLog,
  uploadProgressPhotoBase64,
  deleteStoragePhoto,
} from "../store/db";
import { getCurrentUserId } from "../services/supabase";
import {
  getLastNDays,
  formatDateShort,
  getToday,
  getMonthDays,
  getMonthStartDay,
  formatDate,
} from "../utils/dateUtils";
import { XP_REWARDS } from "../utils/constants";
import { analyzeProgressPhoto } from "../services/aiCoach";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const TABS = ["overview", "photos", "calendar"];

function WeightChart({ logs, days }) {
  const data = days
    .map((d) => {
      const log = logs[d];
      return {
        date: formatDateShort(d),
        weight: log?.weight || null,
      };
    })
    .filter((d) => d.weight !== null);

  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-gray-500">
        Log your weight daily to see trends
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#666", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={["dataMin - 1", "dataMax + 1"]}
          tick={{ fill: "#666", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            background: "#1e1e2e",
            border: "1px solid #333",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#999" }}
          itemStyle={{ color: "#FF6B35" }}
        />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#FF6B35"
          fill="url(#weightGrad)"
          strokeWidth={2}
          dot={{ fill: "#FF6B35", r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CalorieChart({ logs, days, target }) {
  const data = days
    .map((d) => {
      const log = logs[d];
      const meals = log?.meals || [];
      const cal = meals.reduce(
        (s, m) => s + (m.calories || m.totalCalories || 0),
        0,
      );
      return { date: formatDateShort(d), calories: cal || null, target };
    })
    .filter((d) => d.calories !== null);

  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-gray-500">
        Log meals to see calorie trends
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#666", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#666", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip
          contentStyle={{
            background: "#1e1e2e",
            border: "1px solid #333",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#999" }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#555"
          strokeDasharray="5 5"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="calories"
          stroke="#22c55e"
          fill="url(#calGrad)"
          strokeWidth={2}
          dot={{ fill: "#22c55e", r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ConsistencyCalendar({ logs }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const days = getMonthDays(year, month);
  const startDay = getMonthStartDay(year, month);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-2 hover:bg-dark-600 rounded">
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-white">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-2 hover:bg-dark-600 rounded">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-xs text-gray-500 py-1">
            {d}
          </span>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`e${i}`} />
        ))}
        {days.map((day) => {
          const log = logs[day];
          const hasWorkout = log?.workoutDone;
          const hasMeals = (log?.meals?.length || 0) > 0;
          const today = day === getToday();

          let bg = "bg-dark-700";
          if (hasWorkout && hasMeals)
            bg = "bg-green-500/30 border-green-500/50";
          else if (hasWorkout) bg = "bg-brand-orange/30 border-brand-orange/50";
          else if (hasMeals) bg = "bg-blue-500/20 border-blue-500/30";

          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-md text-xs ${bg} ${
                today ? "ring-1 ring-brand-orange" : ""
              } border border-transparent`}
            >
              {parseInt(day.split("-")[2])}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/30" /> Both
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-brand-orange/30" /> Workout
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500/20" /> Meals
        </span>
      </div>
    </div>
  );
}

function PhotoGallery({ gallery, onUpload, onDelete }) {
  const fileInputRef = useRef(null);
  const [viewing, setViewing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      await onUpload(base64, file.type);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Progress Gallery ({gallery.length})
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
        >
          {uploading ? (
            "Analyzing..."
          ) : (
            <>
              <Camera size={14} /> Upload
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {gallery.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Image className="mx-auto text-gray-600 mb-3" size={40} />
          <p className="text-sm text-gray-400">No photos yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Upload progress photos to document your journey.
            <br />
            AI will analyze and track your transformation!
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary mt-4 text-sm"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {gallery
            .slice()
            .reverse()
            .map((photo, i) => (
              <motion.div
                key={photo.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setViewing(photo)}
              >
                <img
                  src={photo.fileUrl || photo.base64}
                  alt={`Progress photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div>
                    <p className="text-xs text-white font-medium">
                      Day {photo.journeyDay || "?"}
                    </p>
                    <p className="text-xs text-gray-300">
                      {photo.date ? formatDate(photo.date) : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* Photo viewer modal */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
            onClick={() => setViewing(null)}
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-white font-semibold">
                  Day {viewing.journeyDay || "?"}
                </p>
                <p className="text-xs text-gray-400">
                  {viewing.date ? formatDate(viewing.date) : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(viewing.id);
                    setViewing(null);
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div
              className="flex-1 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={viewing.fileUrl || viewing.base64}
                alt="Progress"
                className="max-w-full max-h-full rounded-xl object-contain"
              />
            </div>
            {viewing.aiComment && (
              <div className="p-4">
                <div className="glass-card p-3">
                  <p className="text-xs text-gray-400 mb-1">AI Analysis</p>
                  <p className="text-sm text-gray-300">{viewing.aiComment}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProgressPage() {
  const { profile, today, journeyDay, xpData, updateXP, refresh } = useApp();
  const [tab, setTab] = useState("overview");
  const [logs, setLogs] = useState({});
  const [gallery, setGallery] = useState([]);
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => {
    async function loadData() {
      const [logsData, galleryData] = await Promise.all([
        getDailyLogs(),
        getGallery(),
      ]);
      setLogs(logsData);
      setGallery(galleryData);
    }
    loadData();
  }, []);

  const last30 = useMemo(() => getLastNDays(30), []);
  const last7 = useMemo(() => getLastNDays(7), []);

  // Stats
  const stats = useMemo(() => {
    let workoutDays = 0;
    let totalCal = 0;
    let calDays = 0;

    for (const d of last7) {
      const log = logs[d];
      if (log?.workoutDone) workoutDays++;
      const dayCalories = (log?.meals || []).reduce(
        (s, m) => s + (m.calories || m.totalCalories || 0),
        0,
      );
      if (dayCalories > 0) {
        totalCal += dayCalories;
        calDays++;
      }
    }

    // Weight trend
    const weights = last30.map((d) => logs[d]?.weight).filter((w) => w != null);

    const latestWeight = weights.length
      ? weights[weights.length - 1]
      : profile.startWeight;
    const weightChange =
      weights.length >= 2
        ? +(weights[weights.length - 1] - weights[0]).toFixed(1)
        : 0;

    return {
      workoutDays,
      avgCalories: calDays > 0 ? Math.round(totalCal / calDays) : 0,
      latestWeight,
      weightChange,
      totalPhotos: gallery.length,
    };
  }, [logs, last7, last30, gallery]);

  // Log today's weight
  async function handleLogWeight() {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 20 || w > 300) return;

    await saveDailyLog(today, { weight: w });
    setLogs((prev) => ({ ...prev, [today]: { ...prev[today], weight: w } }));

    // Award XP
    const log = await getDailyLog(today);
    if (!log?.weightXPAwarded) {
      const newXP = {
        ...xpData,
        totalXP: (xpData.totalXP || 0) + XP_REWARDS.LOG_WEIGHT,
      };
      updateXP(newXP);
      await saveDailyLog(today, { weightXPAwarded: true });
    }
    setWeightInput("");
  }

  // Photo upload handler
  async function handlePhotoUpload(base64, mimeType) {
    // AI analysis
    let aiComment = "Photo saved to your journey!";
    try {
      const result = await analyzeProgressPhoto(
        base64.split(",")[1] || base64,
        "progress",
      );
      if (result.data?.observation) {
        aiComment = result.data.observation;
        if (result.data.encouragement)
          aiComment += " " + result.data.encouragement;
      }
    } catch {}

    // Upload to Supabase Storage
    const userId = await getCurrentUserId();
    const uploaded = await uploadProgressPhotoBase64(base64, userId);

    if (!uploaded) {
      console.error("Photo upload to storage failed");
      return;
    }

    const photoEntry = {
      filePath: uploaded.path,
      fileUrl: uploaded.url,
      date: today,
      journeyDay,
      aiComment,
      tags: [],
    };

    const saved = await saveGalleryPhoto(photoEntry);
    if (saved) {
      setGallery((prev) => [
        ...prev,
        {
          id: saved.id,
          ...photoEntry,
          uploadedAt: saved.uploaded_at,
        },
      ]);
    }

    // Award XP
    const newXP = {
      ...xpData,
      totalXP: (xpData.totalXP || 0) + XP_REWARDS.PHOTO_UPLOAD,
    };
    updateXP(newXP);
  }

  async function handlePhotoDelete(id) {
    const photo = gallery.find((p) => p.id === id);
    if (photo?.filePath) {
      await deleteStoragePhoto(photo.filePath);
    }
    await deleteGalleryPhoto(id);
    setGallery((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-dark-700/50 rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t
                ? "bg-brand-orange text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Weight log */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Scale size={16} className="text-brand-orange" /> Weight
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {stats.latestWeight} kg
                </span>
                {stats.weightChange !== 0 && (
                  <span
                    className={`text-xs font-semibold ${stats.weightChange > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {stats.weightChange > 0 ? "+" : ""}
                    {stats.weightChange} kg
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                step="0.1"
                className="input-field flex-1 text-sm"
                placeholder="Log today's weight..."
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
              />
              <button
                onClick={handleLogWeight}
                className="btn-primary px-4 text-sm"
                disabled={!weightInput}
              >
                Log
              </button>
            </div>

            <WeightChart logs={logs} days={last30} />
          </div>

          {/* Calorie trend */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Flame size={16} className="text-green-400" /> Calories (30 days)
            </h3>
            <CalorieChart
              logs={logs}
              days={last30}
              target={profile.dailyCalorieTarget || 2500}
            />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-brand-orange">
                {stats.workoutDays}/7
              </p>
              <p className="text-xs text-gray-500">Workouts this week</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {stats.avgCalories}
              </p>
              <p className="text-xs text-gray-500">Avg calories/day</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* PHOTOS TAB */}
      {tab === "photos" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PhotoGallery
            gallery={gallery}
            onUpload={handlePhotoUpload}
            onDelete={handlePhotoDelete}
          />
        </motion.div>
      )}

      {/* CALENDAR TAB */}
      {tab === "calendar" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-4">
            <ConsistencyCalendar logs={logs} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
