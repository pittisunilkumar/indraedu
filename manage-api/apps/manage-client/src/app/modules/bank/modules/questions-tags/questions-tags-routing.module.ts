import { Routes } from '@angular/router';
import { AuthGuard, CreateGuard, EditGuard } from '@application/ui';
import { BankAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';

export const TagsRoutes: Routes = [
  {
    path: '',
    // canActivate:[QuestionTagsGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateTagsContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateTagsContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'list',
        component: fromContainers.TagsListContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: BankAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bank/tags/list',
      },
    ],
  },
];
