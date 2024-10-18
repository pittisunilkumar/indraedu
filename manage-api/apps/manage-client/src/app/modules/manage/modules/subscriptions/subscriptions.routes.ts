import { Routes } from '@angular/router';
import { AuthGuard, CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';
import { CoursesListContainerComponent, CreateSubscriptionContainerComponent, SubscriptionsListContainerComponent } from './containers';

export const SubscriptionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: CreateSubscriptionContainerComponent,
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: CreateSubscriptionContainerComponent,
      },
      {
        path: 'list',
        component: SubscriptionsListContainerComponent,
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
        redirectTo: '/manage/subscriptions/list',
      },
    ],
  },
];
