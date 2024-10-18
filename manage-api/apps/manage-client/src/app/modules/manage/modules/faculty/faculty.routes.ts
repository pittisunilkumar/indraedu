import { Routes } from '@angular/router';
import { AgentCouponsGuard, AgentTransactionsGuard, AuthGuard, CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';
import * as fromComponents from './components';


export const FacultyRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateFacultyContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: 'list',
        component: fromContainers.FacultyListContainerComponent,
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateFacultyContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':uuid/agentCoupons/list',
        canActivate:[AgentCouponsGuard],
        component: fromContainers.FacultyCouponsListContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':uuid/agentCoupons/payment',
        canActivate:[AgentCouponsGuard],
        component: fromContainers.AgentPaymentContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':id/agent/payments',
        canActivate:[AgentTransactionsGuard],
        component: fromComponents.AgentPaymentsListComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/manage/faculty/list',
        pathMatch: 'full',
      }
    ],
  },
];
