import type { GameStats, GameType } from '@/types/game-types';

const STATS_KEY_PREFIX = 'game_stats_';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

export function getGameStats(gameType: GameType): GameStats {
  try {
    const key = `${STATS_KEY_PREFIX}${gameType}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { ...defaultStats };
  } catch (error) {
    console.error(`Error reading stats for ${gameType}:`, error);
    return { ...defaultStats };
  }
}

export function updateGameStats(
  gameType: GameType,
  result: 'win' | 'loss' | 'draw'
): GameStats {
  try {
    const key = `${STATS_KEY_PREFIX}${gameType}`;
    const stats = getGameStats(gameType);
    
    stats.gamesPlayed += 1;
    if (result === 'win') stats.wins += 1;
    else if (result === 'loss') stats.losses += 1;
    else if (result === 'draw') stats.draws += 1;
    
    localStorage.setItem(key, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error(`Error updating stats for ${gameType}:`, error);
    return getGameStats(gameType);
  }
}

export function resetGameStats(gameType: GameType): void {
  try {
    const key = `${STATS_KEY_PREFIX}${gameType}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error resetting stats for ${gameType}:`, error);
  }
}

export function getAllGameStats(): Record<GameType, GameStats> {
  try {
    const gameTypes: GameType[] = ['tictactoe', 'sudoku', 'chess'];
    const stats: Record<GameType, GameStats> = {} as Record<GameType, GameStats>;
    
    for (const gameType of gameTypes) {
      stats[gameType] = getGameStats(gameType);
    }
    
    return stats;
  } catch (error) {
    console.error('Error reading all game stats:', error);
    return {
      tictactoe: { ...defaultStats },
      sudoku: { ...defaultStats },
      chess: { ...defaultStats },
    };
  }
}
