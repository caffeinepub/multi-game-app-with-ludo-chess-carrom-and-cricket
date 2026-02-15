import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetMyStats } from '@/hooks/useUserStats';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Target, Crown, Dices } from 'lucide-react';

const gameIcons = [
  { icon: Dices, name: 'Ludo', color: 'text-chart-1' },
  { icon: Crown, name: 'Chess', color: 'text-chart-2' },
  { icon: Target, name: 'Carrom', color: 'text-chart-3' },
  { icon: Trophy, name: 'Cricket', color: 'text-chart-4' },
];

export default function StatsSummary() {
  const { data: stats, isLoading } = useGetMyStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Play your first game to start tracking stats!
          </p>
        </CardContent>
      </Card>
    );
  }

  const gameModes = [stats.gameMode1, stats.gameMode2, stats.gameMode3, stats.gameMode4];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gameModes.map((mode, index) => {
            const { icon: Icon, name, color } = gameIcons[index];
            const winRate =
              Number(mode.gamesPlayed) > 0
                ? Math.round((Number(mode.wins) / Number(mode.gamesPlayed)) * 100)
                : 0;

            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="font-semibold text-sm">{name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Played</span>
                    <span className="font-medium">{Number(mode.gamesPlayed)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Wins</span>
                    <span className="font-medium text-primary">{Number(mode.wins)}</span>
                  </div>
                  {Number(mode.gamesPlayed) > 0 && (
                    <Badge variant="outline" className="w-full justify-center mt-2">
                      {winRate}% win rate
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
