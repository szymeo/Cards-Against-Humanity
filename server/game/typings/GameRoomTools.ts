import { Client } from 'colyseus'

export type GameRoomTools = {
    clients: Client[],
    sendToClient: (client: Client, data: any) => void;
    broadcast: (message: any, options?: any) => boolean;
    lock: () => void;
}