import {
  format,
  parseISO,
  isToday,
  isYesterday,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subDays,
} from "date-fns";

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getToday() {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

/**
 * Format date short
 */
export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), "MMM d");
}

/**
 * Get day of journey (from start date)
 */
export function getJourneyDay(startDate) {
  return differenceInDays(new Date(), parseISO(startDate)) + 1;
}

/**
 * Get all days in a month as an array
 */
export function getMonthDays(year, month) {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}

/**
 * Get the day of the week (0 = Sun, 6 = Sat) for the first day of month
 */
export function getMonthStartDay(year, month) {
  return startOfMonth(new Date(year, month)).getDay();
}

/**
 * Check if date is same as today
 */
export function isDateToday(dateStr) {
  return isToday(parseISO(dateStr));
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateStr) {
  return parseISO(dateStr) > new Date();
}

/**
 * Get last N days as array of date strings
 */
export function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return days;
}

/**
 * Get current time as HH:MM
 */
export function getCurrentTime() {
  return format(new Date(), "HH:mm");
}

/**
 * Get greeting based on time of day
 */
export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Hey night owl";
}
