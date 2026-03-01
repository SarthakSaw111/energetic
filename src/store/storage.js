// localStorage wrapper with JSON serialization
import { STORAGE_KEYS } from "../utils/constants";

/**
 * Get item from localStorage
 */
export function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error writing ${key}:`, err);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Error removing ${key}:`, err);
    return false;
  }
}

/**
 * Get all daily logs
 */
export function getDailyLogs() {
  return getItem(STORAGE_KEYS.DAILY_LOGS) || {};
}

/**
 * Get daily log for specific date
 */
export function getDailyLog(date) {
  const logs = getDailyLogs();
  return logs[date] || null;
}

/**
 * Save daily log for a specific date
 */
export function saveDailyLog(date, data) {
  const logs = getDailyLogs();
  logs[date] = { ...logs[date], ...data };
  return setItem(STORAGE_KEYS.DAILY_LOGS, logs);
}

/**
 * Get user profile
 */
export function getUserProfile() {
  return getItem(STORAGE_KEYS.USER_PROFILE);
}

/**
 * Save user profile
 */
export function saveUserProfile(profile) {
  return setItem(STORAGE_KEYS.USER_PROFILE, profile);
}

/**
 * Get streak data
 */
export function getStreakData() {
  return (
    getItem(STORAGE_KEYS.STREAK_DATA) || {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
      skipDaysUsedThisMonth: 0,
    }
  );
}

/**
 * Save streak data
 */
export function saveStreakData(data) {
  return setItem(STORAGE_KEYS.STREAK_DATA, data);
}

/**
 * Get XP data
 */
export function getXPData() {
  return (
    getItem(STORAGE_KEYS.XP_DATA) || {
      totalXP: 0,
      achievements: [],
    }
  );
}

/**
 * Save XP data
 */
export function saveXPData(data) {
  return setItem(STORAGE_KEYS.XP_DATA, data);
}

/**
 * Get gallery data (photos stored as base64 or references)
 */
export function getGallery() {
  return getItem(STORAGE_KEYS.GALLERY) || [];
}

/**
 * Save gallery data
 */
export function saveGallery(data) {
  return setItem(STORAGE_KEYS.GALLERY, data);
}

/**
 * Get conversations
 */
export function getConversations() {
  return getItem(STORAGE_KEYS.CONVERSATIONS) || [];
}

/**
 * Save conversations
 */
export function saveConversations(data) {
  // Keep last 100 messages to prevent storage bloat
  const trimmed = data.slice(-100);
  return setItem(STORAGE_KEYS.CONVERSATIONS, trimmed);
}

/**
 * Export all data as JSON (for backup)
 */
export function exportAllData() {
  const data = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    data[key] = getItem(key);
  }
  return data;
}

/**
 * Clear all app data
 */
export function clearAllData() {
  for (const key of Object.values(STORAGE_KEYS)) {
    removeItem(key);
  }
}
