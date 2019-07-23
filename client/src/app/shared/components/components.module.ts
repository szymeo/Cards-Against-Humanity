import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SmoothLoaderComponent } from './smooth-loader/smooth-loader.component';

const COMPONENTS = [
    SmoothLoaderComponent
];

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class ComponentsModule {}
