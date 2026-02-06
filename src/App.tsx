import { useState } from 'react';
import type { GameType } from '@/types/game-types';
import Home from '@/components/Home';
import TicTacToe from '@/components/TicTacToe';
import Sudoku from '@/components/Sudoku';
import Chess from '@/components/Chess';

function App() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleSelectGame = (gameId: GameType) => {
    setCurrentGame(gameId);
  };

  const handleBackToHome = () => {
    setCurrentGame(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {!currentGame && <Home onSelectGame={handleSelectGame} />}
      {currentGame === 'tictactoe' && <TicTacToe onBack={handleBackToHome} />}
      {currentGame === 'sudoku' && <Sudoku onBack={handleBackToHome} />}
      {currentGame === 'chess' && <Chess onBack={handleBackToHome} />}
    </div>
  );
}

export default App;
