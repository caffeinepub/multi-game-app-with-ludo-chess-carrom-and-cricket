import { useState } from 'react';
import GameShell from '@/screens/GameShell';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Target, RotateCcw, Play } from 'lucide-react';
import CarromBoardCanvas from './CarromBoardCanvas';
import { initializeGame, takeShot, type CarromGameState } from './carromPhysics';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetMyStats, useUpdateMyStats } from '@/hooks/useUserStats';

interface CarromScreenProps {
  onBackToHome: () => void;
}

export default function CarromScreen({ onBackToHome }: CarromScreenProps) {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [gameState, setGameState] = useState<CarromGameState | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [power, setPower] = useState<number>(50);
  const [isAnimating, setIsAnimating] = useState(false);

  const { identity } = useInternetIdentity();
  const { data: stats } = useGetMyStats();
  const updateStats = useUpdateMyStats();

  const startNewGame = () => {
    setGameState(initializeGame(playerCount));
    setAngle(0);
    setPower(50);
  };

  const handleShot = () => {
    if (!gameState || isAnimating || gameState.winner !== null) return;

    setIsAnimating(true);
    const newState = takeShot(gameState, angle, power);

    setTimeout(() => {
      setGameState(newState);
      setIsAnimating(false);

      if (newState.winner !== null && identity && stats) {
        const updatedStats = { ...stats };
        const maxScore = Math.max(...newState.scores);
        updatedStats.gameMode3 = {
          ...updatedStats.gameMode3,
          gamesPlayed: updatedStats.gameMode3.gamesPlayed + BigInt(1),
          wins: updatedStats.gameMode3.wins + (newState.scores[0] === maxScore ? BigInt(1) : BigInt(0)),
          losses: updatedStats.gameMode3.losses + (newState.scores[0] !== maxScore ? BigInt(1) : BigInt(0)),
          bestScore: BigInt(Math.max(Number(updatedStats.gameMode3.bestScore), newState.scores[0])),
        };
        updateStats.mutate(updatedStats);
      }
    }, 2000);
  };

  if (!gameState) {
    return (
      <GameShell
        title="Carrom"
        icon="/assets/generated/carrom-icon.dim_512x512.png"
        onBackToHome={onBackToHome}
      >
        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Start New Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Number of Players</label>
                <Select value={playerCount.toString()} onValueChange={(v) => setPlayerCount(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Players</SelectItem>
                    <SelectItem value="3">3 Players</SelectItem>
                    <SelectItem value="4">4 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                <p className="font-medium">Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Pocket coins to score points</li>
                  <li>White coins: 10 points</li>
                  <li>Black coins: 20 points</li>
                  <li>Queen (red): 50 points</li>
                  <li>First to 100 points wins!</li>
                </ul>
              </div>
              <Button onClick={startNewGame} className="w-full gap-2">
                <Play className="w-4 h-4" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Carrom"
      icon="/assets/generated/carrom-icon.dim_512x512.png"
      onBackToHome={onBackToHome}
      actions={
        <Button onClick={startNewGame} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto">
        {gameState.winner !== null ? (
          <Card className="mb-6 border-primary">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                🎉 Player {gameState.winner + 1} Wins!
              </h2>
              <p className="text-muted-foreground mb-4">
                Final Score: {gameState.scores[gameState.winner]} points
              </p>
              <Button onClick={startNewGame} className="gap-2">
                <Play className="w-4 h-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge>Player {gameState.currentPlayer + 1}'s Turn</Badge>
                <div className="flex gap-4">
                  {gameState.scores.map((score, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-muted-foreground">P{i + 1}:</span>{' '}
                      <span className="font-bold">{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Angle: {angle}°
                  </label>
                  <Slider
                    value={[angle]}
                    onValueChange={(v) => setAngle(v[0])}
                    min={0}
                    max={360}
                    step={5}
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Power: {power}%
                  </label>
                  <Slider
                    value={[power]}
                    onValueChange={(v) => setPower(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    disabled={isAnimating}
                  />
                </div>

                <Button
                  onClick={handleShot}
                  disabled={isAnimating}
                  className="w-full gap-2"
                >
                  <Target className="w-4 h-4" />
                  {isAnimating ? 'Shooting...' : 'Take Shot'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <CarromBoardCanvas
          gameState={gameState}
          angle={angle}
          power={power}
          isAnimating={isAnimating}
        />

        {!identity && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Login to track your carrom stats
          </p>
        )}
      </div>
    </GameShell>
  );
}
