export type GameType = 'tictactoe' | 'sudoku' | 'chess';

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

// Tic-Tac-Toe Types
export type TicTacToePlayer = 'X' | 'O' | null;
export type TicTacToeBoard = TicTacToePlayer[];

export interface TicTacToeGameState {
  board: TicTacToeBoard;
  currentPlayer: TicTacToePlayer;
  winner: TicTacToePlayer;
  isDraw: boolean;
  gameOver: boolean;
}

// Sudoku Types
export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

export interface SudokuCell {
  value: number;
  isFixed: boolean;
  isSelected: boolean;
  isError: boolean;
}

export interface SudokuGameState {
  board: SudokuCell[][];
  difficulty: SudokuDifficulty;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
}

// Chess Types
export type ChessPiece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | null;
export type ChessDifficulty = 'easy' | 'medium';

export interface ChessSquare {
  piece: ChessPiece;
  isSelected: boolean;
  isValidMove: boolean;
}

export interface ChessGameState {
  board: ChessSquare[][];
  currentPlayer: 'white' | 'black';
  selectedSquare: [number, number] | null;
  validMoves: [number, number][];
  moveHistory: string[];
  isCheckmate: boolean;
  isStalemate: boolean;
  gameOver: boolean;
  difficulty: ChessDifficulty;
}
