import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UiModule } from '@application/ui';
import * as fromComponents from './components';
import * as fromContainers from './container';
import { RoleRoutes } from './roles-routing.module';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(RoleRoutes),
    UiModule,
    MatButtonModule,
    NgxPaginationModule
  ]
})
export class RolesModule { }
