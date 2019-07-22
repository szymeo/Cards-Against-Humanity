import { ArraySchema } from '@colyseus/schema';

import { Card } from './schemas/Card';
import cardsDb from './data';

export const noop = () => {};

export const switchCase = actionsWithHandlers => action => actionsWithHandlers[action] || noop;

export const pickRandomCard = (type: 'main' | 'hand') => {
    let cardContext = { text: null, pick: 0 };
    const mainCards = cardsDb.mainCards.filter(v => v.pick === 1); // !todo more than 1 to fill
    const handCards = cardsDb.handCards;
    const cardsArr = type === 'main' ? mainCards : handCards;
    const randomChoice = cardsArr[~~(Math.random() * cardsArr.length)];

    if (type === 'main') {
        cardContext = (<any>randomChoice)
    } else {
        cardContext.text = randomChoice; // bcs array of strings if hand card
    }

    return cardContext;
}

export const generateCardsArraySchema = (type: 'main' | 'hand', length: number = 1) => new ArraySchema(...new Array(length)
    .fill(0)
    .map(() => {
        const card = new Card();
        const { text, pick } = pickRandomCard(type);

        card.text = text;
        card.pick = pick;

        return card;
    }))

export const randomItem = array => array[Math.floor(Math.random() * array.length)]