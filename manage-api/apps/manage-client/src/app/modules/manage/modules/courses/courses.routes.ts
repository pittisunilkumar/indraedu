import { Routes } from '@angular/router';
import * as fromContainers from '@application/ui';
import { CreateGuard, EditGuard } from '@application/ui';
import { ManageAsideMenuComponent } from '../../components';

export const CoursesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: fromContainers.CourseListContainerComponent,
      },
      {
        path: 'create',
        canActivate:[CreateGuard],
        component: fromContainers.CreateCourseContainerComponent,
        data: {
          mode: 'add',
        },
      },
      {
        path: ':uuid/edit',
        canActivate:[EditGuard],
        component: fromContainers.CreateCourseContainerComponent,
        data: {
          mode: 'edit',
        },
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/manage/courses/list',
        pathMatch: 'full',
      }
    ],
  },
];
