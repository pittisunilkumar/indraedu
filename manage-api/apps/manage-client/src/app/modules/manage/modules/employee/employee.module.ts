import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as fromComponents from './component';
import * as fromContainers from './container';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { EmployeeRoutes } from './employee-routing.module';
@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(EmployeeRoutes),
    UiModule,
  ]
})
export class EmployeeModule { }
