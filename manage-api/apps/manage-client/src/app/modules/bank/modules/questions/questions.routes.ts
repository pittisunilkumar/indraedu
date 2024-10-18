import { Routes } from '@angular/router';
import { CreateGuard, EditGuard, MCQGuard } from '@application/ui';
import { BankAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';
import * as fromComponents from './components';


export const QuestionsRoutes: Routes = [
  {
    path: '',
    // canActivate:[QuestionsGuard],
    children: [
      {
        path: 'list',
        component: fromContainers.QuestionsContainerComponent,
      },
      {
        path: 'mcq-list',
        canActivate:[MCQGuard],
        component: fromComponents.McqQuestionsListComponent,
      },
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateQuestionsContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateQuestionsContainerComponent,
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
        redirectTo: '/bank/questions/list',
      },
    ],
  },
];
