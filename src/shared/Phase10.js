import { shuffle } from "lodash";
import { Card } from "./card";
import { Stage } from 'boardgame.io/core';

const numbers = Array.from({ length: 14 }, (x, i) => i);
const colors = ["yellow", "blue", "red", "green"];
const numberColorCombos = [...combinations([numbers, colors])];

const isSet = (cards) => cards.every( (card, i, arr) => card.equals(arr[0]));
const isRun = (cards) => false;

const stack = (cards) => ({
    get length() { return cards.length; },
    push(card) { cards[cards.length] = card; },
    pop() { return cards.pop(); }
});

const card = (data) => ({

});

const removeCard = (cards, card) => {
    let iCard = cards.indexOf(card);
    if (iCard < 0) {
        const cardsStr = cards.map(c => c.toString()).join(", ");
        console.error(`Card ${card.toString()} not found in collection [${cardsStr}]`);
        iCard = 0;
    }
    return cards.splice(iCard, 1)[0];
}

const drawCard = (game, ctx, pile) => {
    const deck = stack(pile === "discard" ?
        game.discardPile :
        game.drawPile);
    game.players[ctx.currentPlayer].hand.push(deck.pop());
};

const discard = (game, ctx, card) => {
    const removedCard = removeCard(game.players[ctx.currentPlayer].hand, card);
    stack(game.discardPile).push(removedCard);
    ctx.events.endTurn();
};

const layDownPhaze = (game, ctx, cards) => {
    const playerHand = game.players[ctx.currentPlayer].hand;
    game.players[ctx.currentPlayer].phazeSpots = cards
        .map((collection) => collection.map((card) => removeCard(playerHand, card)));
    game.players[ctx.currentPlayer].currentPhaze++;
};

const addCardToPlayerPhase = (game, ctx, card, targetPlayer, targetGroup) => {
    const removedCard = removeCard(game.players[ctx.currentPlayer].hand, card);
    game.players[targetPlayer].phazeSpots[targetGroup].push(removedCard);
};

function* combinations(arrOfArr) {
    let [head, ...tail] = arrOfArr
    let remainder = tail.length ? combinations(tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

const setupDeck = (ctx) => {
    // Shuffle the deck of cards
    const drawPile = shuffle(numberColorCombos.map(pair => new Card(pair[0], pair[1])));
    // start the discard pile.
    let iterations = 0;
    let card = stack(drawPile).pop();
    // can't start the discard pile with a wild/skip card.
    while ((card.wild || card.skip) && iterations < drawPile.length) {
        stack(drawPile).push(card);
        card = stack(drawPile).pop();
    };

    const discardPile = [card];
    return {
        drawPile,
        discardPile,
    }
}

export const Phase10 = {
    name: "phaze10",
    setup: (ctx) => {
        const players = Array(ctx.numPlayers).fill({
            hand: Array(0),
            phazeSpots: Array(0),
            currentPhaze: 1
        });
        return {
            ...setupDeck(ctx),
            players,
        };
    },

    turn: {
        activePlayers: { all: Stage.NULL },
        stages: {
            draw: {
                moves: { drawCard },
                next: "play"
            },
            play: {
                moves: { discard, layDownPhaze, addCardToPlayerPhase }
            }
        }        
    },

    phases: {
        deal: {
            start: true,
            onBegin: (game, ctx) => {
                // deal
                game.players.forEach(player => {
                    player.hand = game.drawPile.splice(0, 10);
                });
                ctx.events.endPhase();
            },
            next:"play"            
        },  
        play: {
            onBegin: (game, ctx) => {
                ctx.events.setStage("draw");
            },
            onEnd: (game, ctx) => {
                // Clear out player hands
                game.players.forEach(player => {
                    player.hand = Array(0);
                    player.phazeSpots = Array(0);
                });
                const {drawPile, discardPile } = setupDeck(ctx);
                game.drawPile = drawPile;
                game.discardPile = discardPile;
            },
            endIf: (game) => (game.players.filter(p => p.hand.length === 0).length >= 1),
        }
    },

    minPlayers: 2,
    maxPlayers: 6,

    endIf: (game, ctx) => {
        if (game.players[ctx.currentPlayer].currentPhaze >= 9 && game.players[ctx.currentPlayer].hand.length === 0)
            return { winner: ctx.currentPlayer };
    },
}