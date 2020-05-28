import { shuffle, isEqual } from "lodash";

const isSet = (cards: Card[]) => cards.every( (card, i, arr) => card.equals(arr[0]));
const isRun = (cards: Card[]) => false;

const removeCard = (cards: Card[], card: Card): Card => {
    let iCard = cards.indexOf(card);
    if (iCard < 0) {
        const cardsStr = cards.map(c => c.toString()).join(", ");
        console.error(`Card ${card.toString()} not found in collection [${cardsStr}]`);
        iCard = 0;
    }
    return cards.splice(iCard, 1)[0];
}

const drawCard = (G, ctx, pile: "draw" | "discard") => {
    const deck = pile === "draw" ?
        G.drawDeck :
        G.discardPile;
    G.hands[ctx.currentPlayer].push(deck.pop());
};

const discard = (G, ctx, card: Card) => {
    const playerHand = G.hands[ctx.currentPlayer] as Card[];
    const removedCard = removeCard(playerHand, card);
    G.discardPile.push(removedCard);
};

const layDownPhaze = (G, ctx, cards: Card[][]) => {
    const playerHand = G.hands[ctx.currentPlayer] as Card[];
    G.phaseSpots[ctx.currentPlayer] = cards
        .map((collection: Card[]) =>
            collection.map((card: Card) => removeCard(playerHand, card))
        );
    G.phazes[ctx.currentPlayer]++;
};

const addCardToPlayerPhase = (G, ctx, card: Card, targetPlayer: number, targetGroup: number) => {
    const playerHand = G.hands[ctx.currentPlayer] as Card[];
    const removedCard = removeCard(playerHand, card);
    G.phaseSpots[targetPlayer][targetGroup].push(removedCard);
};

export enum Color { Yellow, Blue, Red, Green };

export class Card {
    color: Color;
    private _value: number;

    constructor(value: number, color: Color) {
        this.color = color;
        this._value = value;
    }

    get value(): string {
        if (this.wild) return "wild";
        if (this.skip) return "skip";
        return String(this._value);
    }

    get wild() {
        return this._value === 13;
    };

    get skip() {
        return this._value === 14;
    }

    equals(card: Card) {
        if(this.wild || card.wild) return true;
        if(this.skip && card.skip) return true;
        return this.value === card.value && this.color === card.color;
    }

    toString() {
        if (this.wild) return "wild";
        if (this.skip) return "skip";
        return `${this.color} ${this._value}`;
    }
}

function* combinations(arrOfArr: any[][]) {
    let [head, ...tail] = arrOfArr
    let remainder: any = tail.length ? combinations(tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
}

const numbers = Array.from({ length: 14 }, (x, i) => i);
const colors = [Color.Yellow, Color.Blue, Color.Red, Color.Green];
const numberColorCombos = [...combinations([numbers, colors])];

const setupDeck = (ctx) => {
    // Shuffle the deck of cards
    const drawDeck: Card[] = shuffle(numberColorCombos.map(pair => new Card(pair[0] as number, pair[1] as Color)));
    // deal the inital hands
    const hands = Array(ctx.numPlayers).map(() => drawDeck.splice(0, 10))
    // start the discard pile.
    let iterations = 0;
    let card = drawDeck.pop();
    // can't start the discard pile with a wild/skip card.
    while ((card.wild || card.skip) && iterations < drawDeck.length) {
        drawDeck.push(card);
        card = drawDeck.pop();
    };

    const discardPile = [card];
    return {
        drawDeck,
        hands,
        discardPile,
    }
}

export const Phase10 = {
    setup: ctx => {
        const {drawDeck, hands, discardPile } = setupDeck(ctx);
        // setup the space for putting down your phase cards
        const phaseSpots = Array(ctx.numPlayers).fill(null);
        const phazes = Array(ctx.numPlayers).fill(0);
        return {
            drawDeck,
            discardPile,
            hands,
            phaseSpots,
            phazes,
            addCardToPlayerPhase,
        };
    },

    moves: {
        drawCard,
        discard,
        layDownPhaze,
    },

    phases: {
        deal: {

        },

        draw: {
            moves: { drawCard },
            start: true,
            endIf: G => (G.drawDeck <= 0),
            next: 'play'
        },

        play: {
            moves: { discard, layDownPhaze, addCardToPlayerPhase },
        },

        

    },

    minPlayers: 2,
    maxPlayers: 6,

    endIf: (G, ctx) => {
        if (G.phazes[ctx.currentPlayer] >= 9 && G.hands[ctx.currentPlayer].length === 0)
            return { winner: ctx.currentPlayer };
    },
}