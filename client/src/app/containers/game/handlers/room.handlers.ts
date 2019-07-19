// import { Render } from '../helpers/render';
import { switchCase } from '../../../shared/utils';
// import { getAdminCtrlPanel } from '../constants/admin-control-panel';

export const room = (state: any = {}) => (action: any, ...args: any) => switchCase({
    SET_ADMIN: () => {
        // console.log('Room handlers - set admin');

        // renderAdminComponent();
        // Render.startBtn(() => (<any>window).game.room.send({
        //     type: 'SET_STATUS',
        //     scope: 'ROOM',
        //     status: 'active'
        // }));
        state.playerIsAdmin = true;

        return state;
    },
    SET_STATUS: () => {
        // console.log('Room handlers - set status');
        // Render.ctrlPanel(getAdminCtrlPanel(action.status), (payload: any) => (<any>window).game.room.send(payload));

        return state;
    },
    default: () => {
        console.warn(`handlers -> roundMaster - unhandled action type: ${action.type}`);

        return state;
    }
})(action.type)(...args);
