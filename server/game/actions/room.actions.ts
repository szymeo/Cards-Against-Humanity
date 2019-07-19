import { Client } from 'colyseus';
import { RoomStatus } from '../typings/RoomStatus';

const scope: string = 'ROOM';

export const setAdmin = (client: Client): any => ({
    type: 'SET_ADMIN',
    id: client.sessionId,
    scope,
});

export const setStatus = (client: Client, status: RoomStatus): any => ({
    type: 'SET_STATUS',
    id: client.sessionId,
    scope,
    status,
})
