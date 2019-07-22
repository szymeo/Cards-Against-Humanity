import { ArraySchema } from '@colyseus/schema';

import { Card } from '../schemas/Card';

export interface RoundChoice {
    cards: ArraySchema<Card>
    sessionId: string
}
