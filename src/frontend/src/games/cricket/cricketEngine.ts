export interface InningsState {
  runs: number;
  wickets: number;
  balls: number;
}

export interface CricketMatchState {
  totalBalls: number;
  currentInnings: number;
  innings: InningsState[];
  matchOver: boolean;
  winner: number | null;
  lastBallResult?: string;
  seed: number;
}

// Seeded random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function initializeMatch(overs: number): CricketMatchState {
  return {
    totalBalls: overs * 6,
    currentInnings: 0,
    innings: [
      { runs: 0, wickets: 0, balls: 0 },
      { runs: 0, wickets: 0, balls: 0 },
    ],
    matchOver: false,
    winner: null,
    seed: Date.now(),
  };
}

export function playBall(state: CricketMatchState, shotChoice: string): CricketMatchState {
  const newState = { ...state, innings: state.innings.map(i => ({ ...i })) };
  const currentInnings = newState.innings[newState.currentInnings];

  // Check if innings is already over
  if (currentInnings.wickets >= 10 || currentInnings.balls >= state.totalBalls) {
    if (newState.currentInnings === 0) {
      // Move to second innings
      newState.currentInnings = 1;
      newState.lastBallResult = 'Starting Innings 2';
      return newState;
    } else {
      // Match over
      return determineWinner(newState);
    }
  }

  // Generate outcome based on shot choice
  newState.seed = (newState.seed * 9301 + 49297) % 233280;
  const random = seededRandom(newState.seed);

  let runs = 0;
  let isOut = false;
  let result = '';

  switch (shotChoice) {
    case 'defensive':
      if (random < 0.9) {
        runs = random < 0.7 ? 0 : 1;
        result = runs === 0 ? 'Dot ball' : '1 run';
      } else {
        isOut = true;
        result = 'OUT! Caught behind';
      }
      break;

    case 'singles':
      if (random < 0.7) {
        runs = random < 0.3 ? 1 : random < 0.6 ? 2 : 0;
        result = runs === 0 ? 'Dot ball' : `${runs} run${runs > 1 ? 's' : ''}`;
      } else {
        isOut = true;
        result = 'OUT! Bowled';
      }
      break;

    case 'boundaries':
      if (random < 0.4) {
        runs = random < 0.2 ? 4 : 6;
        result = `${runs} runs! Boundary!`;
      } else if (random < 0.6) {
        runs = Math.floor(random * 3) + 1;
        result = `${runs} run${runs > 1 ? 's' : ''}`;
      } else {
        isOut = true;
        result = 'OUT! Caught in the deep';
      }
      break;

    case 'big':
      if (random < 0.2) {
        runs = 6;
        result = 'SIX! What a shot!';
      } else if (random < 0.3) {
        runs = 4;
        result = 'FOUR! Great timing';
      } else if (random < 0.4) {
        runs = Math.floor(random * 3) + 1;
        result = `${runs} run${runs > 1 ? 's' : ''}`;
      } else {
        isOut = true;
        result = 'OUT! Miscued shot';
      }
      break;
  }

  currentInnings.balls++;

  if (isOut) {
    currentInnings.wickets++;
  } else {
    currentInnings.runs += runs;
  }

  newState.lastBallResult = result;

  // Check if innings is over
  if (currentInnings.wickets >= 10 || currentInnings.balls >= state.totalBalls) {
    if (newState.currentInnings === 0) {
      newState.lastBallResult += ' - Innings Over';
    } else {
      return determineWinner(newState);
    }
  }

  // Check if chasing team has won
  if (newState.currentInnings === 1 && currentInnings.runs > newState.innings[0].runs) {
    return determineWinner(newState);
  }

  return newState;
}

function determineWinner(state: CricketMatchState): CricketMatchState {
  const newState = { ...state, matchOver: true };

  const team1Runs = newState.innings[0].runs;
  const team2Runs = newState.innings[1].runs;

  if (team1Runs > team2Runs) {
    newState.winner = 0;
    newState.lastBallResult = `Team 1 wins by ${team1Runs - team2Runs} runs!`;
  } else if (team2Runs > team1Runs) {
    newState.winner = 1;
    const wicketsLeft = 10 - newState.innings[1].wickets;
    newState.lastBallResult = `Team 2 wins by ${wicketsLeft} wickets!`;
  } else {
    newState.winner = null;
    newState.lastBallResult = "It's a tie!";
  }

  return newState;
}
