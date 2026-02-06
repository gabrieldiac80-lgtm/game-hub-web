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
      color: 'from-blue-600 via-purple-600 to-blue-700',
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Solve the number puzzle',
      icon: '🔢',
      color: 'from-green-600 via-cyan-600 to-green-700',
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Master the royal game',
      icon: '♔',
      color: 'from-amber-600 via-orange-600 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-red-600 px-6 pt-8 pb-12 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">🎮 Game Hub</h1>
              <p className="text-white text-opacity-90 text-lg">Play offline, anytime</p>
            </div>
            <button
              onClick={onProfileClick}
              className="text-4xl hover:scale-110 transition transform"
            >
              {currentProfile?.avatar || '👤'}
            </button>
          </div>

          {currentProfile && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-opacity-20 backdrop-blur rounded-lg p-4 border-2 border-yellow-400 border-opacity-50">
              <p className="text-white font-bold text-lg">🎮 Welcome, {currentProfile.username}! 👋</p>
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
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-600 hover:border-yellow-400 transition shadow-2xl hover:shadow-yellow-500/50"
            >
              {/* Card Header with Icon */}
              <div className={`bg-gradient-to-r ${game.color} px-6 py-6 flex items-center gap-4`}>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-full p-4 text-white text-3xl border-2 border-white border-opacity-30">
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{game.name}</h2>
                  <p className="text-sm text-white text-opacity-90 mt-1">{game.description}</p>
                </div>
              </div>

              {/* Card Stats */}
              <div className="px-6 py-4 flex justify-between border-t-2 border-gray-600 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-400">{gameStats.gamesPlayed}</p>
                  <p className="text-xs text-cyan-300">Played</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-400">{gameStats.wins}</p>
                  <p className="text-xs text-green-300">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-400">{gameStats.losses}</p>
                  <p className="text-xs text-red-300">Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">{gameStats.draws}</p>
                  <p className="text-xs text-yellow-300">Draws</p>
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
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
        >
          {showStats ? '📊 Hide Stats' : '📊 View Overall Stats'}
        </button>

        {showStats && currentProfile && (
          <div className="mt-6 bg-gradient-to-br from-gray-800 via-purple-900 to-gray-900 rounded-2xl p-6 border-2 border-purple-500 shadow-lg shadow-purple-500/30">
            <h3 className="text-white font-bold text-lg mb-4">⭐ Your Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-700 to-cyan-900 rounded-lg p-4 border border-cyan-500">
                <p className="text-cyan-300 text-sm font-bold">🎮 Total Games</p>
                <p className="text-3xl font-bold text-cyan-200">
                  {currentProfile.stats.tictactoe.gamesPlayed +
                    currentProfile.stats.sudoku.gamesPlayed +
                    currentProfile.stats.chess.gamesPlayed}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg p-4 border border-green-500">
                <p className="text-green-300 text-sm font-bold">🏆 Total Wins</p>
                <p className="text-3xl font-bold text-green-200">
                  {currentProfile.stats.tictactoe.wins +
                    currentProfile.stats.sudoku.wins +
                    currentProfile.stats.chess.wins}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-4 border border-blue-500">
                <p className="text-blue-300 text-sm font-bold">📊 Win Rate</p>
                <p className="text-3xl font-bold text-blue-200">
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
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-lg p-4 border border-purple-500">
                <p className="text-purple-300 text-sm font-bold">⏱️ Best Sudoku Time</p>
                <p className="text-3xl font-bold text-purple-200">
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
      <div className="px-6 py-8 text-center border-t-2 border-purple-500 bg-gradient-to-r from-blue-600 to-pink-600 bg-opacity-10">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-bold text-lg">
          🎮 All games work offline. No internet required! ✨
        </p>
      </div>
    </div>
  );
}
