import React from 'react';
import { CardUI } from './Card';
import { Card } from './shared/card';

export class PlayerHand extends React.Component {
  
  discard(card) {
    this.props.moves.discard(card);
  }

  render() {
    const hand = this.props.hand;
    const cards = [];
    for (let i = 0; i < hand.length; i++) {
      const card = new Card(hand[i]._value, hand[i].color);
      cards.push(
        <CardUI card={card} faceUp={true} key={card.id} onClick={() => this.discard(card)} />
      );
    }

    return (
      <div>{cards}</div>
    );
  }
}