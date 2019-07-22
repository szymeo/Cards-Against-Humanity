import { Schema, ArraySchema, type } from '@colyseus/schema';

import { generateCardsArraySchema } from '../utils';
import { Card } from './Card';
import { State } from './State';
import { nosync, Client } from 'colyseus';

// function filter(cb) {
//     console.log('filter_cb');

//     return function (target, field) {
//         console.log('w funkcji tej')

//         var constructor = target.constructor;
//         /*
//         * static filters
//         */
//         if (!constructor._filters) {
//             constructor._filters = {};
//         }
//         constructor._filters[field] = cb;
//     };
// }

export class Player extends Schema {
    @type([Card])
    cards: ArraySchema<Card> = new ArraySchema<Card>();
     
    @type('number')
    secretNumber: number;

    @type('number')
    x: number = Math.floor(Math.random() * 400);
    
    @type('number')
    y: number = Math.floor(Math.random() * 400);
    
    @type('number')
    score: number = 0;
    
    @type('boolean')
    isAdmin: boolean = false;

    @type('boolean')
    isMaster: boolean = false;

    @type('string')
    nickname: string;
}