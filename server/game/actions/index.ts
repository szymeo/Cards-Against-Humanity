import * as roundActions from './round.actions';
import * as roomActions from './room.actions';

const get = (client, action, ...args) => action(client, ...args);

export {
    roundActions,
    roomActions,
    get as getAction,
};
