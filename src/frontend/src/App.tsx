import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LudoScreen from './games/ludo/LudoScreen';
import ChessScreen from './games/chess/ChessScreen';
import CarromScreen from './games/carrom/CarromScreen';

export type GameMode = 'home' | 'ludo' | 'chess' | 'carrom';

export default function App() {
  const [currentView, setCurrentView] = useState<GameMode>('home');

  const navigateToGame = (game: GameMode) => {
    setCurrentView(game);
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentView === 'home' && <HomeScreen onSelectGame={navigateToGame} />}
      {currentView === 'ludo' && <LudoScreen onBackToHome={navigateToHome} />}
      {currentView === 'chess' && <ChessScreen onBackToHome={navigateToHome} />}
      {currentView === 'carrom' && <CarromScreen onBackToHome={navigateToHome} />}
    </div>
  );
}
