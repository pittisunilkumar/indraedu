import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './container';


export const RoleSubModuleRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateRoleSubModuleContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateRoleSubModuleContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'list',
        component: fromContainers.RoleSubModuleListContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage/role-sub-modules/list',
      },
    ],
  },
];
