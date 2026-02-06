import { useState, useEffect } from 'react';
import type { ChessGameState, ChessDifficulty } from '@/types/game-types';
import {
  createInitialGameState,
  getValidMoves,
  movePiece,
  getAIMove,
} from '@/lib/chess-logic';
// import { useProfile } from '@/contexts/ProfileContext';

interface ChessProps {
  onBack: () => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
  'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔',
};

export default function Chess({ onBack }: ChessProps) {
  // const { updateStats } = useProfile();
  const [difficulty, setDifficulty] = useState<ChessDifficulty | null>(null);
  const [gameState, setGameState] = useState<ChessGameState | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  useEffect(() => {
    if (gameState && gameState.currentPlayer === 'black' && !gameState.gameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(gameState);
        if (aiMove) {
          const [fromRow, fromCol, toRow, toCol] = aiMove;
          const newState = movePiece(gameState, fromRow, fromCol, toRow, toCol);
          setGameState(newState);
          setValidMoves([]);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [gameState?.currentPlayer, gameState?.gameOver]);

  const handleSelectDifficulty = (selectedDifficulty: ChessDifficulty) => {
    setDifficulty(selectedDifficulty);
    const newGameState = createInitialGameState(selectedDifficulty);
    setGameState(newGameState);
  };

  const handleSquarePress = (row: number, col: number) => {
    if (!gameState || gameState.currentPlayer !== 'white') return;

    const piece = gameState.board[row][col].piece;

    if (validMoves.some(([r, c]) => r === row && c === col)) {
      const [fromRow, fromCol] = gameState.selectedSquare || [0, 0];
      const newState = movePiece(gameState, fromRow, fromCol, row, col);
      setGameState(newState);
      setValidMoves([]);
      return;
    }

    if (piece && piece === piece.toUpperCase()) {
      const moves = getValidMoves(gameState.board, row, col, 'white');
      setGameState({ ...gameState, selectedSquare: [row, col] });
      setValidMoves(moves);
    } else {
      setGameState({ ...gameState, selectedSquare: null });
      setValidMoves([]);
    }
  };

  const handleNewGame = () => {
    if (!difficulty) {
      setDifficulty(null);
      setGameState(null);
      setShowResult(false);
      setValidMoves([]);
    } else {
      const newGameState = createInitialGameState(difficulty);
      setGameState(newGameState);
      setShowResult(false);
      setValidMoves([]);
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between items-start mb-8 pt-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Chess</h1>
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
            {(['easy', 'medium'] as ChessDifficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                className="w-full bg-white text-gray-800 py-4 rounded-xl font-bold hover:shadow-lg transition capitalize text-lg"
              >
                {diff === 'easy' ? '😊 Easy' : '🧠 Medium'}
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
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-start mb-6 pt-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Chess</h1>
            <p className="text-white text-opacity-80 mt-1 capitalize">{difficulty}</p>
          </div>
          <button
            onClick={onBack}
            className="text-2xl text-white hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-3 mb-6 border border-white border-opacity-20">
          <p className="text-white text-center font-bold">
            {gameState.currentPlayer === 'white' ? '♙ White to Move' : '♟ Black to Move'}
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-2 mb-6 shadow-2xl border-4 border-amber-900">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((square, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isSelected = gameState.selectedSquare?.[0] === rowIndex && gameState.selectedSquare?.[1] === colIndex;
                const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquarePress(rowIndex, colIndex)}
                    className={`flex-1 aspect-square text-4xl flex items-center justify-center font-bold transition ${
                      isLight ? 'bg-amber-100' : 'bg-amber-700'
                    } ${isSelected ? 'ring-4 ring-yellow-400' : ''} ${
                      isValidMove ? 'ring-4 ring-green-400' : ''
                    } hover:opacity-80`}
                  >
                    {square.piece ? PIECE_SYMBOLS[square.piece] : ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {gameState.moveHistory.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4 mb-6 border border-white border-opacity-20">
            <p className="text-white font-bold mb-2">Moves:</p>
            <p className="text-white text-sm">
              {gameState.moveHistory.join(' ')}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleNewGame}
            className="w-full bg-white text-amber-700 py-3 rounded-xl font-bold hover:shadow-lg transition"
          >
            New Game
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
            <p className="text-5xl text-center mb-4">♔</p>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Game Over
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleNewGame}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
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
