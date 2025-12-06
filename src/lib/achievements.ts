import { SecureStorage } from './utils/secureStorage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isHidden?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: '初勝利', description: '初の勝利を果たす', icon: '🥇' },
  { id: 'win_streak_3', title: '連勝3回', description: '3回連続で勝利を果たす', icon: '🔥' },
  { id: 'win_streak_5', title: '連勝5回', description: '5回連続で勝利を果たす', icon: '🚀' },
  { id: 'perfect_game', title: 'パーフェクト', description: '盤面に自分のブロックを全て置く', icon: '💎' },
  { id: 'veteran', title: 'ベテラン', description: '10回プレイ', icon: '🛡️' },
  // Hidden Achievements
  { id: 'hidden_high_scorer', title: 'ハイスコアラー', description: '125点以上で勝利', icon: '🏆', isHidden: true },
  { id: 'hidden_connect_master', title: 'The ConnectCorners Master', description: '対戦を100回行う', icon: '👑', isHidden: true },
  { id: 'hidden_perfect_master', title: 'Perfect Master', description: 'パーフェクトを50回達成', icon: '🌟', isHidden: true },
  { id: 'complete_all', title: 'コンプリート', description: 'すべてのアチーブメントを解放する', icon: '⚜️', isHidden: true },
];

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  currentWinStreak: number;
  maxWinStreak: number;
  perfectGames: number;
  unlockedAchievements: string[];
}

const initialStats: PlayerStats = {
  gamesPlayed: 0,
  wins: 0,
  currentWinStreak: 0,
  maxWinStreak: 0,
  perfectGames: 0,
  unlockedAchievements: [],
};

const STORAGE_KEY = 'connect_corners_stats';

export const getStats = (): PlayerStats => {
  const stored = SecureStorage.getItem<Partial<PlayerStats>>(STORAGE_KEY, initialStats);
  return { ...initialStats, ...stored };
};

export const saveStats = (stats: PlayerStats) => {
  SecureStorage.setItem(STORAGE_KEY, stats);
};

export interface GameResult {
  isWin: boolean;
  isPerfect: boolean;
  isMultiplayer: boolean;
  score: number;
}

export const updateStats = (result: GameResult): { newStats: PlayerStats, newAchievements: Achievement[], unlockedStoryChapter2: boolean } => {
  const currentStats = getStats();
  const newStats = { ...currentStats };

  // Update basic stats
  newStats.gamesPlayed += 1;

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

  // Base Achievements
  check('first_win', newStats.wins >= 1);
  check('win_streak_3', newStats.currentWinStreak >= 3);
  check('win_streak_5', newStats.currentWinStreak >= 5);
  check('perfect_game', newStats.perfectGames >= 1);
  check('veteran', newStats.gamesPlayed >= 10);

  // Check if all base achievements are unlocked
  const baseAchievementIds = ACHIEVEMENTS.filter(a => !a.isHidden).map(a => a.id);
  const wasAllBaseUnlocked = baseAchievementIds.every(id => currentStats.unlockedAchievements.includes(id));
  const allBaseUnlocked = baseAchievementIds.every(id => newStats.unlockedAchievements.includes(id));

  const unlockedStoryChapter2 = !wasAllBaseUnlocked && allBaseUnlocked;

  // Hidden Achievements (Only check if base achievements are complete)
  if (allBaseUnlocked) {
    check('hidden_high_scorer', result.isWin && result.score >= 125);
    check('hidden_connect_master', newStats.gamesPlayed >= 100);
    check('hidden_perfect_master', newStats.perfectGames >= 50);
  }

  // Check for Complete All
  const allOtherAchievementIds = ACHIEVEMENTS.filter(a => a.id !== 'complete_all').map(a => a.id);
  const allOthersUnlocked = allOtherAchievementIds.every(id => newStats.unlockedAchievements.includes(id));
  check('complete_all', allOthersUnlocked);

  saveStats(newStats);

  return { newStats, newAchievements, unlockedStoryChapter2 };
};
