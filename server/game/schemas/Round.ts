import { Card } from './Card';
import { Move } from './Move';
import { pickRandomCard } from '../utils';
import { RoundStatus } from '../typings/RoundStatus';
import { RoundChoice } from '../typings/RoundChoice';

export class Round {
    moves: { [id: string]: Move } = {}
    mainCard: Card;
    winner: string;
    master: string;
    choicesDone: number = 0;
    alreadyVoted: string[] = [];
    status: RoundStatus = 'created';

    constructor() {
        this.setMainCard();
    }

    public setRoundChoices(choices: RoundChoice[]) {
        const o = {};

        choices.forEach((choice) => {
            const { sessionId, cards } = choice;
            o[sessionId] = new Move({ cards });
        })

        this.moves = o;
    }

    private setMainCard() {
        const randomMainCard = pickRandomCard('main');
        this.mainCard = new Card(randomMainCard);
    }
}