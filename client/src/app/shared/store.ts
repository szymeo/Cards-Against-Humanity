import {Observable, ReplaySubject} from 'rxjs';

export class Store<T> {
    state$: Observable<T>;
    private _state$: ReplaySubject<T>;
    private _state: T;

    protected constructor (initialState: T) {
        this._state$ = new ReplaySubject(1);
        this.state$ = this._state$.asObservable();
        this._state = initialState;
    }

    get state (): T {
        return this._state;
    }

    setState (nextState: T): void {
        this._state = nextState;
        this._state$.next(nextState);
    }
}
