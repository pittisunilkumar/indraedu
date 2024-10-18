import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import { ManageRoutes } from './manage.routes';
import * as fromModules from './modules';

@NgModule({
  declarations: [
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ...fromModules.modules,
    RouterModule.forChild(ManageRoutes),
    
  ]
})
export class ManageModule { }
