import { Routes } from "@angular/router";
import { ApplicationLayoutComponent, AuthGuard, CreateGuard, CreateTestGuard, EditGuard, EditTestGuard, SuggestedTestsGuard, TestSeriesGuard, ViewTestQuestionGuard } from '@application/ui';
import * as fromComponents from './components';
import * as fromContainers from './containers';

export const TestSeriesRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    canActivate:[TestSeriesGuard],
    runGuardsAndResolvers: 'always',
    
    children: [
      {
        path: 'suggested-tests',
        component: fromComponents.SuggestedTestsComponent,
        canActivate: [AuthGuard,SuggestedTestsGuard]
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: fromContainers.TestCategoryListContainerComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'add',
            component: fromContainers.AddTestCategoryContainerComponent,
            data: {
              mode: 'add',
            },
            canActivate: [AuthGuard,CreateGuard]
          },
          {
            path: ':uuid/edit',
            component: fromContainers.AddTestCategoryContainerComponent,
            data: {
              mode: 'edit',
            },
            canActivate: [AuthGuard,EditGuard]
          },
          
          {
            path: ':uuid/tests',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                component: fromContainers.TestsListContainerComponent,
                canActivate: [AuthGuard]
              },
              {
                path: 'add',
                component: fromContainers.CreateTestsContainerComponent,
                data: {
                  mode: 'add',
                },
                canActivate: [AuthGuard,CreateTestGuard]
              },
              {
                path: ':uuid/edit',
                component: fromContainers.CreateTestsContainerComponent,
                data: {
                  mode: 'edit',
                },
                canActivate: [AuthGuard,EditTestGuard]
              },
               // Added ViewQuestionsComponent
               {
                path: ':testUuid/view-questions',
                component: fromContainers.ViewQuestionsListContainerComponent,
                canActivate: [AuthGuard,ViewTestQuestionGuard]
              },
            ]
          }
        ]
      },

      {
        path: '',
        outlet: 'aside',
        component: fromComponents.TestsAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/test-series/categories/list',
        pathMatch: 'full',
      },
    ]
  },
];
