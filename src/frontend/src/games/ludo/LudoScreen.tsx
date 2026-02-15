import { useState, useEffect } from 'react';
import GameShell from '@/screens/GameShell';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dices, RotateCcw, Play } from 'lucide-react';
import LudoBoard from './LudoBoard';
import { initializeGame, rollDice, movePiece, checkWinner, type LudoGameState } from './ludoRules';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetMyStats, useUpdateMyStats } from '@/hooks/useUserStats';

interface LudoScreenProps {
  onBackToHome: () => void;
}

export default function LudoScreen({ onBackToHome }: LudoScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [gameState, setGameState] = useState<LudoGameState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const { identity } = useInternetIdentity();
  const { data: stats } = useGetMyStats();
  const updateStats = useUpdateMyStats();

  const startNewGame = () => {
    setGameState(initializeGame(playerCount));
    setSelectedPiece(null);
    setDiceRoll(null);
  };

  const handleRollDice = () => {
    if (!gameState || gameState.winner !== null) return;
    setIsRolling(true);
    setSelectedPiece(null);

    setTimeout(() => {
      const roll = rollDice();
      setDiceRoll(roll);
      setIsRolling(false);
    }, 500);
  };

  const handlePieceClick = (pieceIndex: number) => {
    if (!gameState || !diceRoll || gameState.winner !== null) return;

    const newState = movePiece(gameState, pieceIndex, diceRoll);
    if (newState !== gameState) {
      setGameState(newState);
      setDiceRoll(null);
      setSelectedPiece(null);

      const winner = checkWinner(newState);
      if (winner !== null && identity && stats) {
        const updatedStats = { ...stats };
        updatedStats.gameMode1 = {
          ...updatedStats.gameMode1,
          gamesPlayed: updatedStats.gameMode1.gamesPlayed + BigInt(1),
          wins: updatedStats.gameMode1.wins + (winner === 0 ? BigInt(1) : BigInt(0)),
          losses: updatedStats.gameMode1.losses + (winner !== 0 ? BigInt(1) : BigInt(0)),
        };
        updateStats.mutate(updatedStats);
      }
    }
  };

  if (!gameState) {
    return (
      <GameShell
        title="Ludo"
        icon="/assets/generated/ludo-icon.dim_512x512.png"
        onBackToHome={onBackToHome}
        glassHeader
      >
        <div className="ludo-glass-container">
          <div className="max-w-md mx-auto mt-12">
            <Card className="glass-panel border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Dices className="w-5 h-5 text-primary" />
                  Start New Game
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">Number of Players</label>
                  <Select value={playerCount.toString()} onValueChange={(v) => setPlayerCount(Number(v))}>
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Players</SelectItem>
                      <SelectItem value="3">3 Players</SelectItem>
                      <SelectItem value="4">4 Players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={startNewGame} className="w-full gap-2 glass-button">
                  <Play className="w-4 h-4" />
                  Start Game
                </Button>
                {!identity && (
                  <p className="text-xs text-white/70 text-center">
                    Login to track your stats
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </GameShell>
    );
  }

  const currentPlayerColor = ['red', 'blue', 'green', 'yellow'][gameState.currentPlayer];

  return (
    <GameShell
      title="Ludo"
      icon="/assets/generated/ludo-icon.dim_512x512.png"
      onBackToHome={onBackToHome}
      glassHeader
      actions={
        <Button onClick={startNewGame} variant="outline" size="sm" className="gap-2 glass-button-outline">
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      }
    >
      <div className="ludo-glass-container">
        <div className="max-w-4xl mx-auto">
          {gameState.winner !== null ? (
            <Card className="mb-6 glass-panel border-white/30">
              <CardContent className="pt-6 text-center">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  🎉 Player {gameState.winner + 1} Wins!
                </h2>
                <Button onClick={startNewGame} className="mt-4 gap-2 glass-button">
                  <Play className="w-4 h-4" />
                  Play Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 glass-panel border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      className="capitalize text-white font-semibold"
                      style={{
                        backgroundColor: currentPlayerColor,
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      Player {gameState.currentPlayer + 1}
                    </Badge>
                    <span className="text-sm text-white/80">Current Turn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {diceRoll && (
                      <Badge variant="outline" className="text-lg px-4 py-2 glass-badge border-white/30 text-white">
                        🎲 {diceRoll}
                      </Badge>
                    )}
                    <Button
                      onClick={handleRollDice}
                      disabled={isRolling || !!diceRoll}
                      className="gap-2 glass-button"
                    >
                      <Dices className="w-4 h-4" />
                      {isRolling ? 'Rolling...' : 'Roll Dice'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <LudoBoard
            gameState={gameState}
            selectedPiece={selectedPiece}
            onPieceClick={handlePieceClick}
            canMove={!!diceRoll && gameState.winner === null}
          />
        </div>
      </div>
    </GameShell>
  );
}
