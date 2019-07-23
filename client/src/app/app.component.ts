import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs/Observable';
import { Subscription, of, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import 'rxjs/add/observable/fromEvent';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
    public navOpened: boolean = false;
    public onlineEvent: Observable<Event>;
    public offlineEvent: Observable<Event>;
    public connectionStatusMessage: string;
    public connectionStatus: string;
    public playerNick: string;

    public online$: Observable<any>;

    private subs: Subscription = new Subscription();

    constructor(private swUpdate: SwUpdate) { }

    ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() => {
                if (confirm('New version available. Load New Version?')) {
                    window.location.reload();
                }
            });
        }

        this.online$ = merge(
            of(navigator.onLine),
            Observable.fromEvent(window, 'online').pipe(mapTo(true)),
            Observable.fromEvent(window, 'offline').pipe(mapTo(false))
        );

        this.getPlayerNick();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    private getPlayerNick() {
        this.playerNick = localStorage.getItem('nickname') || '';
    }

    public setPlayerNick(nickname: string) {
        console.log('setPlayerNick');

        this.playerNick = nickname;
        localStorage.setItem('nickname', nickname);
    }

    public openNav() {
        this.navOpened = true;
    }

    public closeNav() {
        this.navOpened = false;
    }
}
