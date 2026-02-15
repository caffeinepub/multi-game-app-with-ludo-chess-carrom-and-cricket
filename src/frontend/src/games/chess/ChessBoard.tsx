import { type ChessGameState, type Piece } from './chessRules';

interface ChessBoardProps {
  gameState: ChessGameState;
  selectedSquare: [number, number] | null;
  onSquareClick: (row: number, col: number) => void;
}

const PIECE_SYMBOLS: Record<string, string> = {
  'white-king': '♔',
  'white-queen': '♕',
  'white-rook': '♖',
  'white-bishop': '♗',
  'white-knight': '♘',
  'white-pawn': '♙',
  'black-king': '♚',
  'black-queen': '♛',
  'black-rook': '♜',
  'black-bishop': '♝',
  'black-knight': '♞',
  'black-pawn': '♟',
};

export default function ChessBoard({ gameState, selectedSquare, onSquareClick }: ChessBoardProps) {
  const renderPiece = (piece: Piece | null) => {
    if (!piece) return null;
    const key = `${piece.color}-${piece.type}`;
    return (
      <span className="text-5xl select-none">
        {PIECE_SYMBOLS[key]}
      </span>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="inline-block border-4 border-border rounded-lg overflow-hidden shadow-xl">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selectedSquare?.[0] === rowIndex && selectedSquare?.[1] === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-16 h-16 flex items-center justify-center cursor-pointer
                    transition-all duration-200
                    ${isLight ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-amber-800/40 dark:bg-amber-950/50'}
                    ${isSelected ? 'ring-4 ring-primary ring-inset' : ''}
                    hover:brightness-110
                  `}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                >
                  {renderPiece(piece)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
