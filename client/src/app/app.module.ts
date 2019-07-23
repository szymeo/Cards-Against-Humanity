import { ServiceWorkerModule } from '@angular/service-worker';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { GameModule } from './modules/game/game.module';
import { PreLobbyModule } from './modules/pre-lobby/pre-lobby.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        GameModule,
        PreLobbyModule,
        DeviceDetectorModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
