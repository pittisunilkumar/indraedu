import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';
import * as fromCpmponents from './components';


export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: fromContainers.UsersListContainerComponent,
      },
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateUserContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateUserContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':uuid/packages',
        component: fromContainers.UserSubscriptionsContainerComponent,
      },
      {
        path: ':id/tests',
        component: fromCpmponents.UserResetTestsComponent,
      },
      {
        path: ':uuid/packages/assign',
        component: fromContainers.AssignSubscriptionsContainerComponent,
      },
      {
        path: ':uuid/packages/:uuid/add/payment',
        component: fromContainers.AddUserPaymentContainerComponent,
      },
      {
        path: ':uuid/packages/:uuid/add/payment',
        component: fromContainers.AddUserPaymentContainerComponent,
      }, {
        path: 'disableuserfortestsubmit',
        component: fromCpmponents.DisableuserfortestsubmitComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/manage/users/list',
        pathMatch: 'full',
      }
      // {
      //   path: ':orgUuid',
      //   component: fromContainers.OrgContainerComponent,
      // },
    ]
  },
];
