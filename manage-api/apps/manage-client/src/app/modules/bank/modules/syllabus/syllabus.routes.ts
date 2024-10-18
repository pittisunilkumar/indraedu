import { Route } from '@angular/router';
import * as fromContainers from '@application/ui';
import { CreateGuard, EditGuard } from '@application/ui';
import { BankAsideMenuComponent } from '../../components';

export const SyllabusRoutes: Route[] = [
  {
    path: '',
    // canActivate:[SyllabusGuard],
    children: [
      {
        path: 'list',
        component: fromContainers.SyllabusListContainerComponent,
      },
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateSyllabusContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateSyllabusContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: '',
        outlet: 'aside',
        component: BankAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bank/syllabus/list',
      },
    ],
  },
];
