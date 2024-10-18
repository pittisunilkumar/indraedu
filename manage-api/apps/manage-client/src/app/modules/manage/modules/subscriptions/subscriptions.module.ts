import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { TranslateModule } from '@ngx-translate/core';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { SubscriptionsRoutes } from './subscriptions.routes';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    
       
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(SubscriptionsRoutes),
    UiModule,
    MatButtonModule
  ],
})
export class SubscriptionsModule {}
