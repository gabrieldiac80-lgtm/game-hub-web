import { useState, useEffect } from 'react';
import type { TicTacToeGameState } from '@/types/game-types';
import {
  createInitialGameState,
  updateGameState,
  getAIMove,
} from '@/lib/tictactoe-logic';
import { updateGameStats } from '@/lib/storage';

interface TicTacToeProps {
  onBack: () => void;
}

export default function TicTacToe({ onBack }: TicTacToeProps) {
  const [gameState, setGameState] = useState<TicTacToeGameState>(createInitialGameState());
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.gameOver) {
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
  }, [gameState.currentPlayer, gameState.gameOver]);

  const handleGameOver = async (state: TicTacToeGameState) => {
    if (state.winner === 'X') {
      setResultMessage('🎉 You Won!');
      updateGameStats('tictactoe', 'win');
    } else if (state.winner === 'O') {
      setResultMessage('AI Won!');
      updateGameStats('tictactoe', 'loss');
    } else if (state.isDraw) {
      setResultMessage("It's a Draw!");
      updateGameStats('tictactoe', 'draw');
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Tic-Tac-Toe</h1>
            <p className="text-muted mt-1">
              {gameState.gameOver
                ? 'Game Over'
                : gameState.currentPlayer === 'X'
                ? 'Your Turn (X)'
                : "AI's Turn (O)"}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-2xl hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-surface rounded-2xl p-4 mb-8 border border-border">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const cell = gameState.board[index];
              return (
                <button
                  key={index}
                  onClick={() => handleCellPress(index)}
                  disabled={gameState.gameOver || cell !== null || gameState.currentPlayer !== 'X'}
                  className="aspect-square bg-background border-2 border-primary rounded-lg text-4xl font-bold text-primary hover:opacity-70 disabled:opacity-50 transition"
                >
                  {cell === 'X' ? '✕' : cell === 'O' ? '○' : ''}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNewGame}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold mb-3 hover:opacity-90 transition"
        >
          New Game
        </button>

        <button
          onClick={onBack}
          className="w-full bg-surface text-foreground py-3 rounded-lg font-bold border border-border hover:opacity-70 transition"
        >
          Back to Home
        </button>
      </div>

      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-sm border border-border">
            <p className="text-4xl text-center mb-4">{resultMessage.split(' ')[0]}</p>
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              {resultMessage}
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleNewGame}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="w-full bg-surface text-foreground py-3 rounded-lg font-bold border border-border hover:opacity-70 transition"
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
