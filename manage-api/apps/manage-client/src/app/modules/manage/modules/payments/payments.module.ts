import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as fromComponents from './components';
import * as fromContainers from './container';
import { UiModule } from '@application/ui';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentsRoutes } from './payments-routing.module';

@NgModule({
  declarations: [
      ...fromContainers.containers,
    ...fromComponents.components,
       
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(PaymentsRoutes),
    UiModule,
  ]
})
export class PaymentsModule { }
