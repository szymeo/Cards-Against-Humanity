import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'main-card',
    templateUrl: './main-card.component.html',
    styleUrls: ['./main-card.component.sass']
})
export class MainCardComponent implements OnInit {
    @Input() card: any;

    constructor() { }

    ngOnInit() {
    }

}
