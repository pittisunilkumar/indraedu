import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleSubModuleRoutes} from './role-sub-modules-routing.module';
import * as fromComponents from './components';
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
    RouterModule.forChild(RoleSubModuleRoutes),
    UiModule,
    MatButtonModule
  ]
})
export class RoleSubModulesModule { }
