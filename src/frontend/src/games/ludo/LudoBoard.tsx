import { type LudoGameState } from './ludoRules';

interface LudoBoardProps {
  gameState: LudoGameState;
  selectedPiece: number | null;
  onPieceClick: (pieceIndex: number) => void;
  canMove: boolean;
}

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / 15;

export default function LudoBoard({ gameState, selectedPiece, onPieceClick, canMove }: LudoBoardProps) {
  const renderPiece = (player: number, pieceIndex: number, x: number, y: number) => {
    const isSelected = selectedPiece === pieceIndex && gameState.currentPlayer === player;
    const isCurrentPlayer = gameState.currentPlayer === player;

    return (
      <circle
        key={`${player}-${pieceIndex}`}
        cx={x}
        cy={y}
        r={CELL_SIZE * 0.35}
        fill={COLORS[player]}
        stroke={isSelected ? '#fff' : COLORS[player]}
        strokeWidth={isSelected ? 3 : 1}
        className={isCurrentPlayer && canMove ? 'cursor-pointer hover:opacity-80' : ''}
        onClick={() => isCurrentPlayer && canMove && onPieceClick(pieceIndex)}
        style={{ transition: 'all 0.3s' }}
      />
    );
  };

  const getPositionCoords = (player: number, position: number): [number, number] => {
    // Simplified board layout - pieces arranged in a cross pattern
    const centerX = BOARD_SIZE / 2;
    const centerY = BOARD_SIZE / 2;

    if (position === -1) {
      // Home positions (corners)
      const homeOffsets = [
        [2, 2], [12, 2], [2, 12], [12, 12]
      ];
      const [hx, hy] = homeOffsets[player];
      return [hx * CELL_SIZE, hy * CELL_SIZE];
    }

    if (position === 58) {
      // Finished - center
      return [centerX, centerY];
    }

    // Track positions (simplified circular layout)
    const angle = (position / 52) * Math.PI * 2 - Math.PI / 2;
    const radius = BOARD_SIZE * 0.35;
    return [
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
    ];
  };

  return (
    <div className="flex justify-center">
      <svg
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        className="border-2 border-border rounded-lg bg-card shadow-lg"
      >
        {/* Background */}
        <rect width={BOARD_SIZE} height={BOARD_SIZE} fill="oklch(var(--card))" />

        {/* Cross pattern */}
        <rect x={BOARD_SIZE * 0.4} y={0} width={BOARD_SIZE * 0.2} height={BOARD_SIZE} fill="oklch(var(--muted))" />
        <rect x={0} y={BOARD_SIZE * 0.4} width={BOARD_SIZE} height={BOARD_SIZE * 0.2} fill="oklch(var(--muted))" />

        {/* Home areas */}
        {[0, 1, 2, 3].slice(0, gameState.players).map((player) => {
          const homePositions = [
            [1, 1], [11, 1], [1, 11], [11, 11]
          ];
          const [hx, hy] = homePositions[player];
          return (
            <rect
              key={`home-${player}`}
              x={hx * CELL_SIZE}
              y={hy * CELL_SIZE}
              width={CELL_SIZE * 3}
              height={CELL_SIZE * 3}
              fill={COLORS[player]}
              opacity={0.2}
              rx={8}
            />
          );
        })}

        {/* Center finish area */}
        <circle
          cx={BOARD_SIZE / 2}
          cy={BOARD_SIZE / 2}
          r={CELL_SIZE * 1.5}
          fill="oklch(var(--primary))"
          opacity={0.2}
        />

        {/* Render pieces */}
        {gameState.pieces.map((playerPieces, player) =>
          playerPieces.map((position, pieceIndex) => {
            const [x, y] = getPositionCoords(player, position);
            return renderPiece(player, pieceIndex, x, y);
          })
        )}
      </svg>
    </div>
  );
}
