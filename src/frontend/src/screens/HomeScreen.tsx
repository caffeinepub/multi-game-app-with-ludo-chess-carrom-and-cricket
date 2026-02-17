import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoginButton from '@/components/auth/LoginButton';
import StatsSummary from '@/components/stats/StatsSummary';
import QuickPlayMenu from '@/components/home/QuickPlayMenu';
import HomeBannerCarousel from '@/components/home/HomeBannerCarousel';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Trophy, Sparkles } from 'lucide-react';
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
    gradient: 'from-chart-1/20 to-chart-1/5',
  },
  {
    id: 'chess' as GameMode,
    name: 'Chess',
    description: 'Strategic two-player battle',
    icon: '/assets/generated/chess-icon.dim_512x512.png',
    gradient: 'from-chart-2/20 to-chart-2/5',
  },
  {
    id: 'carrom' as GameMode,
    name: 'Carrom',
    description: 'Flick and pocket coins',
    icon: '/assets/generated/carrom-icon.dim_512x512.png',
    gradient: 'from-chart-3/20 to-chart-3/5',
  },
];

export default function HomeScreen({ onSelectGame }: HomeScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/95 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
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

      {/* Banner Carousel */}
      <HomeBannerCarousel />

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        {/* Quick Play Menu */}
        <QuickPlayMenu onSelectGame={onSelectGame} />

        {/* Stats summary */}
        {isAuthenticated && (
          <div className="mb-12">
            <StatsSummary />
          </div>
        )}

        {!isAuthenticated && (
          <div className="mb-12 text-center">
            <Badge variant="outline" className="text-sm py-2 px-4 gap-2">
              <Sparkles className="w-4 h-4" />
              Login to track your stats and achievements
            </Badge>
          </div>
        )}

        {/* Game selection grid */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold tracking-tight mb-2">All Games</h3>
            <p className="text-muted-foreground text-lg">Choose from our collection of classic games</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {games.map((game) => (
              <Card
                key={game.id}
                className="game-card-hover cursor-pointer border-2 hover:border-primary/50 overflow-hidden transition-all group"
                onClick={() => onSelectGame(game.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-br ${game.gradient} shadow-inner`}>
                    <img
                      src={game.icon}
                      alt={game.name}
                      className="w-full h-full object-cover p-6 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardTitle className="text-xl">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tap to play</span>
                    <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/95 mt-12">
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
