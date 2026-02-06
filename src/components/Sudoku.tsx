import { useState, useEffect } from 'react';
import type { SudokuGameState, SudokuDifficulty } from '@/types/game-types';
import {
  createInitialGameState,
  setCell,
  clearCell,
  isComplete,
  getRelatedCells,
} from '@/lib/sudoku-logic';
import { updateGameStats } from '@/lib/storage';

interface SudokuProps {
  onBack: () => void;
}

export default function Sudoku({ onBack }: SudokuProps) {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty | null>(null);
  const [gameState, setGameState] = useState<SudokuGameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!gameState) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      setElapsedTime(elapsed);
      setGameState(prev => prev ? { ...prev, elapsedTime: elapsed } : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const handleSelectDifficulty = (selectedDifficulty: SudokuDifficulty) => {
    setDifficulty(selectedDifficulty);
    const newGameState = createInitialGameState(selectedDifficulty);
    setGameState(newGameState);
  };

  const handleCellPress = (row: number, col: number) => {
    if (gameState?.board[row][col].isFixed) return;
    setSelectedCell([row, col]);
  };

  const handleNumberPress = (num: number) => {
    if (!gameState || !selectedCell) return;

    const [row, col] = selectedCell;
    let newBoard = setCell(gameState.board, row, col, num);
    const newGameState = { ...gameState, board: newBoard };

    if (isComplete(newBoard)) {
      newGameState.isComplete = true;
      setGameState(newGameState);
      handleGameComplete();
    } else {
      setGameState(newGameState);
    }
  };

  const handleClear = () => {
    if (!gameState || !selectedCell) return;

    const [row, col] = selectedCell;
    const newBoard = clearCell(gameState.board, row, col);
    setGameState({ ...gameState, board: newBoard });
  };

  const handleGameComplete = async () => {
    updateGameStats('sudoku', 'win');
    setShowResult(true);
  };

  const handleNewGame = () => {
    if (!difficulty) {
      setDifficulty(null);
      setGameState(null);
      setSelectedCell(null);
      setShowResult(false);
      setElapsedTime(0);
    } else {
      const newGameState = createInitialGameState(difficulty);
      setGameState(newGameState);
      setSelectedCell(null);
      setShowResult(false);
      setElapsedTime(0);
    }
  };

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold text-foreground">Sudoku</h1>
            <button
              onClick={onBack}
              className="text-2xl hover:opacity-70 transition"
            >
              ✕
            </button>
          </div>

          <p className="text-lg text-foreground font-bold mb-4">Select Difficulty</p>

          <div className="space-y-3">
            {(['easy', 'medium', 'hard'] as SudokuDifficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => handleSelectDifficulty(diff)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition capitalize"
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            onClick={onBack}
            className="w-full bg-surface text-foreground py-4 rounded-xl font-bold border border-border hover:opacity-70 transition mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const relatedCells = selectedCell ? getRelatedCells(selectedCell[0], selectedCell[1]) : [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Sudoku</h1>
            <p className="text-muted mt-1 capitalize">{difficulty}</p>
          </div>
          <button
            onClick={onBack}
            className="text-2xl hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-surface rounded-lg p-3 mb-6 border border-border">
          <p className="text-center text-foreground font-bold">
            Time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-2 mb-6 border border-border">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, colIndex) => {
                const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                const isRelated = relatedCells.some(([r, c]) => r === rowIndex && c === colIndex);
                const isBoxStart = rowIndex % 3 === 0;
                const isColStart = colIndex % 3 === 0;

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellPress(rowIndex, colIndex)}
                    disabled={cell.isFixed}
                    className={`flex-1 aspect-square text-lg font-bold border ${
                      isBoxStart ? 'border-l-2' : 'border-l'
                    } ${isColStart ? 'border-t-2' : 'border-t'} ${
                      colIndex === 8 ? 'border-r-2' : ''
                    } ${rowIndex === 8 ? 'border-b-2' : ''} ${
                      isSelected ? 'bg-primary bg-opacity-20' : isRelated ? 'bg-primary bg-opacity-10' : ''
                    } ${cell.isFixed ? 'bg-muted bg-opacity-10' : ''} ${
                      cell.isError ? 'bg-error bg-opacity-20' : ''
                    } ${!cell.isFixed ? 'text-primary' : 'text-foreground'} ${
                      cell.isError ? 'text-error' : ''
                    } hover:opacity-70 transition disabled:opacity-100`}
                  >
                    {cell.value || ''}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-2xl p-4 mb-6 border border-border">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberPress(num)}
                disabled={!selectedCell}
                className="aspect-square bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleClear}
            disabled={!selectedCell}
            className="w-full bg-error text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition"
          >
            Clear Cell
          </button>

          <button
            onClick={handleNewGame}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
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
      </div>

      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-8 w-full max-w-sm border border-border">
            <p className="text-4xl text-center mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-foreground text-center mb-2">Puzzle Complete!</h2>
            <p className="text-lg text-muted text-center mb-8">
              Time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </p>
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
