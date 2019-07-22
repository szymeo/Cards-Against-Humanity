import { MapSchema, Schema, type, ArraySchema } from '@colyseus/schema';

import { RoundStatus } from '../typings/RoundStatus';
import { pickRandomCard } from '../utils';
import { Card } from './card';
import { Move } from './Move';
import { Player } from './Player';
import { RoundChoice } from '../typings/RoundChoice';

export class Round extends Schema {
    @type({ map: Move })
    moves = new MapSchema<Move>();

    @type(Card)
    mainCard = {};
    
    @type(Player)
    winner = null;

    @type('string') // round master session id
    master = null;

    @type('number')
    choicesDone: number = 0;

    @type(['string'])
    alreadyVoted: ArraySchema<string>;

    @type('string')
    status: RoundStatus = 'created';

    constructor() {
        super();
        this.setMainCard();
    }

    public setRoundChoices(choices: RoundChoice[]) {
        const o = new MapSchema();

        choices.forEach((choice) => {
            const move = new Move();
            const votes = new ArraySchema();
            const { sessionId, cards } = choice;

            move.cards = cards;
            move.votes = votes;
            o[sessionId] = move;
        })

        this.moves = o;
    }

    private setMainCard() {
        const card = new Card();
        const { text, pick } = pickRandomCard('main');

        card.text = text;
        card.pick = pick;

        this.mainCard = card;
    }
}