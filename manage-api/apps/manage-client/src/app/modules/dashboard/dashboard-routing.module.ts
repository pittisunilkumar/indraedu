import { Routes } from '@angular/router';
import { ApplicationLayoutComponent, AuthGuard, PaymentDashboardGuard } from '@application/ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentsDashboardComponent } from './payments-dashboard/payments-dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        component: PaymentsDashboardComponent,
        canActivate: [AuthGuard,PaymentDashboardGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard',
      },
    ],
  }
];
