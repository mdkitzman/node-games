import React from 'react';
import { Card } from './shared/card';

export class Phase10Board extends React.Component {
  draw(deck) {
    this.props.moves.drawCard(deck)
  }

  discard(card) {
    this.props.moves.discard(card);
  }

  render() {
    const cardStyle = {
      border: '1px solid #555',
      minWidth: '80px',
      height: '100px',
      textAlign: 'center',
      cursor: 'pointer',
      display: 'inline-block',
      margin: '10px',
      borderRadius: '4px',
    };

    let playerHand = [];
    const hand = this.props.G.players[this.props.ctx.currentPlayer].hand;
    for (let i = 0; i < hand.length; i++) {
      const card = new Card(hand[i]._value, hand[i].color);
      const thisCardStyle = {
        ...cardStyle,
        backgroundColor: card.color,
        fontSize: '3em',
      };
      playerHand.push(
        <div style={thisCardStyle} id={card.id} onClick={() => this.discard(hand[i])}>
          {card.value}
        </div>
      );
    }
    const discardCard = this.props.G.discardPile[this.props.G.discardPile.length-1];
    const topDiscardCard = new Card(discardCard._value, discardCard.color);
    const discardStyle = {
      ...cardStyle,
      backgroundColor: topDiscardCard.color,
      fontSize: '3em',
    }

    return (
      <div>
        <div>
          <div style={cardStyle} onClick={() => this.draw("drawPile")}>
            Draw Pile<br/>
            Size: {this.props.G.drawPile.length}
          </div>
          <div style={discardStyle} onClick={() => this.draw("discard")}>
            {topDiscardCard.value}
          </div>
        </div>
        <div>
          Player {this.props.ctx.currentPlayer}: {playerHand.length} cards<br/>
          {playerHand}
        </div>
      </div>
    );
  }
}