import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { SetNicknameComponent } from './components/set-nickname/set-nickname.component';
import { DirectivesModule } from '../../shared/directives/directives.module';

const COMPONENTS = [
    SetNicknameComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class PreLobbyModule {}
