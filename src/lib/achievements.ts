
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'First Victory', description: 'Win your first game', icon: '🥇' },
  { id: 'win_streak_3', title: 'On Fire', description: 'Win 3 games in a row', icon: '🔥' },
  { id: 'win_streak_5', title: 'Unstoppable', description: 'Win 5 games in a row', icon: '🚀' },
  { id: 'perfect_game', title: 'Perfectionist', description: 'Place all your pieces on the board', icon: '💎' },
  { id: 'veteran', title: 'Veteran', description: 'Play 10 games', icon: '🛡️' },
  { id: 'master', title: 'Master', description: 'Play 50 games', icon: '👑' },
  { id: 'multiplayer_debut', title: 'Social Butterfly', description: 'Play a multiplayer game', icon: '🌍' },
];

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  currentWinStreak: number;
  maxWinStreak: number;
  perfectGames: number;
  multiplayerGames: number;
  unlockedAchievements: string[];
}

const initialStats: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  currentWinStreak: 0,
  maxWinStreak: 0,
  perfectGames: 0,
  multiplayerGames: 0,
  unlockedAchievements: [],
};

const STORAGE_KEY = 'connect_corners_stats';

export const getStats = (): PlayerStats => {
  if (typeof window === 'undefined') return initialStats;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialStats, ...JSON.parse(stored) } : initialStats;
  } catch (e) {
    console.error('Failed to load stats', e);
    return initialStats;
  }
};

export const saveStats = (stats: PlayerStats) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
};

export interface GameResult {
  isWin: boolean;
  isPerfect: boolean;
  isMultiplayer: boolean;
}

export const updateStats = (result: GameResult): { newStats: PlayerStats, newAchievements: Achievement[] } => {
  const currentStats = getStats();
  const newStats = { ...currentStats };

  // Update basic stats
  newStats.gamesPlayed += 1;
  if (result.isMultiplayer) {
    newStats.multiplayerGames += 1;
  }

  if (result.isWin) {
    newStats.wins += 1;
    newStats.currentWinStreak += 1;
    if (newStats.currentWinStreak > newStats.maxWinStreak) {
      newStats.maxWinStreak = newStats.currentWinStreak;
    }
  } else {
    newStats.currentWinStreak = 0;
  }

  if (result.isPerfect) {
    newStats.perfectGames += 1;
  }

  // Check achievements
  const newAchievements: Achievement[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !newStats.unlockedAchievements.includes(id)) {
      newStats.unlockedAchievements.push(id);
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) newAchievements.push(achievement);
    }
  };

  check('first_win', newStats.wins >= 1);
  check('win_streak_3', newStats.currentWinStreak >= 3);
  check('win_streak_5', newStats.currentWinStreak >= 5);
  check('perfect_game', newStats.perfectGames >= 1);
  check('veteran', newStats.gamesPlayed >= 10);
  check('master', newStats.gamesPlayed >= 50);
  check('multiplayer_debut', newStats.multiplayerGames >= 1);

  saveStats(newStats);

  return { newStats, newAchievements };
};
