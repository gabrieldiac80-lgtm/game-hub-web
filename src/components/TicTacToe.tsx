import { useState, useEffect } from 'react';
import type { TicTacToeGameState } from '@/types/game-types';
import {
  createInitialGameState,
  updateGameState,
  getAIMove,
} from '@/lib/tictactoe-logic';
import { useProfile } from '@/contexts/ProfileContext';

interface TicTacToeProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export default function TicTacToe({ onBack }: TicTacToeProps) {
  const { updateStats } = useProfile();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<TicTacToeGameState>(createInitialGameState());
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.gameOver && difficulty) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameState.board);
        const newState = updateGameState(gameState, aiMove);
        setGameState(newState);

        if (newState.gameOver) {
          handleGameOver(newState);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameOver, difficulty]);

  const handleGameOver = async (state: TicTacToeGameState) => {
    if (state.winner === 'X') {
      setResultMessage('🎉 You Won!');
      updateStats('tictactoe', 'win');
    } else if (state.winner === 'O') {
      setResultMessage('AI Won!');
      updateStats('tictactoe', 'loss');
    } else if (state.isDraw) {
      setResultMessage("It's a Draw!");
      updateStats('tictactoe', 'draw');
    }
    setShowResult(true);
  };

  const handleCellPress = async (index: number) => {
    if (gameState.gameOver || gameState.board[index] !== null || gameState.currentPlayer !== 'X') {
      return;
    }

    const newState = updateGameState(gameState, index);
    setGameState(newState);

    if (newState.gameOver) {
      handleGameOver(newState);
    }
  };

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setShowResult(false);
    setResultMessage('');
  };

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    handleNewGame();
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between items-start mb-8 pt-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Tic-Tac-Toe</h1>
              <p className="text-white text-opacity-80 mt-1">Select Difficulty</p>
            </div>
            <button
              onClick={onBack}
              className="text-2xl text-white hover:opacity-70 transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                className="w-full bg-white text-gray-800 py-4 rounded-xl font-bold hover:shadow-lg transition capitalize text-lg"
              >
                {diff === 'easy' ? '😊 Easy' : diff === 'medium' ? '🤔 Medium' : '🧠 Hard'}
              </button>
            ))}
          </div>

          <button
            onClick={onBack}
            className="w-full bg-white bg-opacity-20 text-white py-4 rounded-xl font-bold border-2 border-white hover:bg-opacity-30 transition mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-start mb-6 pt-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Tic-Tac-Toe</h1>
            <p className="text-white text-opacity-80 mt-1 capitalize">{difficulty}</p>
          </div>
          <button
            onClick={onBack}
            className="text-2xl text-white hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <p className="text-white text-center font-bold text-lg">
            {gameState.gameOver
              ? 'Game Over'
              : gameState.currentPlayer === 'X'
              ? '👤 Your Turn'
              : '🤖 AI Thinking...'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 shadow-2xl">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const cell = gameState.board[index];
              return (
                <button
                  key={index}
                  onClick={() => handleCellPress(index)}
                  disabled={gameState.gameOver || cell !== null || gameState.currentPlayer !== 'X'}
                  className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-purple-300 rounded-lg text-4xl font-bold text-purple-600 hover:shadow-lg disabled:opacity-50 transition"
                >
                  {cell === 'X' ? '✕' : cell === 'O' ? '○' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleNewGame}
            className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:shadow-lg transition"
          >
            New Game
          </button>

          <button
            onClick={() => setDifficulty(null)}
            className="w-full bg-white bg-opacity-20 text-white py-3 rounded-xl font-bold border-2 border-white hover:bg-opacity-30 transition"
          >
            Change Difficulty
          </button>

          <button
            onClick={onBack}
            className="w-full bg-white bg-opacity-20 text-white py-3 rounded-xl font-bold border-2 border-white hover:bg-opacity-30 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <p className="text-5xl text-center mb-4">{resultMessage.split(' ')[0]}</p>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              {resultMessage}
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleNewGame}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
