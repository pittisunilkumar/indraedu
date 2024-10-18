import { Routes } from '@angular/router';
import { CreateGuard, EditGuard } from '@application/ui';
import * as fromContainers from './container';
import * as fromComponent from './components';


export const PeralsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        //canActivate:[CreateGuard],
        component: fromContainers.CreatePeralsContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
       // canActivate:[EditGuard],
        component: fromContainers.CreatePeralsContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':uuid/assignSubject',
        component: fromComponent.AssignSubjectComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/assignSubject/edit',
        component: fromComponent.AssignSubjectComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: ':uuid/questions',
        component: fromComponent.ViewQuestionsComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: 'list',
        component: fromContainers.PeralsListContainerComponent,
      },
    ],
  },
];

