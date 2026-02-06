import type { ChessGameState, ChessPiece, ChessDifficulty } from '@/types/game-types';

const INITIAL_BOARD: ChessPiece[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export function createInitialGameState(difficulty: ChessDifficulty): ChessGameState {
  return {
    board: INITIAL_BOARD.map(row =>
      row.map(piece => ({
        piece,
        isSelected: false,
        isValidMove: false,
      }))
    ),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    isCheckmate: false,
    isStalemate: false,
    gameOver: false,
    difficulty,
  };
}

function isWhitePiece(piece: ChessPiece): boolean {
  return piece !== null && piece === piece.toUpperCase();
}

function isBlackPiece(piece: ChessPiece): boolean {
  return piece !== null && piece === piece.toLowerCase();
}

export function getValidMoves(
  board: ChessGameState['board'],
  row: number,
  col: number,
  currentPlayer: 'white' | 'black'
): [number, number][] {
  const piece = board[row][col].piece;
  if (!piece) return [];

  const isWhite = isWhitePiece(piece);
  if ((isWhite && currentPlayer === 'black') || (!isWhite && currentPlayer === 'white')) {
    return [];
  }

  const moves: [number, number][] = [];
  const pieceLower = piece.toLowerCase();

  if (pieceLower === 'p') {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    const forwardRow = row + direction;
    if (forwardRow >= 0 && forwardRow < 8 && !board[forwardRow][col].piece) {
      moves.push([forwardRow, col]);

      if (row === startRow && !board[row + 2 * direction][col].piece) {
        moves.push([row + 2 * direction, col]);
      }
    }

    for (let newCol of [col - 1, col + 1]) {
      if (newCol >= 0 && newCol < 8) {
        const captureRow = row + direction;
        const targetPiece = board[captureRow][newCol].piece;
        if (targetPiece && isWhitePiece(targetPiece) !== isWhite) {
          moves.push([captureRow, newCol]);
        }
      }
    }
  } else if (pieceLower === 'n') {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (let [dr, dc] of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const target = board[newRow][newCol].piece;
        if (!target || isWhitePiece(target) !== isWhite) {
          moves.push([newRow, newCol]);
        }
      }
    }
  } else if (pieceLower === 'b') {
    for (let [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const target = board[newRow][newCol].piece;
        if (!target) {
          moves.push([newRow, newCol]);
        } else if (isWhitePiece(target) !== isWhite) {
          moves.push([newRow, newCol]);
          break;
        } else {
          break;
        }
      }
    }
  } else if (pieceLower === 'r') {
    for (let [dr, dc] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const target = board[newRow][newCol].piece;
        if (!target) {
          moves.push([newRow, newCol]);
        } else if (isWhitePiece(target) !== isWhite) {
          moves.push([newRow, newCol]);
          break;
        } else {
          break;
        }
      }
    }
  } else if (pieceLower === 'q') {
    for (let [dr, dc] of [
      [0, -1], [0, 1], [-1, 0], [1, 0],
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ]) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const target = board[newRow][newCol].piece;
        if (!target) {
          moves.push([newRow, newCol]);
        } else if (isWhitePiece(target) !== isWhite) {
          moves.push([newRow, newCol]);
          break;
        } else {
          break;
        }
      }
    }
  } else if (pieceLower === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = board[newRow][newCol].piece;
          if (!target || isWhitePiece(target) !== isWhite) {
            moves.push([newRow, newCol]);
          }
        }
      }
    }
  }

  return moves;
}

export function movePiece(
  state: ChessGameState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): ChessGameState {
  const newBoard = state.board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol].piece;

  newBoard[toRow][toCol].piece = piece;
  newBoard[fromRow][fromCol].piece = null;

  const moveNotation = `${String.fromCharCode(65 + fromCol)}${8 - fromRow}${String.fromCharCode(65 + toCol)}${8 - toRow}`;

  return {
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [...state.moveHistory, moveNotation],
  };
}

export function getAIMove(state: ChessGameState): [number, number, number, number] | null {
  const moves: [number, number, number, number][] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = state.board[row][col].piece;
      if (!piece || !isBlackPiece(piece)) continue;

      const validMoves = getValidMoves(state.board, row, col, 'black');
      for (let [toRow, toCol] of validMoves) {
        moves.push([row, col, toRow, toCol]);
      }
    }
  }

  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
