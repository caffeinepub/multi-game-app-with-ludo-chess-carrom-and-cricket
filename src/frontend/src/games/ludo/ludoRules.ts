export interface LudoGameState {
  players: number;
  currentPlayer: number;
  pieces: number[][]; // [player][piece] = position (-1 = home, 0-51 = track, 52-57 = finish lane, 58 = finished)
  winner: number | null;
}

const TRACK_LENGTH = 52;
const FINISH_LANE_LENGTH = 6;
const PIECES_PER_PLAYER = 4;

export function initializeGame(players: number): LudoGameState {
  const pieces: number[][] = [];
  for (let i = 0; i < players; i++) {
    pieces.push(Array(PIECES_PER_PLAYER).fill(-1));
  }

  return {
    players,
    currentPlayer: 0,
    pieces,
    winner: null,
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function getStartPosition(player: number): number {
  return player * 13;
}

function getFinishLaneStart(player: number): number {
  return TRACK_LENGTH + player * FINISH_LANE_LENGTH;
}

export function movePiece(state: LudoGameState, pieceIndex: number, diceRoll: number): LudoGameState {
  const currentPos = state.pieces[state.currentPlayer][pieceIndex];

  // Can't move finished pieces
  if (currentPos === 58) return state;

  // Enter from home only on 6
  if (currentPos === -1) {
    if (diceRoll !== 6) return state;

    const newState = { ...state, pieces: state.pieces.map(p => [...p]) };
    newState.pieces[state.currentPlayer][pieceIndex] = getStartPosition(state.currentPlayer);
    
    // Extra turn on 6
    return newState;
  }

  // Calculate new position
  let newPos = currentPos + diceRoll;
  const startPos = getStartPosition(state.currentPlayer);
  const finishStart = getFinishLaneStart(state.currentPlayer);

  // Check if entering finish lane
  if (currentPos < TRACK_LENGTH && newPos >= startPos + TRACK_LENGTH) {
    const overflow = newPos - (startPos + TRACK_LENGTH);
    newPos = finishStart + overflow;
  }

  // Check if in finish lane
  if (currentPos >= finishStart && currentPos < finishStart + FINISH_LANE_LENGTH) {
    if (newPos >= finishStart + FINISH_LANE_LENGTH) {
      if (newPos === finishStart + FINISH_LANE_LENGTH) {
        newPos = 58; // Finished
      } else {
        return state; // Can't overshoot
      }
    }
  }

  // Wrap around track
  if (newPos >= TRACK_LENGTH && newPos < finishStart) {
    newPos = newPos % TRACK_LENGTH;
  }

  const newState = { ...state, pieces: state.pieces.map(p => [...p]) };
  newState.pieces[state.currentPlayer][pieceIndex] = newPos;

  // Check for captures
  if (newPos < TRACK_LENGTH) {
    for (let p = 0; p < state.players; p++) {
      if (p === state.currentPlayer) continue;
      for (let i = 0; i < PIECES_PER_PLAYER; i++) {
        if (newState.pieces[p][i] === newPos) {
          newState.pieces[p][i] = -1; // Send back home
        }
      }
    }
  }

  // Next turn (unless rolled 6)
  if (diceRoll !== 6) {
    newState.currentPlayer = (state.currentPlayer + 1) % state.players;
  }

  return newState;
}

export function checkWinner(state: LudoGameState): number | null {
  for (let p = 0; p < state.players; p++) {
    if (state.pieces[p].every(pos => pos === 58)) {
      return p;
    }
  }
  return null;
}
