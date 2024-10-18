import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import { VideoCipherRoutes } from './video-cipher.routes';

import * as fromComponents from './components';
import * as fromContainers from './containers';

@NgModule({
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
  ],
  imports: [
    CommonModule,
    UiModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(VideoCipherRoutes),
  ]
})
export class VideoCipherModule { }
