import { Component } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    public navOpened: boolean = false;

    constructor() { }

    public openNav() {
        this.navOpened = true;
    }

    public closeNav() {
        this.navOpened = false;
    }
}
