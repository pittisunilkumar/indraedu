import { Routes } from '@angular/router';
import {  AuthGuard, CreateVideoGuard, EditGuard, EditVideoGuard, SuggestedVideosGuard, VideoChapterGuard, VideoSubjectGuard } from '@application/ui';
import * as fromComponents from './components';
import * as fromContainers from './containers';

export const VideosRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    canActivate:[VideoSubjectGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'suggested-videos',
        component: fromComponents.SuggestedVideosComponent,
        canActivate: [AuthGuard,SuggestedVideosGuard]
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
            canActivate: [AuthGuard,]
          },
          {
            path: ':uuid/edit',
            component: fromContainers.CreateSubjectsContainerComponent,
            canActivate: [AuthGuard,EditGuard]
          },
          {
            path: ':uuid',
            children: [
              {
                path: 'videos',
                children: [
                  {
                    path: '',
                    redirectTo: 'list',
                    pathMatch: 'full',
                  },
                  {
                    path: 'list',
                    component: fromContainers.VideosListContainerComponent,
                    canActivate: [AuthGuard,VideoChapterGuard]
                  },
                  {
                    path: 'add',
                    component: fromContainers.AddVideosContainerComponent,
                    data: {
                      mode: 'add',
                    },
                    canActivate: [AuthGuard,CreateVideoGuard]
                  },
                  {
                    path: ':videoUuid/edit',
                    component: fromContainers.AddVideosContainerComponent,
                    data: {
                      mode: 'edit',
                    },
                    canActivate: [AuthGuard,EditVideoGuard]
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
        component: fromComponents.VideoAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/videos/subjects/list',
        pathMatch: 'full',
      },
    ]
  },
];

