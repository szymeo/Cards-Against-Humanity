import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from 'colyseus.js';

@Component({
    selector: 'rooms-list',
    templateUrl: './rooms-list.component.html',
    styleUrls: ['./rooms-list.component.sass']
})
export class RoomsListComponent implements OnInit {
    @Output() onCreate: EventEmitter<Room> = new EventEmitter();
    @Output() onClick: EventEmitter<Room> = new EventEmitter();
    @Input() rooms: Room[];

    constructor() { }

    ngOnInit() {
    }

}
