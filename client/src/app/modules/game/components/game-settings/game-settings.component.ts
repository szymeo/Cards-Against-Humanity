import { Component, OnInit } from '@angular/core';

import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';

@Component({
    selector: 'app-game-settings',
    templateUrl: './game-settings.component.html',
    styleUrls: ['./game-settings.component.sass']
})
export class GameSettingsComponent implements OnInit {

    constructor(private ref: DialogRef) { }

    ngOnInit() {
    }

    public closeSettings() {
        this.ref.close();
    }

}
