import { useState } from 'react';
import type { GameType } from '@/types/game-types';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import ProfileSelect from '@/components/ProfileSelect';
import Home from '@/components/Home';
import TicTacToe from '@/components/TicTacToe';
import Sudoku from '@/components/Sudoku';
import Chess from '@/components/Chess';

function AppContent() {
  const { currentProfile } = useProfile();
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [showProfileSelect, setShowProfileSelect] = useState(false);

  const handleSelectGame = (gameId: GameType) => {
    setCurrentGame(gameId);
  };

  const handleBackToHome = () => {
    setCurrentGame(null);
  };

  const handleProfileClick = () => {
    setShowProfileSelect(true);
  };

  const handleProfileSelected = () => {
    setShowProfileSelect(false);
  };

  if (!currentProfile) {
    return <ProfileSelect onProfileSelected={handleProfileSelected} />;
  }

  if (showProfileSelect) {
    return <ProfileSelect onProfileSelected={handleProfileSelected} />;
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {!currentGame && <Home onSelectGame={handleSelectGame} onProfileClick={handleProfileClick} />}
      {currentGame === 'tictactoe' && <TicTacToe onBack={handleBackToHome} />}
      {currentGame === 'sudoku' && <Sudoku onBack={handleBackToHome} />}
      {currentGame === 'chess' && <Chess onBack={handleBackToHome} />}
    </div>
  );
}

function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}

export default App;
