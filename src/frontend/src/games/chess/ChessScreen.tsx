import { useState } from 'react';
import GameShell from '@/screens/GameShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, RotateCcw, Flag } from 'lucide-react';
import ChessBoard from './ChessBoard';
import { initializeGame, makeMove, isInCheck, isCheckmate, type ChessGameState } from './chessRules';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetMyStats, useUpdateMyStats } from '@/hooks/useUserStats';

interface ChessScreenProps {
  onBackToHome: () => void;
}

export default function ChessScreen({ onBackToHome }: ChessScreenProps) {
  const [gameState, setGameState] = useState<ChessGameState>(initializeGame());
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);

  const { identity } = useInternetIdentity();
  const { data: stats } = useGetMyStats();
  const updateStats = useUpdateMyStats();

  const handleSquareClick = (row: number, col: number) => {
    if (gameState.gameOver) return;

    if (!selectedSquare) {
      const piece = gameState.board[row][col];
      if (piece && piece.color === gameState.currentPlayer) {
        setSelectedSquare([row, col]);
      }
    } else {
      const [fromRow, fromCol] = selectedSquare;
      const newState = makeMove(gameState, fromRow, fromCol, row, col);

      if (newState !== gameState) {
        setGameState(newState);

        if (newState.gameOver && identity && stats) {
          const winner = newState.currentPlayer === 'white' ? 'black' : 'white';
          const updatedStats = { ...stats };
          updatedStats.gameMode2 = {
            ...updatedStats.gameMode2,
            gamesPlayed: updatedStats.gameMode2.gamesPlayed + BigInt(1),
            wins: updatedStats.gameMode2.wins + (winner === 'white' ? BigInt(1) : BigInt(0)),
            losses: updatedStats.gameMode2.losses + (winner === 'black' ? BigInt(1) : BigInt(0)),
          };
          updateStats.mutate(updatedStats);
        }
      }
      setSelectedSquare(null);
    }
  };

  const handleResign = () => {
    if (identity && stats) {
      const updatedStats = { ...stats };
      updatedStats.gameMode2 = {
        ...updatedStats.gameMode2,
        gamesPlayed: updatedStats.gameMode2.gamesPlayed + BigInt(1),
        losses: updatedStats.gameMode2.losses + BigInt(1),
      };
      updateStats.mutate(updatedStats);
    }
    setGameState({ ...gameState, gameOver: true });
  };

  const handleNewGame = () => {
    setGameState(initializeGame());
    setSelectedSquare(null);
  };

  const inCheck = isInCheck(gameState, gameState.currentPlayer);
  const checkmate = isCheckmate(gameState);

  return (
    <GameShell
      title="Chess"
      icon="/assets/generated/chess-icon.dim_512x512.png"
      onBackToHome={onBackToHome}
      actions={
        <>
          {!gameState.gameOver && (
            <Button onClick={handleResign} variant="outline" size="sm" className="gap-2">
              <Flag className="w-4 h-4" />
              Resign
            </Button>
          )}
          <Button onClick={handleNewGame} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={gameState.currentPlayer === 'white' ? 'default' : 'secondary'}>
                  {gameState.currentPlayer === 'white' ? '⚪ White' : '⚫ Black'} to move
                </Badge>
                {inCheck && !checkmate && (
                  <Badge variant="destructive">Check!</Badge>
                )}
                {checkmate && (
                  <Badge variant="destructive">Checkmate!</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Move {Math.floor(gameState.moveCount / 2) + 1}
              </div>
            </div>
          </CardContent>
        </Card>

        {gameState.gameOver && (
          <Card className="mb-6 border-primary">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                {checkmate
                  ? `🎉 ${gameState.currentPlayer === 'white' ? 'Black' : 'White'} Wins by Checkmate!`
                  : 'Game Over'}
              </h2>
              <Button onClick={handleNewGame} className="mt-4 gap-2">
                <Crown className="w-4 h-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        <ChessBoard
          gameState={gameState}
          selectedSquare={selectedSquare}
          onSquareClick={handleSquareClick}
        />

        {!identity && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Login to track your chess stats
          </p>
        )}
      </div>
    </GameShell>
  );
}
