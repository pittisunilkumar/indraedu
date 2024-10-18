import { Routes } from '@angular/router';
import { AuthGuard, CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';

export const CouponsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: fromContainers.CouponListContainerComponent,
      },
      {
        path: 'add',
        canActivate:[CreateGuard],
        component: fromContainers.CreateCouponContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateCouponContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/manage/coupons/list',
        pathMatch: 'full',
      }
    ],
  },
];
