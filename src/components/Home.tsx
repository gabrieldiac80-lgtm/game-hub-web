import { useState } from 'react';
import type { GameType } from '@/types/game-types';
import { useProfile } from '@/contexts/ProfileContext';

interface HomeProps {
  onSelectGame: (gameId: GameType) => void;
  onProfileClick: () => void;
}

export default function Home({ onSelectGame, onProfileClick }: HomeProps) {
  const { currentProfile } = useProfile();
  const [showStats, setShowStats] = useState(false);

  const games: Array<{ id: GameType; name: string; description: string; icon: string; color: string }> = [
    {
      id: 'tictactoe',
      name: 'Tic-Tac-Toe',
      description: 'Beat the AI with strategy',
      icon: '⭕',
      color: 'from-blue-600 to-purple-600',
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Solve the number puzzle',
      icon: '🔢',
      color: 'from-green-600 to-cyan-600',
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Master the royal game',
      icon: '♔',
      color: 'from-amber-600 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 pt-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Game Hub</h1>
              <p className="text-white text-opacity-80">Play offline, anytime</p>
            </div>
            <button
              onClick={onProfileClick}
              className="text-4xl hover:scale-110 transition"
            >
              {currentProfile?.avatar || '👤'}
            </button>
          </div>

          {currentProfile && (
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4 border border-white border-opacity-20">
              <p className="text-white font-bold">Welcome, {currentProfile.username}! 👋</p>
            </div>
          )}
        </div>
      </div>

      {/* Game Cards */}
      <div className="px-4 py-8 max-w-2xl mx-auto space-y-4">
        {games.map((game) => {
          const gameStats = currentProfile?.stats[game.id] || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 };
          return (
            <div
              key={game.id}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition shadow-xl"
            >
              {/* Card Header with Icon */}
              <div className={`bg-gradient-to-r ${game.color} px-6 py-6 flex items-center gap-4`}>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-full p-4 text-white text-3xl">
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{game.name}</h2>
                  <p className="text-sm text-white text-opacity-80 mt-1">{game.description}</p>
                </div>
              </div>

              {/* Card Stats */}
              <div className="px-6 py-4 flex justify-between border-t border-gray-700 bg-gray-800 bg-opacity-50">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{gameStats.gamesPlayed}</p>
                  <p className="text-xs text-gray-400">Played</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">{gameStats.wins}</p>
                  <p className="text-xs text-gray-400">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-400">{gameStats.losses}</p>
                  <p className="text-xs text-gray-400">Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">{gameStats.draws}</p>
                  <p className="text-xs text-gray-400">Draws</p>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => onSelectGame(game.id)}
                className={`w-full bg-gradient-to-r ${game.color} text-white font-bold text-center text-base py-4 hover:opacity-90 transition`}
              >
                Play Now →
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition"
        >
          {showStats ? 'Hide Stats' : 'View Overall Stats'}
        </button>

        {showStats && currentProfile && (
          <div className="mt-6 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4">Your Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Games</p>
                <p className="text-2xl font-bold text-white">
                  {currentProfile.stats.tictactoe.gamesPlayed +
                    currentProfile.stats.sudoku.gamesPlayed +
                    currentProfile.stats.chess.gamesPlayed}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Wins</p>
                <p className="text-2xl font-bold text-green-400">
                  {currentProfile.stats.tictactoe.wins +
                    currentProfile.stats.sudoku.wins +
                    currentProfile.stats.chess.wins}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {currentProfile.stats.tictactoe.gamesPlayed +
                    currentProfile.stats.sudoku.gamesPlayed +
                    currentProfile.stats.chess.gamesPlayed > 0
                    ? Math.round(
                        ((currentProfile.stats.tictactoe.wins +
                          currentProfile.stats.sudoku.wins +
                          currentProfile.stats.chess.wins) /
                          (currentProfile.stats.tictactoe.gamesPlayed +
                            currentProfile.stats.sudoku.gamesPlayed +
                            currentProfile.stats.chess.gamesPlayed)) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Best Sudoku Time</p>
                <p className="text-2xl font-bold text-purple-400">
                  {currentProfile.stats.sudoku.bestTime
                    ? `${Math.floor(currentProfile.stats.sudoku.bestTime / 60)}:${(currentProfile.stats.sudoku.bestTime % 60)
                        .toString()
                        .padStart(2, '0')}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center border-t border-gray-700">
        <p className="text-gray-400">
          🎮 All games work offline. No internet required!
        </p>
      </div>
    </div>
  );
}
