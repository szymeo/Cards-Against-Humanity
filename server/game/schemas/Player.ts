import { Card } from './Card';

export class Player {
    cards: Card[] = [];
    score: number = 0;
    nickname: string;

    isAdmin: boolean = false;
    isMaster: boolean = false;
    
    x: number = Math.floor(Math.random() * 400);
    y: number = Math.floor(Math.random() * 400);
}