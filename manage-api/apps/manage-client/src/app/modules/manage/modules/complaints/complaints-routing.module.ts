import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromComponents from './components';

export const ComplaintsRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'create',
      //   canActivate:[CreateGuard],
      //   component: fromComponents.CreateDepartmentComponent,
      //   data: {
      //     mode: 'add',
      //   },
      // },
      // {
      //   path: ':uuid/edit',
      //   canActivate:[EditGuard],
      //   component: fromComponents.CreateDepartmentComponent,
      //   data: {
      //     mode: 'edit',
      //   },
      // },
      {
        path: 'list',
        component: fromComponents.ComplaintsListComponent,
      },
      {
        path: 'ticket/view',
        component: fromComponents.ViewTicketComponent,
      },
     
     
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage/complaints/list',
      },
    ],
  },
];

