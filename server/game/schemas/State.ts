import { Player } from './Player';
import { Round } from './Round';
import { RoomStatus } from '../typings/RoomStatus';

export class State {
    players: { [id: string]: Player };
    rounds: Round[];
    status: RoomStatus;
}