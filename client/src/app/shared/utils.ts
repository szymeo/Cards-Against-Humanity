
export const isPrimitive = (variable: any) => (variable !== Object(variable));

export const switchCase = (actionsWithHandlers: {[key: string]: Function}) =>
    (action: string) => actionsWithHandlers[action] || actionsWithHandlers['default'];

export const domElExists = (selector: string) => !!document.querySelector(selector);

export const removeCard = (player: any, cardIndex: number) => player.cards.splice(cardIndex, player);

export const getCurrentRound = (state: any) => [...state.rounds].pop();

export const randomIntBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const html = ([first, ...strings]: any, ...values: any) => values
    .reduce((acc: any, cur: any) => acc.concat(cur, strings.shift()), [first])
    .filter((x: any) => x && x !== true || x === 0)
    .join('');
