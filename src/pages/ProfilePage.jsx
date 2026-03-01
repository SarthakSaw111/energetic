import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Trash2,
  Download,
  ChevronRight,
  Dumbbell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RefreshCw,
  Shield,
  LogOut,
} from "lucide-react";
import { useApp } from "../App";
import {
  exportAllData,
  clearAllData,
  getUserProfile,
  saveUserProfile,
} from "../store/db";
import { signOut } from "../services/supabase";
import { initGemini, isGeminiReady } from "../services/gemini";
import {
  calculateBMI,
  calculateCalorieTarget,
  calculateProteinTarget,
  getBMICategory,
} from "../utils/calculations";

export default function ProfilePage() {
  const { profile, updateProfile, xpData, levelInfo, journeyDay, refresh } =
    useApp();

  const [apiKey, setApiKey] = useState(profile?.apiKey || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    height: profile?.height || 173,
    startWeight: profile?.startWeight || 49,
    age: profile?.age || 22,
    gender: profile?.gender || "male",
    goalWeight: profile?.goalWeight || 65,
    coachType: profile?.coachType || "bro",
  });

  const bmi = calculateBMI(form.startWeight, form.height);
  const bmiCat = getBMICategory(bmi);

  function handleSaveProfile() {
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

    const updated = {
      ...profile,
      ...form,
      dailyCalorieTarget: calTarget,
      proteinTarget: protTarget,
    };
    updateProfile(updated);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSaveApiKey() {
    const updated = { ...profile, apiKey };
    updateProfile(updated);
    if (apiKey) {
      initGemini(apiKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `energetic-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleClearAll() {
    await clearAllData();
    window.location.reload();
  }

  async function handleLogout() {
    await signOut();
    window.location.reload();
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-purple mx-auto flex items-center justify-center mb-3">
          <span className="text-3xl">{levelInfo?.icon || "🔥"}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          {profile?.name || "Champion"}
        </h2>
        <p className="text-sm text-gray-400">
          Level {levelInfo?.level || 1} — {levelInfo?.title || "Beginner"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Day {journeyDay} • {xpData?.totalXP || 0} XP
        </p>
      </motion.div>

      {/* Stats section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Your Stats</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-xs text-brand-orange hover:underline"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Name</label>
              <input
                type="text"
                className="input-field text-sm"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={form.height}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, height: +e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={form.startWeight}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startWeight: +e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Age</label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={form.age}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, age: +e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Goal Weight (kg)
                </label>
                <input
                  type="number"
                  className="input-field text-sm"
                  value={form.goalWeight}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, goalWeight: +e.target.value }))
                  }
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              className="btn-primary w-full text-sm"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <StatRow label="Height" value={`${profile?.height} cm`} />
            <StatRow label="Weight" value={`${profile?.startWeight} kg`} />
            <StatRow label="BMI" value={`${bmi}`} valueClass={bmiCat.color} />
            <StatRow label="Goal" value={`${profile?.goalWeight} kg`} />
            <StatRow
              label="Daily Calories"
              value={`${profile?.dailyCalorieTarget} cal`}
              valueClass="text-green-400"
            />
            <StatRow
              label="Daily Protein"
              value={`${profile?.proteinTarget}g`}
              valueClass="text-blue-400"
            />
          </div>
        )}
      </motion.div>

      {/* Coach personality */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-3">Coach Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "bro", emoji: "🤙", name: "Bro Coach" },
            { id: "drill", emoji: "🎖️", name: "Drill Sergeant" },
            { id: "science", emoji: "🧪", name: "Science Nerd" },
            { id: "chill", emoji: "😌", name: "Chill Friend" },
          ].map((coach) => (
            <button
              key={coach.id}
              onClick={() => {
                const updated = { ...profile, coachType: coach.id };
                updateProfile(updated);
              }}
              className={`p-3 rounded-xl text-center transition-all ${
                profile?.coachType === coach.id
                  ? "bg-brand-orange/20 border border-brand-orange/50"
                  : "bg-dark-700/50 border border-transparent hover:border-dark-500"
              }`}
            >
              <span className="text-2xl">{coach.emoji}</span>
              <p
                className={`text-xs mt-1 ${profile?.coachType === coach.id ? "text-white" : "text-gray-400"}`}
              >
                {coach.name}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* API Key management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Key size={16} className="text-brand-orange" />
          <h3 className="text-sm font-semibold text-white">Gemini API Key</h3>
          <span
            className={`ml-auto text-xs ${isGeminiReady() ? "text-green-400" : "text-red-400"}`}
          >
            {isGeminiReady() ? "● Connected" : "● Not connected"}
          </span>
        </div>
        <input
          type={showApiKey ? "text" : "password"}
          className="input-field text-sm mb-2"
          placeholder="Enter your Gemini API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="btn-ghost text-xs"
          >
            {showApiKey ? "Hide" : "Show"}
          </button>
          <button
            onClick={handleSaveApiKey}
            className="btn-primary text-xs flex-1"
          >
            Save & Connect
          </button>
        </div>
      </motion.div>

      {/* Equipment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Dumbbell size={16} className="text-brand-orange" /> Equipment
        </h3>
        <div className="flex flex-wrap gap-2">
          {(profile?.equipment || []).map((eq) => (
            <span
              key={eq}
              className="px-3 py-1 bg-dark-600 rounded-full text-xs text-gray-300 capitalize"
            >
              {eq.replace("_", " ")}
            </span>
          ))}
          {(!profile?.equipment || profile.equipment.length === 0) && (
            <span className="text-xs text-gray-500">Bodyweight only</span>
          )}
        </div>
      </motion.div>

      {/* Data management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <button
          onClick={handleExport}
          className="w-full glass-card p-4 flex items-center gap-3 hover:border-blue-500/30 transition-colors"
        >
          <Download size={20} className="text-blue-400" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Export All Data</p>
            <p className="text-xs text-gray-500">Download as JSON backup</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>

        <button
          onClick={() => setConfirmClear(true)}
          className="w-full glass-card p-4 flex items-center gap-3 hover:border-red-500/30 transition-colors"
        >
          <Trash2 size={20} className="text-red-400" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Clear All Data</p>
            <p className="text-xs text-gray-500">
              Reset everything and start fresh
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </motion.div>

      {/* Confirm clear modal */}
      {confirmClear && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
        >
          <div className="glass-card p-6 max-w-sm w-full text-center">
            <Trash2 className="mx-auto text-red-400 mb-3" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">
              Clear All Data?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              This will permanently delete all your workout logs, meal data,
              progress photos, and settings. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved feedback */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-50"
        >
          ✓ Saved!
        </motion.div>
      )}

      {/* App version */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="w-full glass-card p-4 flex items-center gap-3 hover:border-yellow-500/30 transition-colors"
        >
          <LogOut size={20} className="text-yellow-400" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Log Out</p>
            <p className="text-xs text-gray-500">Sign out of your account</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
      <p className="text-center text-xs text-gray-600 py-4">
        Energetic v2.0.0 • Synced with Supabase 🔥
      </p>
    </div>
  );
}

function StatRow({ label, value, valueClass = "text-white" }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
