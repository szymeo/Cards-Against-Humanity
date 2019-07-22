import { Schema, type } from '@colyseus/schema';

export class Card extends Schema {
    @type('string')
    text: string;

    @type('number')
    pick: number;

    @type('boolean')
    selected: boolean = false;

    @type('boolean')
    read: boolean = false;
}