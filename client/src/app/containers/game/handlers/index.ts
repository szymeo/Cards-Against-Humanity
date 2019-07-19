import { round } from './round.handlers';
import { room } from './room.handlers';

export const setState = (rootState = {}) => {
    // console.log(state);

    return ({
        round: round(rootState),
        room: room(rootState),
    });
};
