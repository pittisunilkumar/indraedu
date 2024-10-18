import { Routes } from '@angular/router';
import { BankAsideMenuComponent } from '../../components/aside-menu/aside-menu.component';
import { VideosListContainerComponent } from './containers/videos-list-container/videos-list-container.component';

export const VideoCipherRoutes: Routes = [
  {
    path: '',
    // canActivate:[VideoCypherGuard],
    children: [
      // {
      //   path: 'add',
      //   component: AddVideosContainerComponent,
      //   data: {
      //     mode: 'add',
      //   },
      // },
      // {
      //   path: ':uuid/edit',
      //   component: AddVideosContainerComponent,
      //   data: {
      //     mode: 'edit',
      //   },
      // },
      {
        path: 'list',
        component: VideosListContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: BankAsideMenuComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bank/videoCipher/list',
      },
    ],
  },
];
