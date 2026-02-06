export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  createdAt: number;
  stats: {
    tictactoe: GameStat;
    sudoku: GameStat;
    chess: GameStat;
  };
}

export interface GameStat {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  bestTime?: number;
  rating?: number;
}

export interface ProfileContextType {
  currentProfile: UserProfile | null;
  profiles: UserProfile[];
  createProfile: (username: string, avatar: string) => void;
  switchProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  updateStats: (gameType: 'tictactoe' | 'sudoku' | 'chess', result: 'win' | 'loss' | 'draw', time?: number) => void;
}
