import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DialogRef {
    private readonly _afterClosed: Subject<any> = new Subject<any>();
    afterClosed: Observable<any> = this._afterClosed.asObservable();

    constructor() { }

    close(result?: any) {
        this._afterClosed.next(result);
    }
}
