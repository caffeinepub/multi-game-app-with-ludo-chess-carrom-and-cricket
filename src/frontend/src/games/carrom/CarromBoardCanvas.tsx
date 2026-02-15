import { useEffect, useRef } from 'react';
import { type CarromGameState } from './carromPhysics';

interface CarromBoardCanvasProps {
  gameState: CarromGameState;
  angle: number;
  power: number;
  isAnimating: boolean;
}

const BOARD_SIZE = 500;
const COIN_RADIUS = 12;

export default function CarromBoardCanvas({
  gameState,
  angle,
  power,
  isAnimating,
}: CarromBoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = 'oklch(var(--card))';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Board border
    ctx.strokeStyle = 'oklch(var(--border))';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Center circle
    ctx.beginPath();
    ctx.arc(BOARD_SIZE / 2, BOARD_SIZE / 2, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'oklch(var(--muted-foreground) / 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pockets (corners)
    const pockets = [
      [20, 20],
      [BOARD_SIZE - 20, 20],
      [20, BOARD_SIZE - 20],
      [BOARD_SIZE - 20, BOARD_SIZE - 20],
    ];

    ctx.fillStyle = 'oklch(var(--muted))';
    pockets.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw coins
    gameState.coins.forEach(coin => {
      if (!coin.active) return;

      ctx.beginPath();
      ctx.arc(coin.x, coin.y, COIN_RADIUS, 0, Math.PI * 2);

      if (coin.type === 'white') {
        ctx.fillStyle = '#f0f0f0';
      } else if (coin.type === 'black') {
        ctx.fillStyle = '#2a2a2a';
      } else {
        ctx.fillStyle = '#ef4444';
      }

      ctx.fill();
      ctx.strokeStyle = 'oklch(var(--border))';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw aim line
    if (!isAnimating) {
      const strikerX = BOARD_SIZE / 2;
      const strikerY = BOARD_SIZE - 50;
      const lineLength = power * 2;

      ctx.beginPath();
      ctx.moveTo(strikerX, strikerY);
      ctx.lineTo(
        strikerX + Math.cos((angle * Math.PI) / 180) * lineLength,
        strikerY + Math.sin((angle * Math.PI) / 180) * lineLength
      );
      ctx.strokeStyle = 'oklch(var(--primary))';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Striker position
      ctx.beginPath();
      ctx.arc(strikerX, strikerY, COIN_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'oklch(var(--accent))';
      ctx.fill();
      ctx.strokeStyle = 'oklch(var(--primary))';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [gameState, angle, power, isAnimating]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        className="border-2 border-border rounded-lg shadow-lg bg-card"
      />
    </div>
  );
}
