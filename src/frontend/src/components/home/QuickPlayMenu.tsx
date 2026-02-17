import { Button } from '@/components/ui/button';
import type { GameMode } from '../../App';

interface QuickPlayMenuProps {
  onSelectGame: (game: GameMode) => void;
}

const quickPlayGames = [
  {
    id: 'ludo' as GameMode,
    name: 'Ludo',
    icon: '/assets/generated/ludo-icon.dim_512x512.png',
    bgGradient: 'from-chart-1/20 to-chart-1/5',
    borderColor: 'hover:border-chart-1/50',
  },
  {
    id: 'chess' as GameMode,
    name: 'Chess',
    icon: '/assets/generated/chess-icon.dim_512x512.png',
    bgGradient: 'from-chart-2/20 to-chart-2/5',
    borderColor: 'hover:border-chart-2/50',
  },
  {
    id: 'carrom' as GameMode,
    name: 'Carrom',
    icon: '/assets/generated/carrom-icon.dim_512x512.png',
    bgGradient: 'from-chart-3/20 to-chart-3/5',
    borderColor: 'hover:border-chart-3/50',
  },
];

export default function QuickPlayMenu({ onSelectGame }: QuickPlayMenuProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold tracking-tight mb-2">Quick Play</h3>
        <p className="text-muted-foreground text-lg">Jump straight into your favorite game</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickPlayGames.map((game) => (
          <Button
            key={game.id}
            variant="outline"
            onClick={() => onSelectGame(game.id)}
            className={`quick-play-card h-auto p-0 flex flex-col items-center border-2 transition-all ${game.borderColor} hover:shadow-xl overflow-hidden group`}
            aria-label={`Play ${game.name}`}
          >
            <div className={`w-full aspect-square relative bg-gradient-to-br ${game.bgGradient} overflow-hidden`}>
              <img
                src={game.icon}
                alt={game.name}
                className="w-full h-full object-cover p-8 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="w-full py-6 px-4 bg-card">
              <span className="font-bold text-xl">{game.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
