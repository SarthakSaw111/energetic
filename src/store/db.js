/**
 * Database operations layer — Supabase-backed
 * Same logical API as the old localStorage storage.js
 * All functions are async (Supabase calls are async)
 */
import { supabase, getCurrentUserId, getPublicUrl } from "../services/supabase";

// ============ HELPERS ============

async function uid() {
  const id = await getCurrentUserId();
  if (!id) throw new Error("Not authenticated");
  return id;
}

// ============ USER PROFILE ============

export async function getUserProfile() {
  const userId = await uid();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("getUserProfile:", error);
    return null;
  }
  if (!data) return null;
  return dbToProfile(data);
}

export async function saveUserProfile(profile) {
  const userId = await uid();
  const row = profileToDb(profile, userId);
  const { error } = await supabase
    .from("user_profiles")
    .upsert(row, { onConflict: "user_id" });
  if (error) console.error("saveUserProfile:", error);
  return !error;
}

// Convert DB row → app profile object (camelCase)
function dbToProfile(row) {
  return {
    name: row.name,
    height: Number(row.height),
    startWeight: Number(row.start_weight),
    age: row.age,
    gender: row.gender,
    goalWeight: Number(row.goal_weight),
    equipment: row.equipment || [],
    wakeTime: row.wake_time,
    sleepTime: row.sleep_time,
    mealTimes: row.meal_times || [],
    apiKey: row.api_key,
    coachType: row.coach_type,
    dailyCalorieTarget: row.daily_calorie_target,
    proteinTarget: row.protein_target,
    currentPhase: row.current_phase,
    createdAt: row.created_at ? row.created_at.split("T")[0] : null,
  };
}

// Convert app profile → DB row (snake_case)
function profileToDb(profile, userId) {
  return {
    user_id: userId,
    name: profile.name,
    height: profile.height,
    start_weight: profile.startWeight,
    age: profile.age,
    gender: profile.gender,
    goal_weight: profile.goalWeight,
    equipment: profile.equipment || [],
    wake_time: profile.wakeTime,
    sleep_time: profile.sleepTime,
    meal_times: profile.mealTimes || [],
    api_key: profile.apiKey,
    coach_type: profile.coachType,
    daily_calorie_target: profile.dailyCalorieTarget,
    protein_target: profile.proteinTarget,
    current_phase: profile.currentPhase || 1,
  };
}

// ============ DAILY LOGS ============

export async function getDailyLogs() {
  const userId = await uid();
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) {
    console.error("getDailyLogs:", error);
    return {};
  }
  const logs = {};
  for (const row of data || []) {
    logs[row.date] = dbToLog(row);
  }
  return logs;
}

export async function getDailyLog(date) {
  const userId = await uid();
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();
  if (error) {
    console.error("getDailyLog:", error);
    return null;
  }
  if (!data) return null;
  return dbToLog(data);
}

export async function saveDailyLog(date, updates) {
  const userId = await uid();

  // First get existing log to merge
  const existing = await getDailyLog(date);
  const merged = { ...(existing || {}), ...updates };
  const row = logToDb(merged, userId, date);

  const { error } = await supabase
    .from("daily_logs")
    .upsert(row, { onConflict: "user_id,date" });
  if (error) console.error("saveDailyLog:", error);
  return !error;
}

function dbToLog(row) {
  return {
    checkedIn: row.checked_in,
    checkedInAt: row.checked_in_at,
    mood: row.mood,
    weight: row.weight != null ? Number(row.weight) : null,
    workoutDone: row.workout_done,
    workoutCompletedAt: row.workout_completed_at,
    workoutDuration: row.workout_duration,
    workout: row.workout,
    meals: row.meals || [],
    calorieXPAwarded: row.calorie_xp_awarded,
    allMealsXPAwarded: row.all_meals_xp_awarded,
    weightXPAwarded: row.weight_xp_awarded,
  };
}

function logToDb(log, userId, date) {
  return {
    user_id: userId,
    date: date,
    checked_in: log.checkedIn ?? false,
    checked_in_at: log.checkedInAt || null,
    mood: log.mood || null,
    weight: log.weight || null,
    workout_done: log.workoutDone ?? false,
    workout_completed_at: log.workoutCompletedAt || null,
    workout_duration: log.workoutDuration || null,
    workout: log.workout || null,
    meals: log.meals || [],
    calorie_xp_awarded: log.calorieXPAwarded ?? false,
    all_meals_xp_awarded: log.allMealsXPAwarded ?? false,
    weight_xp_awarded: log.weightXPAwarded ?? false,
  };
}

// ============ STREAK DATA ============

export async function getStreakData() {
  const userId = await uid();
  const { data, error } = await supabase
    .from("streak_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
      skipDaysUsedThisMonth: 0,
    };
  }
  return {
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    totalDaysActive: data.total_days_active,
    skipDaysUsedThisMonth: data.skip_days_used_this_month,
  };
}

export async function saveStreakData(streak) {
  const userId = await uid();
  const { error } = await supabase.from("streak_data").upsert(
    {
      user_id: userId,
      current_streak: streak.currentStreak || 0,
      longest_streak: streak.longestStreak || 0,
      total_days_active: streak.totalDaysActive || 0,
      skip_days_used_this_month: streak.skipDaysUsedThisMonth || 0,
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("saveStreakData:", error);
  return !error;
}

// ============ XP DATA ============

export async function getXPData() {
  const userId = await uid();
  const { data, error } = await supabase
    .from("xp_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return { totalXP: 0, achievements: [] };
  return { totalXP: data.total_xp, achievements: data.achievements || [] };
}

export async function saveXPData(xp) {
  const userId = await uid();
  const { error } = await supabase.from("xp_data").upsert(
    {
      user_id: userId,
      total_xp: xp.totalXP || 0,
      achievements: xp.achievements || [],
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("saveXPData:", error);
  return !error;
}

// ============ GALLERY (photos metadata) ============

export async function getGallery() {
  const userId = await uid();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: true });
  if (error) {
    console.error("getGallery:", error);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id,
    filePath: row.file_path,
    fileUrl: row.file_url,
    date: row.date,
    journeyDay: row.journey_day,
    aiComment: row.ai_comment,
    tags: row.tags || [],
    uploadedAt: row.uploaded_at,
  }));
}

export async function saveGalleryPhoto(photo) {
  const userId = await uid();
  const { data, error } = await supabase
    .from("gallery")
    .insert({
      user_id: userId,
      file_path: photo.filePath,
      file_url: photo.fileUrl,
      date: photo.date,
      journey_day: photo.journeyDay,
      ai_comment: photo.aiComment,
      tags: photo.tags || [],
    })
    .select()
    .single();
  if (error) {
    console.error("saveGalleryPhoto:", error);
    return null;
  }
  return data;
}

export async function deleteGalleryPhoto(photoId) {
  const { error } = await supabase.from("gallery").delete().eq("id", photoId);
  if (error) console.error("deleteGalleryPhoto:", error);
  return !error;
}

// ============ PHOTO STORAGE (actual file upload) ============

export async function uploadProgressPhoto(file, userId) {
  const ext = file.type === "image/png" ? "png" : "jpg";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("progress-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });
  if (error) {
    console.error("uploadProgressPhoto:", error);
    return null;
  }

  const publicUrl = getPublicUrl("progress-photos", data.path);
  return { path: data.path, url: publicUrl };
}

export async function uploadProgressPhotoBase64(base64Data, userId) {
  // Convert base64 to Blob
  const parts = base64Data.split(",");
  const mime = parts[0]?.match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(parts[1] || parts[0]);
  const arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) arr[i] = bstr.charCodeAt(i);
  const blob = new Blob([arr], { type: mime });

  const ext = mime.includes("png") ? "png" : "jpg";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("progress-photos")
    .upload(fileName, blob, { contentType: mime, upsert: false });
  if (error) {
    console.error("uploadPhotoBase64:", error);
    return null;
  }

  const publicUrl = getPublicUrl("progress-photos", data.path);
  return { path: data.path, url: publicUrl };
}

export async function deleteStoragePhoto(filePath) {
  const { error } = await supabase.storage
    .from("progress-photos")
    .remove([filePath]);
  if (error) console.error("deleteStoragePhoto:", error);
  return !error;
}

// ============ CONVERSATIONS ============

export async function getConversations(limit = 50) {
  const userId = await uid();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("getConversations:", error);
    return [];
  }
  return (data || []).map((row) => ({
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  }));
}

export async function saveConversationMessage(role, content) {
  const userId = await uid();
  const { error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, role, content });
  if (error) console.error("saveConversationMessage:", error);
  return !error;
}

// ============ DATA EXPORT / CLEAR ============

export async function exportAllData() {
  const [profile, logs, streak, xp, gallery, conversations] = await Promise.all(
    [
      getUserProfile(),
      getDailyLogs(),
      getStreakData(),
      getXPData(),
      getGallery(),
      getConversations(100),
    ],
  );
  return { profile, dailyLogs: logs, streak, xp, gallery, conversations };
}

export async function clearAllData() {
  const userId = await uid();
  await Promise.all([
    supabase.from("user_profiles").delete().eq("user_id", userId),
    supabase.from("daily_logs").delete().eq("user_id", userId),
    supabase.from("streak_data").delete().eq("user_id", userId),
    supabase.from("xp_data").delete().eq("user_id", userId),
    supabase.from("gallery").delete().eq("user_id", userId),
    supabase.from("conversations").delete().eq("user_id", userId),
  ]);
  // Also delete storage photos
  const { data: files } = await supabase.storage
    .from("progress-photos")
    .list(userId);
  if (files?.length) {
    await supabase.storage
      .from("progress-photos")
      .remove(files.map((f) => `${userId}/${f.name}`));
  }
}
