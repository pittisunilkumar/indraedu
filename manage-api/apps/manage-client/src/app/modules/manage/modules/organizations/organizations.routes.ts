import { Routes } from '@angular/router';
import { ApplicationLayoutComponent, AuthGuard, CreateGuard, OrganizationGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';
import * as components from './components';


export const OrganizationsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: components.OrgListComponent,
        canActivate:[OrganizationGuard]
      },
      {
        path: 'create',
        component: components.CreateOrgComponent,
        canActivate:[CreateGuard],
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        component: components.CreateOrgComponent,
        canActivate:[CreateGuard],
        data: {
          mode: 'edit',
        },
      },
      
      {
        path: '',
        redirectTo: '/manage/organizations/list',
        pathMatch: 'full',
      }
      // {
      //   path: '',
      //   outlet: 'aside',
      //   component: ManageAsideMenuComponent,
      // },
      // {
      //   path: ':orgUuid',
      //   component: fromContainers.OrgContainerComponent,
      // },
    ]
  },
];
