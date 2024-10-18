import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './container';

export const EmployeeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.AddEmployeeContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.AddEmployeeContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'list',
        component: fromContainers.EmployeeListContainerComponent,
      },
      {
        path: ':uuid/profile',
        component: fromContainers.AddEmployeeContainerComponent,
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
        pathMatch: 'full',
        redirectTo: '/manage/employee/list',
      },
    ],
  },
];

