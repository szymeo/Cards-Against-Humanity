import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector: 'players-list',
    templateUrl: './players-list.component.html',
    styleUrls: ['./players-list.component.sass']
})
export class PlayersListComponent implements OnInit, OnChanges {
    @Input() players: { [id: string]: any };

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {

    }

}
