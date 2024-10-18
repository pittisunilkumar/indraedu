import { Routes } from '@angular/router';
import { AboutUsGuard, ApplicationLayoutComponent, AuthGuard, CareersGuard, CreateGuard, EditGuard, FeedbackGuard, NotificationGuard, UserMessageGuard } from '@application/ui';
import { PortalAsideMenuComponent } from './components';
import * as fromContainers from './containers';
import * as fromComponent from './components';


export const PortalRoutes: Routes = [
  {
    path: '',
    // component: ApplicationLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'aboutUs',
        component: fromContainers.AboutUsContainerComponent,
        canActivate: [AuthGuard,AboutUsGuard]
      },
      {
        path: 'notifications',
        component: fromComponent.NotificationComponent,
        canActivate: [AuthGuard,NotificationGuard]
      },
      {
        path: 'notifications/list',
        component: fromComponent.NotificationsListComponent,
        canActivate: [AuthGuard,NotificationGuard]
      },
      {
        path: 'notifications/:id',
        component: fromComponent.ViewNotificationComponent,
        canActivate: [AuthGuard,NotificationGuard]
      },
      {
        path: 'feedback/create',
        component: fromComponent.CreateFeedbackComponent,
        canActivate: [AuthGuard,CreateGuard],
        data: {
          mode: 'add',
        },
      },
      {
        path: 'feedback/:uuid/edit',
        component: fromComponent.CreateFeedbackComponent,
        canActivate: [AuthGuard,EditGuard],
        data: {
          mode: 'edit',
        },
      },
      {
        path: 'feedback/:uuid/graph',
        component: fromComponent.FeedbackGraphComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'feedback/list',
        component: fromComponent.FeedbackListComponent,
        canActivate: [AuthGuard,FeedbackGuard]
      },
      {
        path: 'messages',
        component: fromContainers.MessagesListContainerComponent,
        canActivate: [AuthGuard,UserMessageGuard]
      },
      {
        path: 'careers',
        canActivate: [AuthGuard,CareersGuard],
        children: [
          {
            path: 'list',
            component: fromContainers.CareerListContainerComponent
          },
          {
            path: 'add',
            canActivate:[CreateGuard],
            component: fromContainers.CreateCareerContainerComponent,
            data: {
              mode: 'add',
            },
          },
          {
            path: ':uuid/edit',
            canActivate:[EditGuard],
            component: fromContainers.CreateCareerContainerComponent,
            data: {
              mode: 'edit',
            },
          },
          {
            path: '',
            redirectTo: '/portal/careers/list',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '',
        outlet: 'aside',
        component: PortalAsideMenuComponent,
      },
      {
        path: '',
        redirectTo: '/portal/aboutUs',
        pathMatch: 'full',
      },
    ],
  },
];
