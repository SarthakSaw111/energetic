// Fallback motivational quotes
const quotes = [
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
  },
  {
    text: "The difference between who you are and who you want to be is what you do.",
    author: "Unknown",
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
  },
  {
    text: "Success isn't always about greatness. It's about consistency.",
    author: "Dwayne Johnson",
  },
  {
    text: "The hard days are the best because that's when champions are made.",
    author: "Gabby Douglas",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
  },
  {
    text: "A year from now you'll wish you had started today.",
    author: "Karen Lamb",
  },
  { text: "You are one workout away from a good mood.", author: "Unknown" },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "Nobody who ever gave their best regretted it.",
    author: "George Halas",
  },
  {
    text: "Motivation gets you started. Habit keeps you going.",
    author: "Jim Ryun",
  },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  {
    text: "You don't have to be great to start. You have to start to be great.",
    author: "Zig Ziglar",
  },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  {
    text: "Push yourself because no one else is going to do it for you.",
    author: "Unknown",
  },
  {
    text: "Skinny today, beast tomorrow. But only if you start now.",
    author: "Energetic",
  },
  { text: "Eat big, lift big, get big. It's that simple.", author: "Unknown" },
  {
    text: "Your genetics loaded the gun. Your habits pull the trigger.",
    author: "Mehmet Oz",
  },
  {
    text: "1% better every day = 37x better in a year.",
    author: "James Clear",
  },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius",
  },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  {
    text: "Rome wasn't built in a day, but they were laying bricks every hour.",
    author: "John Heywood",
  },
  {
    text: "You're already ahead of everyone who didn't start.",
    author: "Energetic",
  },
];

export default quotes;

/**
 * Get quote of the day (deterministic based on date)
 */
export function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24),
  );
  return quotes[dayOfYear % quotes.length];
}
