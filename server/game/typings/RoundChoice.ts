import { Card } from '../schemas/Card';

export interface RoundChoice {
    cards: Card[]
    sessionId: string
}
