import { Routes } from '@angular/router';
import { AuthGuard, CreateGuard, EditGuard } from '@application/ui';
import { BankAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';

export const BannerRoutes: Routes = [
  {
    path: '',
    // canActivate:[BannersGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateBannersContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateBannersContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'list',
        component: fromContainers.BannersListContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: BankAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bank/banners/list',
      },
    ],
  },
];
