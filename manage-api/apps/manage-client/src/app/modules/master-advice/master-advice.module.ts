import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterAdvicePaymentsComponent } from './master-advice-payments/master-advice-payments.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@application/ui';
import { GoogleChartsModule } from 'angular-google-charts';
import { MasterAdviceRoutes } from './master-advice-routing.module';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';
import { PrintReceiptComponent } from './print-receipt/print-receipt.component';


@NgModule({
  declarations: [MasterAdvicePaymentsComponent, ViewPaymentsComponent, PrintReceiptComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(MasterAdviceRoutes),
    UiModule,
    GoogleChartsModule
  ]
})
export class MasterAdviceModule { }
