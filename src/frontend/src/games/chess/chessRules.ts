export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type Color = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

export interface ChessGameState {
  board: (Piece | null)[][];
  currentPlayer: Color;
  moveCount: number;
  gameOver: boolean;
}

export function initializeGame(): ChessGameState {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Setup pieces
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: backRow[i], color: 'black' };
    board[1][i] = { type: 'pawn', color: 'black' };
    board[6][i] = { type: 'pawn', color: 'white' };
    board[7][i] = { type: backRow[i], color: 'white' };
  }

  return {
    board,
    currentPlayer: 'white',
    moveCount: 0,
    gameOver: false,
  };
}

export function isValidMove(
  state: ChessGameState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const piece = state.board[fromRow][fromCol];
  if (!piece || piece.color !== state.currentPlayer) return false;

  const target = state.board[toRow][toCol];
  if (target && target.color === piece.color) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const absRowDiff = Math.abs(rowDiff);
  const absColDiff = Math.abs(colDiff);

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      if (colDiff === 0 && !target) {
        if (rowDiff === direction) return true;
        if (!piece.hasMoved && rowDiff === direction * 2 && !state.board[fromRow + direction][fromCol]) return true;
      }
      if (absColDiff === 1 && rowDiff === direction && target) return true;
      return false;
    }
    case 'rook':
      if (rowDiff === 0 || colDiff === 0) {
        return isPathClear(state.board, fromRow, fromCol, toRow, toCol);
      }
      return false;
    case 'knight':
      return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
    case 'bishop':
      if (absRowDiff === absColDiff) {
        return isPathClear(state.board, fromRow, fromCol, toRow, toCol);
      }
      return false;
    case 'queen':
      if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
        return isPathClear(state.board, fromRow, fromCol, toRow, toCol);
      }
      return false;
    case 'king':
      return absRowDiff <= 1 && absColDiff <= 1;
  }
}

function isPathClear(
  board: (Piece | null)[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let row = fromRow + rowStep;
  let col = fromCol + colStep;

  while (row !== toRow || col !== toCol) {
    if (board[row][col]) return false;
    row += rowStep;
    col += colStep;
  }

  return true;
}

export function makeMove(
  state: ChessGameState,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): ChessGameState {
  if (!isValidMove(state, fromRow, fromCol, toRow, toCol)) return state;

  const newBoard = state.board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol]!;

  // Check if move would put own king in check
  newBoard[toRow][toCol] = { ...piece, hasMoved: true };
  newBoard[fromRow][fromCol] = null;

  const testState = { ...state, board: newBoard };
  if (isInCheck(testState, state.currentPlayer)) {
    return state; // Invalid move - would be in check
  }

  const newState: ChessGameState = {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'white' ? 'black' : 'white',
    moveCount: state.moveCount + 1,
    gameOver: false,
  };

  if (isCheckmate(newState)) {
    newState.gameOver = true;
  }

  return newState;
}

function findKing(board: (Piece | null)[][], color: Color): [number, number] | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return [row, col];
      }
    }
  }
  return null;
}

export function isInCheck(state: ChessGameState, color: Color): boolean {
  const kingPos = findKing(state.board, color);
  if (!kingPos) return false;

  const [kingRow, kingCol] = kingPos;
  const opponent: Color = color === 'white' ? 'black' : 'white';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = state.board[row][col];
      if (piece && piece.color === opponent) {
        const testState: ChessGameState = { ...state, currentPlayer: opponent };
        if (isValidMove(testState, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isCheckmate(state: ChessGameState): boolean {
  if (!isInCheck(state, state.currentPlayer)) return false;

  // Try all possible moves
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = state.board[fromRow][fromCol];
      if (!piece || piece.color !== state.currentPlayer) continue;

      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          const newState = makeMove(state, fromRow, fromCol, toRow, toCol);
          if (newState !== state) {
            return false; // Found a valid move
          }
        }
      }
    }
  }

  return true;
}
