import { Client } from '@colyseus/schema/lib/annotations'

export type GameRoomTools = {
    clients: Client[],
    sendToClient: (client: Client, data: any) => void;
    broadcast: (message: any, options?: any) => boolean;
    lock: () => void;
}