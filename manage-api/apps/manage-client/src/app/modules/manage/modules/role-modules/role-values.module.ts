import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleValuesRoutes } from './role-values-routing.module';
import * as fromComponents from './component';
import * as fromContainers from './container';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(RoleValuesRoutes),
    UiModule,
    MatButtonModule
  ]
})
export class RoleValuesModule { }
