import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'master-controls',
    templateUrl: './master-controls.component.html',
    styleUrls: ['./master-controls.component.sass']
})
export class MasterControlsComponent implements OnInit {
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    @Input() roundStatus: string;

    constructor() { }

    ngOnInit() {
        console.log('roundStatus:', this.roundStatus);
    }

    public markReadDone() {
        const payload = {
            type: 'SET_STATUS',
            scope: 'ROUND',
            status: 'read_done'
        };

        this.onClick.emit({ payload });
    }

}
