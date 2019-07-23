import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

import { DialogConfig } from '../../../../shared/components/dialog/dialog-config';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';

@Component({
    selector: 'players-list',
    templateUrl: './players-list.component.html',
    styleUrls: ['./players-list.component.sass']
})
export class PlayersListComponent implements OnInit {
    @Output() onActionClick: EventEmitter<null> = new EventEmitter();
    @Input() players: { [id: string]: any };

    constructor(
        private config: DialogConfig,
        private dialog: DialogRef
    ) { }

    ngOnInit() {
        this.players = this.config.data.players;
    }

    public commitAction() {
        this.dialog.close();
    }

}
