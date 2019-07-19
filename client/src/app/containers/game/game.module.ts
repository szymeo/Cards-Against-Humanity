import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';

import { HandCardsComponent } from './components/hand-cards/hand-cards.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { GameContainer } from './game.container';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { AdminControlsComponent } from './components/admin-controls/admin-controls.component';
import { MainCardComponent } from './components/main-card/main-card.component';
import { MasterControlsComponent } from './components/master-controls/master-controls.component';

const COMPONENTS = [
    HeaderComponent,
    MenuComponent,
    RoomsListComponent,
    HandCardsComponent,
    GameContainer,
    PlayersListComponent,
    AdminControlsComponent,
    MainCardComponent,
    MasterControlsComponent
];

@NgModule({
    imports: [
        CommonModule,
        SwiperModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class ComponentsModule {}
