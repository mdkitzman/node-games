// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const rowMatch = iRow => cells[iRow * 3] !== null && cells[iRow * 3] === cells[iRow * 3 + 1] && cells[iRow * 3 + 1] === cells[iRow * 3 + 2];
  const colMatch = iCol => cells[iCol] != null && cells[iCol] === cells[iCol + 3] && cells[iCol + 3] === cells[iCol + 6];
  const diagMatch = () =>
    (cells[0] !== null && cells[0] === cells[4] && cells[4] === cells[8]) ||
    (cells[2] !== null && cells[2] === cells[4] && cells[4] === cells[6])
  return rowMatch(0) || rowMatch(1) || rowMatch(2) ||
    colMatch(0) || colMatch(1) || colMatch(2) ||
    diagMatch();
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

export const TicTacToe = {
  
  setup: () => ({ cells: Array(9).fill(null) }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    },
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },

  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },
};
