import React from 'react';
import './Card.css';
import { Card } from './shared/card';

export class CardUI extends React.Component {
    render() {
        const card = new Card(this.props.card._value, this.props.card.color);
        const cardClass = ['card', this.props.faceUp ? 'face-up' : '', this.props.faceUp ? card.color : ''].join(' ').trim();
        const displayText = this.props.text || card.value;
        return (<div className={cardClass} onClick={this.props.onClick}>{displayText}</div>);
    }
}