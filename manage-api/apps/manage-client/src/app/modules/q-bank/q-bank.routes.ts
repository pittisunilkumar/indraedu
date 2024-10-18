import { Routes } from "@angular/router";
import { ApplicationLayoutComponent, AuthGuard, CreateGuard, CreateQTopicGuard, EditGuard, EditQTopicGuard, QBankChapterGuard, QBankSubjectGuard, SuggestedTopicsGuard, ViewQTopicQueGuard } from '@application/ui';
import * as fromComponents from './components';
import * as fromContainers from './containers';

export const QBankRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    canActivate:[QBankSubjectGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'suggested-qbank-topics',
        component: fromComponents.SuggestedQbankTopicsComponent,
        canActivate: [AuthGuard,SuggestedTopicsGuard]
      },
      {
        path: 'subjects',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: fromContainers.SubjectListContainerComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'add',
            component: fromContainers.CreateSubjectsContainerComponent,
            canActivate: [AuthGuard,CreateGuard]
          },
          {
            path: ':uuid/edit',
            component: fromContainers.CreateSubjectsContainerComponent,
            canActivate: [AuthGuard,EditGuard]
          },
          {
            path: ':uuid/:subjectId',
            children: [
              {
                path: 'topics',
                children: [
                  {
                    path: '',
                    redirectTo: 'list',
                    pathMatch: 'full',
                  },
                  {
                    path: 'list',
                    component: fromContainers.TopicsListContainerComponent,
                    canActivate: [AuthGuard,QBankChapterGuard]
                  },
                  {
                    path: 'add',
                    component: fromContainers.CreateTopicsContainerComponent,
                    data: {
                      mode: 'add',
                    },
                    canActivate: [AuthGuard,CreateQTopicGuard]
                  },
                  {
                    path: ':topicUuid/edit',
                    component: fromContainers.CreateTopicsContainerComponent,
                    data: {
                      mode: 'edit',
                    },
                    canActivate: [AuthGuard,EditQTopicGuard]
                  },
                // Added ViewQuestionsComponent
                  {
                    path: ':topicUuid/view-questions',
                    component: fromContainers.QuestionsListContainerComponent,
                    canActivate: [AuthGuard,ViewQTopicQueGuard]
                  },

                ]
              },
            ]
          }
        ]
      },
      {
        path: '',
        outlet: 'aside',
        component: fromComponents.QBankAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/q-bank/subjects/list',
        pathMatch: 'full',
      },
    ]
  },
];
