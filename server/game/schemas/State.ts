import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';

import { Player } from './Player';
import { Round } from './Round';
import { RoomStatus } from '../typings/RoomStatus';

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type([Round])
    rounds = new ArraySchema<Round>();
    
    @type('string')
    status: RoomStatus = 'created';
}