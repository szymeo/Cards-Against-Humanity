import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AutofocusDirective } from './auto-focus.directive';

const DIRECTIVES = [
    AutofocusDirective
];

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: DIRECTIVES,
    exports: DIRECTIVES
})
export class DirectivesModule {}
