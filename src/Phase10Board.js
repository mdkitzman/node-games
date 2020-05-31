import React from 'react';
import { CardUI } from './Card';
import { PlayerHand } from './PlayerHand';

export class Phase10Board extends React.Component {
  
  draw(deck) {
    this.props.moves.drawCard(deck)
  }

  render() {
    const playerHand = this.props.G.players[this.props.ctx.currentPlayer].hand;
    const drawCard = this.props.G.drawPile[this.props.G.drawPile.length - 1];
    const discardCard = this.props.G.discardPile[this.props.G.discardPile.length-1];
    return (
      <div>
        <div>
          <CardUI faceUp={false} text="Draw Pile" card={drawCard} onClick={() => this.draw("drawPile")} />
          <CardUI faceUp={true} card={discardCard} onClick={() => this.draw("discard")} />
        </div>
        <div>
          Player {this.props.ctx.currentPlayer}: {playerHand.length} cards<br/>
          <PlayerHand hand={playerHand} />
        </div>
      </div>
    );
  }
}