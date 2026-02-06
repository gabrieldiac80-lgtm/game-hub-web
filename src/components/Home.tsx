import { useState, useEffect } from 'react';
import type { GameStats, GameType } from '@/types/game-types';
import { getAllGameStats } from '@/lib/storage';

interface HomeProps {
  onSelectGame: (gameId: GameType) => void;
}

export default function Home({ onSelectGame }: HomeProps) {
  const [stats, setStats] = useState<Record<GameType, GameStats> | null>(null);

  useEffect(() => {
    const allStats = getAllGameStats();
    setStats(allStats);
  }, []);

  const games: Array<{ id: GameType; name: string; description: string; icon: string }> = [
    {
      id: 'tictactoe',
      name: 'Tic-Tac-Toe',
      description: 'Classic 3x3 game. Beat the AI!',
      icon: '⭕',
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Solve the 9x9 puzzle',
      icon: '🔢',
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Strategic masterpiece',
      icon: '♔',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pt-8 pb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Game Hub</h1>
        <p className="text-white text-opacity-80">Play offline, anytime</p>
      </div>

      {/* Game Cards */}
      <div className="px-4 py-8 max-w-2xl mx-auto space-y-4">
        {games.map((game) => {
          const gameStats = stats?.[game.id] || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 };
          return (
            <div
              key={game.id}
              className="bg-surface rounded-2xl overflow-hidden border border-border"
            >
              {/* Card Header with Icon */}
              <div className="bg-primary bg-opacity-10 px-6 py-6 flex items-center gap-4">
                <div className="bg-primary rounded-full p-4 text-white text-3xl">
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{game.name}</h2>
                  <p className="text-sm text-muted mt-1">{game.description}</p>
                </div>
              </div>

              {/* Card Stats */}
              <div className="px-6 py-4 flex justify-between border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{gameStats.gamesPlayed}</p>
                  <p className="text-xs text-muted">Played</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{gameStats.wins}</p>
                  <p className="text-xs text-muted">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-error">{gameStats.losses}</p>
                  <p className="text-xs text-muted">Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">{gameStats.draws}</p>
                  <p className="text-xs text-muted">Draws</p>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => onSelectGame(game.id)}
                className="w-full bg-primary text-white font-bold text-center text-base py-3 mx-6 mb-6 mt-4 rounded-xl hover:opacity-90 transition"
              >
                Play Now
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center border-t border-border">
        <p className="text-sm text-muted">
          All games work offline. No internet required!
        </p>
      </div>
    </div>
  );
}
