import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard-routing.module';
import { UiModule } from '@application/ui';
import { PaymentsDashboardComponent } from './payments-dashboard/payments-dashboard.component';
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [DashboardComponent, PaymentsDashboardComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(DashboardRoutes),
    UiModule,
    GoogleChartsModule
  ]
})
export class DashboardModule { }
