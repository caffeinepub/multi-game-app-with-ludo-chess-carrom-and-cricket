import { Button } from '@/components/ui/button';
import { Dices, Crown, Target, Trophy } from 'lucide-react';
import type { GameMode } from '../../App';

interface QuickPlayMenuProps {
  onSelectGame: (game: GameMode) => void;
}

const quickPlayGames = [
  {
    id: 'ludo' as GameMode,
    name: 'Ludo',
    icon: Dices,
    color: 'text-chart-1',
    bgColor: 'hover:bg-chart-1/10',
  },
  {
    id: 'chess' as GameMode,
    name: 'Chess',
    icon: Crown,
    color: 'text-chart-2',
    bgColor: 'hover:bg-chart-2/10',
  },
  {
    id: 'carrom' as GameMode,
    name: 'Carrom',
    icon: Target,
    color: 'text-chart-3',
    bgColor: 'hover:bg-chart-3/10',
  },
  {
    id: 'cricket' as GameMode,
    name: 'Cricket',
    icon: Trophy,
    color: 'text-chart-4',
    bgColor: 'hover:bg-chart-4/10',
  },
];

export default function QuickPlayMenu({ onSelectGame }: QuickPlayMenuProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold tracking-tight mb-2">Quick Play</h3>
        <p className="text-muted-foreground">Jump straight into your favorite game</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickPlayGames.map((game) => (
          <Button
            key={game.id}
            variant="outline"
            size="lg"
            onClick={() => onSelectGame(game.id)}
            className={`h-auto py-8 flex flex-col items-center gap-3 border-2 transition-all ${game.bgColor} hover:border-primary/50 hover:shadow-lg`}
            aria-label={`Play ${game.name}`}
          >
            <game.icon className={`w-10 h-10 ${game.color}`} />
            <span className="font-semibold text-base">{game.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
