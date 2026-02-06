import type { TicTacToeBoard, TicTacToeGameState, TicTacToePlayer } from '@/types/game-types';

export function createInitialBoard(): TicTacToeBoard {
  return Array(9).fill(null);
}

export function createInitialGameState(): TicTacToeGameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    gameOver: false,
  };
}

export function checkWinner(board: TicTacToeBoard): TicTacToePlayer {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function isBoardFull(board: TicTacToeBoard): boolean {
  return board.every(cell => cell !== null);
}

export function makeMove(
  board: TicTacToeBoard,
  index: number,
  player: TicTacToePlayer
): TicTacToeBoard | null {
  if (board[index] !== null) return null;
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

export function getAvailableMoves(board: TicTacToeBoard): number[] {
  return board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null) as number[];
}

function minimax(
  board: TicTacToeBoard,
  depth: number,
  isMaximizing: boolean
): number {
  const winner = checkWinner(board);

  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    const moves = getAvailableMoves(board);
    for (let move of moves) {
      const newBoard = makeMove(board, move, 'O');
      if (newBoard) {
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const moves = getAvailableMoves(board);
    for (let move of moves) {
      const newBoard = makeMove(board, move, 'X');
      if (newBoard) {
        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

export function getAIMove(board: TicTacToeBoard): number {
  const moves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (let move of moves) {
    const newBoard = makeMove(board, move, 'O');
    if (newBoard) {
      const score = minimax(newBoard, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

export function updateGameState(
  state: TicTacToeGameState,
  moveIndex: number
): TicTacToeGameState {
  const newBoard = makeMove(state.board, moveIndex, state.currentPlayer);
  if (!newBoard) return state;

  const winner = checkWinner(newBoard);
  const isDraw = !winner && isBoardFull(newBoard);

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    isDraw,
    gameOver: !!winner || isDraw,
  };
}
