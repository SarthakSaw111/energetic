// Level definitions with XP thresholds
const levels = [
  { level: 1, title: "Couch Potato", xpRequired: 0, cumulative: 0, icon: "🛋️" },
  { level: 2, title: "Beginner", xpRequired: 100, cumulative: 100, icon: "🌱" },
  {
    level: 3,
    title: "Getting Moving",
    xpRequired: 250,
    cumulative: 350,
    icon: "🚶",
  },
  {
    level: 4,
    title: "Showing Up",
    xpRequired: 450,
    cumulative: 800,
    icon: "👟",
  },
  {
    level: 5,
    title: "Consistent",
    xpRequired: 700,
    cumulative: 1500,
    icon: "📅",
  },
  {
    level: 6,
    title: "Building Momentum",
    xpRequired: 1000,
    cumulative: 2500,
    icon: "🏃",
  },
  {
    level: 7,
    title: "Dedicated",
    xpRequired: 1500,
    cumulative: 4000,
    icon: "💪",
  },
  { level: 8, title: "Rising", xpRequired: 2000, cumulative: 6000, icon: "⬆️" },
  {
    level: 9,
    title: "Strong-Willed",
    xpRequired: 2500,
    cumulative: 8500,
    icon: "🧠",
  },
  {
    level: 10,
    title: "Fighter",
    xpRequired: 3000,
    cumulative: 11500,
    icon: "🥊",
  },
  {
    level: 12,
    title: "Warrior",
    xpRequired: 4000,
    cumulative: 19500,
    icon: "⚔️",
  },
  {
    level: 15,
    title: "Disciplined",
    xpRequired: 5000,
    cumulative: 34500,
    icon: "🎯",
  },
  {
    level: 18,
    title: "Powerful",
    xpRequired: 6000,
    cumulative: 52500,
    icon: "⚡",
  },
  {
    level: 20,
    title: "Unstoppable",
    xpRequired: 7000,
    cumulative: 66500,
    icon: "🚀",
  },
  {
    level: 25,
    title: "Beast",
    xpRequired: 10000,
    cumulative: 116500,
    icon: "🦁",
  },
  {
    level: 30,
    title: "Legendary",
    xpRequired: 15000,
    cumulative: 191500,
    icon: "👑",
  },
];

export default levels;

/**
 * Get level info for a given total XP
 */
export function getLevelForXP(totalXP) {
  let currentLevel = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].cumulative) {
      currentLevel = levels[i];
      break;
    }
  }

  // Find next level
  const currentIndex = levels.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = levels[currentIndex + 1] || null;

  const xpInCurrentLevel = totalXP - currentLevel.cumulative;
  const xpToNextLevel = nextLevel
    ? nextLevel.cumulative - currentLevel.cumulative
    : 0;
  const progress = nextLevel ? (xpInCurrentLevel / xpToNextLevel) * 100 : 100;

  return {
    ...currentLevel,
    totalXP,
    xpInCurrentLevel,
    xpToNextLevel,
    xpNeeded: nextLevel ? xpToNextLevel - xpInCurrentLevel : 0,
    progress: Math.min(progress, 100),
    nextLevel,
  };
}
