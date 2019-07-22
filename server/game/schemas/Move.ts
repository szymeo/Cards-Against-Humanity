import { Schema, type, ArraySchema } from '@colyseus/schema';

import { Player } from './Player';
import { Card } from './Card';

export class Move extends Schema {
    @type('string')
    sessionId?: string;

    @type([Card])
    cards = [];

    @type(['string'])
    votes: ArraySchema<string>;
}