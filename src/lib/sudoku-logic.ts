import type { SudokuCell, SudokuGameState, SudokuDifficulty } from '@/types/game-types';

function generateSudokuBoard(): number[][] {
  const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    
    return true;
  }
  
  function fillBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let num of numbers) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (fillBoard()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  fillBoard();
  return board;
}

function removeNumbers(board: number[][], difficulty: SudokuDifficulty): number[][] {
  const newBoard = board.map(row => [...row]);
  const cellsToRemove = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (newBoard[row][col] !== 0) {
      newBoard[row][col] = 0;
      removed++;
    }
  }
  
  return newBoard;
}

export function generatePuzzle(difficulty: SudokuDifficulty): number[][] {
  const board = generateSudokuBoard();
  return removeNumbers(board, difficulty);
}

export function createInitialGameState(difficulty: SudokuDifficulty): SudokuGameState {
  const puzzle = generatePuzzle(difficulty);
  
  const board: SudokuCell[][] = puzzle.map(row =>
    row.map(value => ({
      value,
      isFixed: value !== 0,
      isSelected: false,
      isError: false,
    }))
  );
  
  return {
    board,
    difficulty,
    isComplete: false,
    startTime: Date.now(),
    elapsedTime: 0,
  };
}

export function isValidPlacement(
  board: SudokuCell[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i].value === num) return false;
  }
  
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col].value === num) return false;
  }
  
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && board[i][j].value === num) return false;
    }
  }
  
  return true;
}

export function setCell(
  board: SudokuCell[][],
  row: number,
  col: number,
  value: number
): SudokuCell[][] {
  const newBoard = board.map(r => [...r]);
  if (!newBoard[row][col].isFixed) {
    newBoard[row][col].value = value;
    newBoard[row][col].isError = value !== 0 && !isValidPlacement(newBoard, row, col, value);
  }
  return newBoard;
}

export function clearCell(board: SudokuCell[][], row: number, col: number): SudokuCell[][] {
  const newBoard = board.map(r => [...r]);
  if (!newBoard[row][col].isFixed) {
    newBoard[row][col].value = 0;
    newBoard[row][col].isError = false;
  }
  return newBoard;
}

export function isComplete(board: SudokuCell[][]): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0) return false;
      if (board[i][j].isError) return false;
    }
  }
  return true;
}

export function getRelatedCells(row: number, col: number): [number, number][] {
  const related: [number, number][] = [];
  
  for (let i = 0; i < 9; i++) {
    if (i !== col) related.push([row, i]);
  }
  
  for (let i = 0; i < 9; i++) {
    if (i !== row) related.push([i, col]);
  }
  
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (i !== row || j !== col) related.push([i, j]);
    }
  }
  
  return related;
}
