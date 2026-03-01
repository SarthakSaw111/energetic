import React, { useState, useEffect, createContext, useContext } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { initGemini } from "./services/gemini";
import { getToday, getJourneyDay } from "./utils/dateUtils";
import { calculateBMI, getCurrentPhase } from "./utils/calculations";
import { getLevelForXP } from "./data/levels";
import { supabase } from "./services/supabase";
import * as db from "./store/db";
import Navbar from "./components/layout/Navbar";
import Header from "./components/layout/Header";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutPage from "./pages/WorkoutPage";
import MealsPage from "./pages/MealsPage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";

// Global app context
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = no session
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xpData, setXpData] = useState({ totalXP: 0, achievements: [] });
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load profile + XP from Supabase when session is ready
  useEffect(() => {
    if (session === undefined) return; // still checking auth
    if (!session) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function loadUserData() {
      try {
        const [userProfile, userXP] = await Promise.all([
          db.getUserProfile(),
          db.getXPData(),
        ]);
        if (userProfile) {
          setProfile(userProfile);
          if (userProfile.apiKey) initGemini(userProfile.apiKey);
        }
        if (userXP) setXpData(userXP);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
      setLoading(false);
    }

    setLoading(true);
    loadUserData();
  }, [session, refreshKey]);

  // Compute derived state
  const appState = React.useMemo(() => {
    if (!profile) return null;
    const today = getToday();
    const journeyDay = profile.createdAt ? getJourneyDay(profile.createdAt) : 1;
    const phase = getCurrentPhase(journeyDay);
    const levelInfo = getLevelForXP(xpData.totalXP);
    const bmi = calculateBMI(profile.startWeight, profile.height);

    return {
      profile,
      today,
      journeyDay,
      phase,
      levelInfo,
      bmi,
      xpData,
    };
  }, [profile, xpData]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const updateProfile = async (newProfile) => {
    setProfile(newProfile);
    await db.saveUserProfile(newProfile);
  };

  const updateXP = async (newXP) => {
    setXpData(newXP);
    await db.saveXPData(newXP);
  };

  // Loading state (auth check or data fetch)
  if (session === undefined || loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce-in">🔥</div>
          <p className="text-gray-400">Loading Energetic...</p>
        </div>
      </div>
    );
  }

  // Not logged in → Auth page
  if (!session) {
    return (
      <AuthPage
        onAuth={(s) => {
          setSession(s);
        }}
      />
    );
  }

  // Logged in but no profile → Onboarding
  if (!profile) {
    return (
      <HashRouter>
        <OnboardingPage
          onComplete={(p) => {
            setProfile(p);
            setRefreshKey((k) => k + 1);
          }}
        />
      </HashRouter>
    );
  }

  const contextValue = {
    profile,
    session,
    today: appState?.today || getToday(),
    journeyDay: appState?.journeyDay || 1,
    phase: appState?.phase || 1,
    levelInfo: appState?.levelInfo || {
      level: 1,
      title: "Beginner",
      icon: "🌱",
      progress: 0,
      xpForNext: 100,
      currentLevelXP: 0,
      totalXP: 0,
    },
    bmi: appState?.bmi || 0,
    xpData,
    refresh,
    updateProfile,
    updateXP,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <div className="min-h-screen bg-dark-900">
          <Header />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Navbar />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}
