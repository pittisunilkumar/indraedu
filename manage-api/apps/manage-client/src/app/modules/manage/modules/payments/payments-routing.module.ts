// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class PaymentsRoutingModule { }

import { Routes } from '@angular/router';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './container';
import * as fromComponents from './components';


export const PaymentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: fromContainers.UserPaymentsContainerComponent,
      },
      {
        path: ':uuid/transaction',
        component: fromComponents.TransactionDetailsComponent,
      },
      {
        path: ':uuid/receipt',
        component: fromComponents.PayReceiptComponent,
      },
     
      // {
      //   path: ':uuid/courses',
      //   component: CoursesListContainerComponent,
      // },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage/user/payments/list',
      },
    ],
  },
];

