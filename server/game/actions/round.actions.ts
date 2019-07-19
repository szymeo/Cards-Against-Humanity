const scope: string = 'ROUND';

export const setHandCards = (client, cards): any => ({
    type: 'SET_HAND_CARDS',
    id: client.sessionId,
    scope,
    cards
});

export const setMaster = (client): any => ({
    type: 'SET_MASTER',
    id: client.sessionId,
    scope,
})

export const showChoices = (client, choices) => ({
    type: 'SHOW_CHOICES',
    id: client.sessionId,
    choices,
    scope,
});

export const showVoting = (client, choices) => ({
    type: 'SHOW_VOTING',
    choices,
    scope,
});
