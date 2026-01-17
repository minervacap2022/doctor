import React from 'react';
// Toggle between original game and new medical career game
// import Game from './components/game/Game';  // Original emergency med simulator
import MedicalCareerGame from './components/game/MedicalCareerGame';  // New medical career game

function App() {
  return (
    <div className="App min-h-screen overflow-x-hidden">
      <MedicalCareerGame />
    </div>
  );
}

export default App;
