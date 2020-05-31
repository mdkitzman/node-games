export class Card {
    color;
    _value;

    constructor(value, color) {
        this.color = color;
        this._value = value;
    }

    get value(){
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

    equals(card) {
        if(this.wild || card.wild) return true;
        if(this.skip && card.skip) return true;
        return this.value === card.value && this.color === card.color;
    }

    toString() {
        if (this.wild) return "wild";
        if (this.skip) return "skip";
        return `${this.color} ${this._value}`;
    }

    get id() {
        return `${this.color}_${this._value}`;
    }
}