import { Routes } from '@angular/router';
import { TestingFormComponent } from './components/testing-form/testing-form.component';
// import { ManageAsideMenuComponent } from '../../components';
import * as fromContainers from './containers';
import { ManageAsideMenuComponent } from '../../components';

export const TestingRoutes: Routes = [
  {
    path: '',
    children: [

      {
        path: '',
        component: fromContainers.Create1CouponContainerComponent,
      },
      {
        path: '',
        outlet: 'aside',
        component: ManageAsideMenuComponent,
      },

    ]
  },
];
