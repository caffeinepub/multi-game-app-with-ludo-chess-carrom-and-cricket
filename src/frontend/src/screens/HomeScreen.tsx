import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/auth/LoginButton';
import StatsSummary from '@/components/stats/StatsSummary';
import QuickPlayMenu from '@/components/home/QuickPlayMenu';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Dices, Crown, Target, Trophy } from 'lucide-react';
import type { GameMode } from '../App';

interface HomeScreenProps {
  onSelectGame: (game: GameMode) => void;
}

const games = [
  {
    id: 'ludo' as GameMode,
    name: 'Ludo',
    description: 'Classic board game for 2-4 players',
    icon: '/assets/generated/ludo-icon.dim_512x512.png',
    IconComponent: Dices,
    color: 'text-chart-1',
  },
  {
    id: 'chess' as GameMode,
    name: 'Chess',
    description: 'Strategic two-player battle',
    icon: '/assets/generated/chess-icon.dim_512x512.png',
    IconComponent: Crown,
    color: 'text-chart-2',
  },
  {
    id: 'carrom' as GameMode,
    name: 'Carrom',
    description: 'Flick and pocket coins',
    icon: '/assets/generated/carrom-icon.dim_512x512.png',
    IconComponent: Target,
    color: 'text-chart-3',
  },
  {
    id: 'cricket' as GameMode,
    name: 'Cricket',
    description: 'Hit runs and take wickets',
    icon: '/assets/generated/cricket-icon.dim_512x512.png',
    IconComponent: Trophy,
    color: 'text-chart-4',
  },
];

export default function HomeScreen({ onSelectGame }: HomeScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Game Arcade</h1>
              <p className="text-xs text-muted-foreground">Choose your adventure</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="text-center md:text-left space-y-6">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    LUDO GAME
                    <br />
                    <span className="text-primary">SOURCE CODE</span>
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                    Ludo Game Development | Multiplayer Ludo Script
                  </p>
                </div>
                <p className="text-base text-muted-foreground max-w-md">
                  Launch your own multiplayer Ludo game platform with our premium source code. 
                  Four classic games in one place. Play solo or with friends on the same device.
                </p>
                {!isAuthenticated && (
                  <Badge variant="outline" className="text-sm py-2 px-4">
                    Login to track your stats and achievements
                  </Badge>
                )}
              </div>

              {/* Right: Hero Phone Image */}
              <div className="flex justify-center md:justify-end">
                <div className="relative w-full max-w-md">
                  <img
                    src="/assets/generated/home-hero-phone.dim_900x900.png"
                    alt="Ludo Game on Mobile"
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Quick Play Menu */}
        <QuickPlayMenu onSelectGame={onSelectGame} />

        {/* Stats summary */}
        {isAuthenticated && (
          <div className="mb-12">
            <StatsSummary />
          </div>
        )}

        {/* Game selection grid */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold tracking-tight mb-2">All Games</h3>
            <p className="text-muted-foreground">Choose from our collection of classic games</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="game-card-hover cursor-pointer border-2 hover:border-primary/50 overflow-hidden transition-all"
                onClick={() => onSelectGame(game.id)}
              >
                <CardHeader className="pb-4">
                  <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-muted/30">
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <game.IconComponent className={`absolute bottom-3 right-3 w-8 h-8 ${game.color}`} />
                  </div>
                  <CardTitle className="text-xl">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tap to play</span>
                    <span className="text-primary">→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Game Arcade • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
