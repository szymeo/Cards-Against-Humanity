// tslint:disable-next-line: max-line-length
import { Component, Type, ComponentFactoryResolver, ViewChild, OnDestroy, ComponentRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subject, Observable } from 'rxjs';

import { InsertionDirective } from './insertion.directive';
import { DialogRef } from './dialog-ref';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.sass'],
    animations: [
        trigger('changeState', [
            state('state1', style({
                left: '0',
            })),
            state('state2', style({
                left: '-100%',
            })),
            transition('*=>state1', animate('300ms ease')),
            transition('*=>state2', animate('200ms ease'))
        ])
    ]
})
export class DialogComponent implements AfterViewInit, OnDestroy {
    componentRef: ComponentRef<any>;
    currentState: string = 'state1';

    @ViewChild(InsertionDirective, { static: false }) insertionPoint: InsertionDirective;

    private readonly _onClose: Subject<any> = new Subject<any>();
    public onClose: Observable<any> = this._onClose.asObservable();

    childComponentType: Type<any>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private cd: ChangeDetectorRef,
        private dialogRef: DialogRef
    ) { }

    ngAfterViewInit() {
        this.loadChildComponent(this.childComponentType);
        this.cd.detectChanges();
    }

    onOverlayClicked(evt: MouseEvent) {
        this.dialogRef.close();
    }

    onDialogClicked(evt: MouseEvent) {
        evt.stopPropagation();
    }

    loadChildComponent(componentType: Type<any>) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        const viewContainerRef = this.insertionPoint.viewContainerRef;

        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory);
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    close() {
        this.currentState = 'state2';
        // this._onClose.next();
    }
}
