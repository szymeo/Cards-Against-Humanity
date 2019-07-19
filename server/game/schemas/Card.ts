export class Card {
    text: string;
    pick: number;
    selected: boolean = false;

    constructor({ text, pick }) {
        this.text = text;
        this.pick = pick;
    }
}