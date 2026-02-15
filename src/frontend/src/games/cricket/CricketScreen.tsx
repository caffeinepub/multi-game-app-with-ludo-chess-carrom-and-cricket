import { useState } from 'react';
import GameShell from '@/screens/GameShell';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { initializeMatch, playBall, type CricketMatchState } from './cricketEngine';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetMyStats, useUpdateMyStats } from '@/hooks/useUserStats';

interface CricketScreenProps {
  onBackToHome: () => void;
}

const SHOT_CHOICES = [
  { label: 'Defensive', value: 'defensive', risk: 0.1 },
  { label: 'Singles', value: 'singles', risk: 0.3 },
  { label: 'Boundaries', value: 'boundaries', risk: 0.6 },
  { label: 'Big Hit', value: 'big', risk: 0.8 },
];

export default function CricketScreen({ onBackToHome }: CricketScreenProps) {
  const [overs, setOvers] = useState<number>(5);
  const [matchState, setMatchState] = useState<CricketMatchState | null>(null);
  const [selectedShot, setSelectedShot] = useState<string>('singles');

  const { identity } = useInternetIdentity();
  const { data: stats } = useGetMyStats();
  const updateStats = useUpdateMyStats();

  const startNewMatch = () => {
    setMatchState(initializeMatch(overs));
  };

  const handlePlayBall = () => {
    if (!matchState || matchState.matchOver) return;

    const newState = playBall(matchState, selectedShot);
    setMatchState(newState);

    if (newState.matchOver && identity && stats) {
      const team1Won = newState.innings[0].runs > (newState.innings[1]?.runs || 0);
      const updatedStats = { ...stats };
      updatedStats.gameMode4 = {
        ...updatedStats.gameMode4,
        gamesPlayed: updatedStats.gameMode4.gamesPlayed + BigInt(1),
        wins: updatedStats.gameMode4.wins + (team1Won ? BigInt(1) : BigInt(0)),
        losses: updatedStats.gameMode4.losses + (!team1Won ? BigInt(1) : BigInt(0)),
        bestScore: BigInt(Math.max(Number(updatedStats.gameMode4.bestScore), newState.innings[0].runs)),
      };
      updateStats.mutate(updatedStats);
    }
  };

  if (!matchState) {
    return (
      <GameShell
        title="Cricket"
        icon="/assets/generated/cricket-icon.dim_512x512.png"
        onBackToHome={onBackToHome}
      >
        <div className="max-w-md mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Start New Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Overs per Innings</label>
                <Select value={overs.toString()} onValueChange={(v) => setOvers(Number(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Overs</SelectItem>
                    <SelectItem value="5">5 Overs</SelectItem>
                    <SelectItem value="10">10 Overs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                <p className="font-medium">How to Play:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Choose your batting strategy each ball</li>
                  <li>Riskier shots = more runs but higher chance of getting out</li>
                  <li>Defend to preserve wickets</li>
                  <li>Score more runs than your opponent to win!</li>
                </ul>
              </div>
              <Button onClick={startNewMatch} className="w-full gap-2">
                <Play className="w-4 h-4" />
                Start Match
              </Button>
            </CardContent>
          </Card>
        </div>
      </GameShell>
    );
  }

  const currentInnings = matchState.innings[matchState.currentInnings];
  const isInningsOver = currentInnings.wickets >= 10 || currentInnings.balls >= matchState.totalBalls;

  return (
    <GameShell
      title="Cricket"
      icon="/assets/generated/cricket-icon.dim_512x512.png"
      onBackToHome={onBackToHome}
      actions={
        <Button onClick={startNewMatch} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Match
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Scoreboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Scoreboard</span>
              <Badge>
                Innings {matchState.currentInnings + 1} of 2
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {matchState.innings.map((innings, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    idx === matchState.currentInnings && !matchState.matchOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <div className="text-sm text-muted-foreground mb-2">
                    Team {idx + 1}
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {innings.runs}/{innings.wickets}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(innings.balls / 6)}.{innings.balls % 6} overs
                  </div>
                </div>
              ))}
            </div>

            {matchState.currentInnings === 1 && matchState.innings[1] && (
              <div className="mt-4 p-3 bg-muted rounded-lg text-center">
                <span className="text-sm font-medium">
                  Target: {matchState.innings[0].runs + 1} runs
                </span>
                <span className="text-sm text-muted-foreground ml-3">
                  Need {matchState.innings[0].runs + 1 - matchState.innings[1].runs} runs
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Match result */}
        {matchState.matchOver && (
          <Card className="border-primary">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                {matchState.winner === 0
                  ? '🎉 Team 1 Wins!'
                  : matchState.winner === 1
                  ? '🎉 Team 2 Wins!'
                  : "It's a Tie!"}
              </h2>
              <p className="text-muted-foreground mb-4">
                Final Score: {matchState.innings[0].runs}/{matchState.innings[0].wickets} vs{' '}
                {matchState.innings[1]?.runs || 0}/{matchState.innings[1]?.wickets || 0}
              </p>
              <Button onClick={startNewMatch} className="gap-2">
                <Play className="w-4 h-4" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Innings over message */}
        {!matchState.matchOver && isInningsOver && (
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-bold mb-2">Innings Over!</h3>
              <p className="text-muted-foreground mb-4">
                Team {matchState.currentInnings + 1} scored {currentInnings.runs} runs
              </p>
              <Button onClick={handlePlayBall} className="gap-2">
                Start Innings 2
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Batting controls */}
        {!matchState.matchOver && !isInningsOver && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Shot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {SHOT_CHOICES.map((shot) => (
                  <Button
                    key={shot.value}
                    variant={selectedShot === shot.value ? 'default' : 'outline'}
                    onClick={() => setSelectedShot(shot.value)}
                    className="h-auto py-4 flex flex-col items-start"
                  >
                    <span className="font-semibold">{shot.label}</span>
                    <span className="text-xs opacity-70">
                      Risk: {Math.round(shot.risk * 100)}%
                    </span>
                  </Button>
                ))}
              </div>

              <Button onClick={handlePlayBall} className="w-full gap-2" size="lg">
                <Trophy className="w-5 h-5" />
                Play Ball
              </Button>

              {matchState.lastBallResult && (
                <div className="p-3 bg-muted rounded-lg text-center">
                  <span className="font-medium">{matchState.lastBallResult}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!identity && (
          <p className="text-center text-sm text-muted-foreground">
            Login to track your cricket stats
          </p>
        )}
      </div>
    </GameShell>
  );
}
