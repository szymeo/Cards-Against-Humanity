import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomsListComponent } from './containers/game/components/rooms-list/rooms-list.component';

const routes: Routes = [{
    path: '',
    component: RoomsListComponent
}, {
    path: '**',
    redirectTo: ''
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
