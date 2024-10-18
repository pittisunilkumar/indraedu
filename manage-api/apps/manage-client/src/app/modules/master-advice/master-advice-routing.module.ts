import { Routes } from '@angular/router';
import { ApplicationLayoutComponent, AuthGuard, MasterAdviceGuard, PaymentDashboardGuard } from '@application/ui';
import { MasterAdvicePaymentsComponent } from './master-advice-payments/master-advice-payments.component';
import { PrintReceiptComponent } from './print-receipt/print-receipt.component';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';

export const MasterAdviceRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'payments',
        component: MasterAdvicePaymentsComponent,
        canActivate: [AuthGuard,MasterAdviceGuard]
      },
      {
        path: ':uuid/transaction',
        component: ViewPaymentsComponent,
        canActivate: [AuthGuard,MasterAdviceGuard]
      },
      {
        path: ':uuid/receipt',
        component: PrintReceiptComponent,
        canActivate: [AuthGuard,MasterAdviceGuard]
      },
      
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/master-advice',
      },
    ],
  }
];
