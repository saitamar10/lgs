// Exponential level system - requirement doubles each level
const MAX_LEVEL = 50;
const BASE_XP = 200;

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpToNextLevel: number;
  progress: number; // 0-100
  totalXPForNextLevel: number;
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;
  let xpNeeded = BASE_XP;
  let totalXPSoFar = 0;

  // Find current level
  while (level < MAX_LEVEL && totalXPSoFar + xpNeeded <= totalXP) {
    totalXPSoFar += xpNeeded;
    level++;
    xpNeeded = BASE_XP * Math.pow(2, level - 1); // Exponential: 200, 400, 800, 1600...
  }

  const currentXP = totalXP - totalXPSoFar;
  const progress = (currentXP / xpNeeded) * 100;
  const xpToNextLevel = xpNeeded - currentXP;

  return {
    level,
    currentXP,
    xpForCurrentLevel: xpNeeded,
    xpToNextLevel,
    progress,
    totalXPForNextLevel: totalXPSoFar + xpNeeded
  };
}

// Get XP required for a specific level
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return Infinity;

  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += BASE_XP * Math.pow(2, i - 1);
  }
  return totalXP;
}

// Check if user leveled up
export function checkLevelUp(oldXP: number, newXP: number): { leveledUp: boolean; newLevel: number; oldLevel: number } {
  const oldLevel = calculateLevel(oldXP).level;
  const newLevel = calculateLevel(newXP).level;

  return {
    leveledUp: newLevel > oldLevel,
    newLevel,
    oldLevel
  };
}
