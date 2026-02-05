// League system configuration
export const LEAGUES = [
  { id: 0, name: 'Başlangıç', minXP: 0, maxXP: 999, icon: '🎓', color: 'gray' },
  { id: 1, name: '1. Lig (Çaylak)', minXP: 1000, maxXP: 1999, icon: '🥉', color: 'amber' },
  { id: 2, name: '2. Lig (Amatör)', minXP: 2000, maxXP: 3999, icon: '🥈', color: 'slate' },
  { id: 3, name: '3. Lig (Profesyonel)', minXP: 4000, maxXP: 5999, icon: '🥇', color: 'yellow' },
  { id: 4, name: '4. Lig (Uzman)', minXP: 6000, maxXP: 9999, icon: '💎', color: 'blue' },
  { id: 5, name: '5. Lig (Efsane)', minXP: 10000, maxXP: Infinity, icon: '👑', color: 'purple' },
];

export function calculateLeague(xp: number): typeof LEAGUES[number] {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].minXP) {
      return LEAGUES[i];
    }
  }
  return LEAGUES[0];
}

export function getLeagueProgress(xp: number): number {
  const league = calculateLeague(xp);
  if (league.maxXP === Infinity) return 100;

  const range = league.maxXP - league.minXP + 1;
  const current = xp - league.minXP;
  return Math.min((current / range) * 100, 100);
}

export function getNextLeague(currentXP: number): { league: typeof LEAGUES[number]; xpNeeded: number } | null {
  const currentLeague = calculateLeague(currentXP);
  const nextLeagueId = currentLeague.id + 1;

  if (nextLeagueId >= LEAGUES.length) return null;

  const nextLeague = LEAGUES[nextLeagueId];
  return {
    league: nextLeague,
    xpNeeded: nextLeague.minXP - currentXP
  };
}
