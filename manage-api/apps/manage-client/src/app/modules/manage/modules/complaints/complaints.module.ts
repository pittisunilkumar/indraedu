import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromComponents from './components';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { ComplaintsRoutes } from './complaints-routing.module';


@NgModule({
  declarations: [ ...fromComponents.components],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(ComplaintsRoutes),
    UiModule,
  ]
})
export class ComplaintsModule { }
