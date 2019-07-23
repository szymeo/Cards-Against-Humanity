import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective implements AfterViewInit {
    public constructor(private el: ElementRef) {}

    public ngAfterViewInit() {
        setTimeout(() => this.el.nativeElement.focus(), 500);
    }
}
