import { useEffect, useRef, useState } from 'react';
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
  const [boardTexture, setBoardTexture] = useState<HTMLImageElement | null>(null);

  // Load board texture
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/generated/carrom-board-texture.dim_1024x1024.png';
    img.onload = () => setBoardTexture(img);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Draw board texture if loaded
    if (boardTexture) {
      ctx.drawImage(boardTexture, 0, 0, BOARD_SIZE, BOARD_SIZE);
    } else {
      // Fallback: wood-like gradient
      const gradient = ctx.createLinearGradient(0, 0, BOARD_SIZE, BOARD_SIZE);
      gradient.addColorStop(0, '#d4a574');
      gradient.addColorStop(0.5, '#c89860');
      gradient.addColorStop(1, '#b88a50');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    }

    // Board border with depth
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    // Inner border
    ctx.strokeStyle = '#a0826d';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, BOARD_SIZE - 20, BOARD_SIZE - 20);

    // Center circle
    ctx.beginPath();
    ctx.arc(BOARD_SIZE / 2, BOARD_SIZE / 2, 50, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 111, 71, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pockets (corners) with depth
    const pockets = [
      [20, 20],
      [BOARD_SIZE - 20, 20],
      [20, BOARD_SIZE - 20],
      [BOARD_SIZE - 20, BOARD_SIZE - 20],
    ];

    pockets.forEach(([x, y]) => {
      // Outer shadow
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      // Pocket hole
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      const pocketGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      pocketGradient.addColorStop(0, '#1a1a1a');
      pocketGradient.addColorStop(1, '#000000');
      ctx.fillStyle = pocketGradient;
      ctx.fill();

      // Pocket rim
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw coins with realistic shading
    gameState.coins.forEach(coin => {
      if (!coin.active) return;

      // Coin shadow
      ctx.beginPath();
      ctx.arc(coin.x + 2, coin.y + 2, COIN_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      // Coin body with gradient
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, COIN_RADIUS, 0, Math.PI * 2);

      let coinGradient;
      if (coin.type === 'white') {
        coinGradient = ctx.createRadialGradient(
          coin.x - 3,
          coin.y - 3,
          0,
          coin.x,
          coin.y,
          COIN_RADIUS
        );
        coinGradient.addColorStop(0, '#ffffff');
        coinGradient.addColorStop(0.7, '#f0f0f0');
        coinGradient.addColorStop(1, '#d0d0d0');
      } else if (coin.type === 'black') {
        coinGradient = ctx.createRadialGradient(
          coin.x - 3,
          coin.y - 3,
          0,
          coin.x,
          coin.y,
          COIN_RADIUS
        );
        coinGradient.addColorStop(0, '#4a4a4a');
        coinGradient.addColorStop(0.7, '#2a2a2a');
        coinGradient.addColorStop(1, '#1a1a1a');
      } else {
        // Red queen
        coinGradient = ctx.createRadialGradient(
          coin.x - 3,
          coin.y - 3,
          0,
          coin.x,
          coin.y,
          COIN_RADIUS
        );
        coinGradient.addColorStop(0, '#ff6b6b');
        coinGradient.addColorStop(0.7, '#ef4444');
        coinGradient.addColorStop(1, '#dc2626');
      }

      ctx.fillStyle = coinGradient;
      ctx.fill();

      // Coin rim
      ctx.strokeStyle = coin.type === 'white' ? '#c0c0c0' : '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(coin.x - 4, coin.y - 4, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
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
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Striker with gradient
      ctx.beginPath();
      ctx.arc(strikerX, strikerY, COIN_RADIUS, 0, Math.PI * 2);
      const strikerGradient = ctx.createRadialGradient(
        strikerX - 3,
        strikerY - 3,
        0,
        strikerX,
        strikerY,
        COIN_RADIUS
      );
      strikerGradient.addColorStop(0, '#fbbf24');
      strikerGradient.addColorStop(0.7, '#f59e0b');
      strikerGradient.addColorStop(1, '#d97706');
      ctx.fillStyle = strikerGradient;
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Striker highlight
      ctx.beginPath();
      ctx.arc(strikerX - 4, strikerY - 4, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
    }
  }, [gameState, angle, power, isAnimating, boardTexture]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        className="border-4 border-border rounded-lg shadow-2xl"
        style={{ backgroundColor: '#d4a574' }}
      />
    </div>
  );
}
