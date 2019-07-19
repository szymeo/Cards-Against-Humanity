import { Card } from './Card';

export class Move {
    cards: Card[];
    votes: string[] = [];

    constructor({ cards }) {
        this.cards = cards;
    }
}