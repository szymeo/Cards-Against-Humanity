
// import { Render } from '../helpers/render';
// import { CardEvents } from '../events/card.events';
import { switchCase } from '../../../shared/utils';

export const round = (state: any = {}) => (action: any) => {
    switchCase({
        SET_MASTER: () => {
            state.players[action.id].isMaster = true;
            state.status = 'active';
            return state;
        },
        SET_HAND_CARDS: () => {
            if (!state.players[action.id].isMaster) {
                console.log('Round handlers[SET_HAND_CARDS] - if');
                state.playerIsMaster = false;
                state.handCards = action.cards;
            } else {
                console.log('Round handlers[SET_HAND_CARDS] - else');
                state.playerIsMaster = true;
                state.handCards = null;
            }

            return state;
        },
        SHOW_CHOICES: () => {
            console.log('Round handlers[SHOW_CHOICES]');

            // set handCards (players choices) for Round master
            state.handCards = action.choices.map(({ player, card }: any) => ({ ...card, player, selected: false }));

            return state;
        },
        SHOW_VOTING: () => {
            console.log('Round handlers[SHOW_VOTING]');

            // state.handCards = [];
            state.handCards = [...action.choices.map(({ player, card }: any) => ({ ...card, player, selected: false }))];

            return state;
        },
        default: () => {
            console.warn(`handlers -> roundMaster - unhandled action type: ${action.type}`);

            return state;
        }
    })(action.type)();
};
