import {  Routes } from '@angular/router';
import {    ApplicationLayoutComponent, AuthGuard, BannersGuard, QuestionsGuard, QuestionTagsGuard, SyllabusGuard, VideoCypherGuard } from '@application/ui';

export const BankRoutes: Routes = [
  {
    path: '',
    // canActivate: [AccessToBankGuard],
    // component: ApplicationLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        children: [
          {
            path: 'banners',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/bank/modules/banners/banners.module').then(
                (m) => m.BannersModule
              ),
            canActivate: [AuthGuard,BannersGuard]
          },
          {
            path: 'questions',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/bank/modules/questions/questions.module'
              ).then((m) => m.QuestionsModule),
              canActivate: [AuthGuard,QuestionsGuard],
          },
          {
            path: 'syllabus',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/bank/modules/syllabus/syllabus.module'
              ).then((m) => m.SyllabusModule),
              canActivate: [AuthGuard,SyllabusGuard]
          },
          {
            path: 'videoCipher',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/bank/modules/video-cipher/video-cipher.module'
              ).then((m) => m.VideoCipherModule),
              canActivate: [AuthGuard,VideoCypherGuard]
          },
          {
            path: 'tags',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/bank/modules/questions-tags/questions-tags.module').then(
                (m) => m.QuestionsTagsModule
              ),
            canActivate: [AuthGuard,QuestionTagsGuard]
          },
        ],
      },
    ],
  }
];
