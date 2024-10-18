import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './container';


export const RoleValuesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateRoleValueContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateRoleValueContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'list',
        component: fromContainers.RoleValueListContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage/role-modules/list',
      },
    ],
  },
];
