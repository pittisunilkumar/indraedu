import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { OrganizationsRoutes } from './organizations.routes';

@NgModule({
  declarations: [...fromContainers.containers, ...fromComponents.components],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(OrganizationsRoutes),
    UiModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class OrganizationsModule {}
