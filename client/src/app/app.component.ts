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

        // this.online$.subscribe((isOnline) => {
        //     if (isOnline) {
        //         console.log(isOnline);
        //     } else {
        //         console.log('you are offline');
        //         console.log(isOnline);
        //     }
        // });

        // this.onlineEvent = Observable.fromEvent(window, 'online');
        // this.offlineEvent = Observable.fromEvent(window, 'offline');

        // this.subs.add(this.onlineEvent.subscribe(() => {
        //     this.connectionStatusMessage = 'Back to online';
        //     this.connectionStatus = 'online';
        //     console.log('Online...');
        // }));

        // this.subs.add(this.offlineEvent.subscribe(() => {
        //     this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
        //     this.connectionStatus = 'offline';
        //     console.log('Offline...');
        // }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public openNav() {
        this.navOpened = true;
    }

    public closeNav() {
        this.navOpened = false;
    }
}
