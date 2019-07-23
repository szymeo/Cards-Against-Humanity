import { Injectable } from '@angular/core';

import { DialogModule } from './dialog.module';

@Injectable({
    providedIn: DialogModule
})
export class DialogConfig<D = any> {
    data?: D;
}
