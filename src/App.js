import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Phase10 } from './shared/Phase10';
import { Phase10Board } from './Phase10Board';


const Phase10Client = Client({
  game: Phase10,
  board: Phase10Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
});

const App = () => (
  <div>
    <Phase10Client playerID="0" />
  </div>
);

export default App;