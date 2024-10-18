import { Routes } from '@angular/router';
import { AccessToBankGuard, AccessToManageGuard, AgentCouponsGuard, AgentTransactionsGuard, AuthGuard, ChangePasswordComponent, LoginComponent, MasterAdviceGuard, PageNotFoundComponent } from '@application/ui';
import { AgentPaymentsListComponent } from './modules/manage/modules/faculty/components';
import { FacultyCouponsListContainerComponent } from './modules/manage/modules/faculty/containers';

export const ManageAppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
    data: {
      route: '/dashboard'
    }
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/dashboard/dashboard.module'
      ).then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'master-advice',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/master-advice/master-advice.module'
      ).then((m) => m.MasterAdviceModule),
    canActivate: [AuthGuard,MasterAdviceGuard]
  },
  {
    path: 'bank',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/bank/bank.module'
      ).then((m) => m.BankModule),
    canActivate: [AuthGuard,AccessToBankGuard]
  },
  {
    path: 'manage',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/manage/manage.module'
      ).then((m) => m.ManageModule),
    canActivate: [AuthGuard,AccessToManageGuard]
  },
  {
    path: 'q-bank',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/q-bank/q-bank.module'
      ).then((m) => m.QBankModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perals',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/perals/perals.module'
      ).then((m) => m.PeralsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'test-series',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/test-series/test-series.module'
      ).then((m) => m.TestSeriesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'portal',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/portals/portals.module'
      ).then((m) => m.PortalsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos',
    loadChildren: () =>
      import(
        'apps/manage-client/src/app/modules/videos/videos.module'
      ).then((m) => m.VideosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agent/coupons',
    canActivate:[AuthGuard,AgentCouponsGuard],
    component: FacultyCouponsListContainerComponent,
    data: {
      mode: 'edit',
    },
  },
  {
    path: 'agent/:id/payments',
    canActivate:[AuthGuard,AgentTransactionsGuard],
    component: AgentPaymentsListComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'resetPassword',
    component: ChangePasswordComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
