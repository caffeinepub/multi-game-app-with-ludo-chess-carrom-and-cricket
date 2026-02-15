export interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'white' | 'black' | 'queen';
  active: boolean;
}

export interface CarromGameState {
  players: number;
  currentPlayer: number;
  coins: Coin[];
  scores: number[];
  winner: number | null;
}

const BOARD_SIZE = 500;
const COIN_RADIUS = 12;
const POCKET_RADIUS = 20;
const FRICTION = 0.98;

export function initializeGame(players: number): CarromGameState {
  const coins: Coin[] = [];

  // Center arrangement
  const centerX = BOARD_SIZE / 2;
  const centerY = BOARD_SIZE / 2;

  // Queen in center
  coins.push({
    x: centerX,
    y: centerY,
    vx: 0,
    vy: 0,
    type: 'queen',
    active: true,
  });

  // White and black coins in a circle
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const radius = 40;
    coins.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      type: i % 2 === 0 ? 'white' : 'black',
      active: true,
    });
  }

  return {
    players,
    currentPlayer: 0,
    coins,
    scores: Array(players).fill(0),
    winner: null,
  };
}

export function takeShot(state: CarromGameState, angle: number, power: number): CarromGameState {
  const newState = { ...state, coins: state.coins.map(c => ({ ...c })) };

  // Striker starts from bottom center
  const striker: Coin = {
    x: BOARD_SIZE / 2,
    y: BOARD_SIZE - 50,
    vx: Math.cos((angle * Math.PI) / 180) * (power / 10),
    vy: Math.sin((angle * Math.PI) / 180) * (power / 10),
    type: 'white',
    active: true,
  };

  // Simulate physics
  const allCoins = [...newState.coins, striker];
  let pocketed: Coin[] = [];

  for (let step = 0; step < 200; step++) {
    // Update positions
    allCoins.forEach(coin => {
      if (!coin.active) return;
      coin.x += coin.vx;
      coin.y += coin.vy;
      coin.vx *= FRICTION;
      coin.vy *= FRICTION;

      // Stop if too slow
      if (Math.abs(coin.vx) < 0.1 && Math.abs(coin.vy) < 0.1) {
        coin.vx = 0;
        coin.vy = 0;
      }

      // Bounce off walls
      if (coin.x < COIN_RADIUS || coin.x > BOARD_SIZE - COIN_RADIUS) {
        coin.vx *= -0.8;
        coin.x = Math.max(COIN_RADIUS, Math.min(BOARD_SIZE - COIN_RADIUS, coin.x));
      }
      if (coin.y < COIN_RADIUS || coin.y > BOARD_SIZE - COIN_RADIUS) {
        coin.vy *= -0.8;
        coin.y = Math.max(COIN_RADIUS, Math.min(BOARD_SIZE - COIN_RADIUS, coin.y));
      }
    });

    // Check collisions
    for (let i = 0; i < allCoins.length; i++) {
      for (let j = i + 1; j < allCoins.length; j++) {
        const c1 = allCoins[i];
        const c2 = allCoins[j];
        if (!c1.active || !c2.active) continue;

        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < COIN_RADIUS * 2) {
          // Simple collision response
          const angle = Math.atan2(dy, dx);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          const vx1 = c1.vx * cos + c1.vy * sin;
          const vy1 = c1.vy * cos - c1.vx * sin;
          const vx2 = c2.vx * cos + c2.vy * sin;
          const vy2 = c2.vy * cos - c2.vx * sin;

          c1.vx = vx2 * cos - vy1 * sin;
          c1.vy = vy1 * cos + vx2 * sin;
          c2.vx = vx1 * cos - vy2 * sin;
          c2.vy = vy2 * cos + vx1 * sin;

          // Separate coins
          const overlap = COIN_RADIUS * 2 - dist;
          c1.x -= (overlap / 2) * cos;
          c1.y -= (overlap / 2) * sin;
          c2.x += (overlap / 2) * cos;
          c2.y += (overlap / 2) * sin;
        }
      }
    }

    // Check pockets (corners)
    const pockets = [
      [POCKET_RADIUS, POCKET_RADIUS],
      [BOARD_SIZE - POCKET_RADIUS, POCKET_RADIUS],
      [POCKET_RADIUS, BOARD_SIZE - POCKET_RADIUS],
      [BOARD_SIZE - POCKET_RADIUS, BOARD_SIZE - POCKET_RADIUS],
    ];

    allCoins.forEach(coin => {
      if (!coin.active) return;
      pockets.forEach(([px, py]) => {
        const dx = coin.x - px;
        const dy = coin.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < POCKET_RADIUS) {
          coin.active = false;
          if (coin !== striker) {
            pocketed.push(coin);
          }
        }
      });
    });
  }

  // Update scores
  pocketed.forEach(coin => {
    if (coin.type === 'white') newState.scores[state.currentPlayer] += 10;
    if (coin.type === 'black') newState.scores[state.currentPlayer] += 20;
    if (coin.type === 'queen') newState.scores[state.currentPlayer] += 50;
  });

  // Remove pocketed coins
  newState.coins = newState.coins.filter(c => c.active);

  // Check winner
  const maxScore = Math.max(...newState.scores);
  if (maxScore >= 100) {
    newState.winner = newState.scores.indexOf(maxScore);
  } else {
    // Next player
    newState.currentPlayer = (state.currentPlayer + 1) % state.players;
  }

  return newState;
}
