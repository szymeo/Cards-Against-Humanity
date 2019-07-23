import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'admin-controls',
    templateUrl: './admin-controls.component.html',
    styleUrls: ['./admin-controls.component.sass']
})
export class AdminControlsComponent implements OnInit {
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    @Input() roomStatus: string;

    constructor() { }

    ngOnInit() {
    }

    private buildPayload(status: string) {
        return {
            payload: {
                type: 'SET_STATUS',
                scope: 'ROOM',
                status
            },
            stateUpdate: { status }
        };
    }

    public startGame() {
        this.onClick.emit(this.buildPayload('active'));
    }

    public unPauseGame() {
        this.onClick.emit(this.buildPayload('active'));
    }

    public pauseGame() {
        this.onClick.emit(this.buildPayload('paused'));
    }


}
