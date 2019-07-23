import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'set-nickname',
    templateUrl: './set-nickname.component.html',
    styleUrls: ['./set-nickname.component.sass']
})
export class SetNicknameComponent implements OnInit {
    @ViewChild('nicknameInput', { static: true }) nickInput: ElementRef;
    @Output() onSubmit: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
        // console.log(this.nickInput.nativeElement);
        // setTimeout(() => this.nickInput.nativeElement.focus(), 2000);
    }

}
