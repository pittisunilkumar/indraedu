import { Routes } from '@angular/router';
import {  AgentGuard, ApplicationLayoutComponent, AuthGuard, CouponsGuard, CoursesGuard, DepartmentGuard, EmployeeGuard, OrganizationGuard, RoleModuleGuard, RolesGuard, RoleSubModuleGuard, SubscriptionsGuard, UserPaymentsGuard, UsersGuard } from '@application/ui';

export const ManageRoutes: Routes = [
  {
    path: '',
    // canActivate: [AccessToManageGuard],
    // component: ApplicationLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        children: [
          {
            path: 'coupons',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/coupons/coupons.module').then(
                (m) => m.CouponsModule
              ),
              canActivate: [AuthGuard,CouponsGuard]
          },
          {
            path: 'courses',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/courses/courses.module').then(
                (m) => m.CoursesModule
              ),
              canActivate: [AuthGuard,CoursesGuard]
          },
          {
            path: 'faculty',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/faculty/faculty.module').then(
                (m) => m.FacultyModule
              ),
            canActivate: [AuthGuard,AgentGuard]
          },
          {
            path: 'organizations',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/organizations/organizations.module').then(
                (m) => m.OrganizationsModule
              ),
            canActivate: [AuthGuard,OrganizationGuard]
          },
          {
            path: 'subscriptions',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/manage/modules/subscriptions/subscriptions.module'
              ).then((m) => m.SubscriptionsModule),
              canActivate: [AuthGuard,SubscriptionsGuard]
          },
          {
            path: 'user/payments',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/manage/modules/payments/payments.module'
              ).then((m) => m.PaymentsModule),
              canActivate: [AuthGuard,UserPaymentsGuard]
          },
          {
            path: 'employee',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/manage/modules/employee/employee.module'
              ).then((m) => m.EmployeeModule),
              canActivate: [AuthGuard,EmployeeGuard]
          },
          {
            path: 'users',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/users/users.module').then(
                (m) => m.UsersModule
              ),
              canActivate: [AuthGuard,UsersGuard]
          },
          {
            path: 'department',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/manage/modules/deparment/deparment.module'
              ).then((m) => m.DeparmentModule),
              canActivate: [AuthGuard,DepartmentGuard]
          },
          {
            path: 'complaints',
            loadChildren: () =>
              import(
                'apps/manage-client/src/app/modules/manage/modules/complaints/complaints.module'
              ).then((m) => m.ComplaintsModule),
              canActivate: [AuthGuard]
          },
          {
            path: 'testing',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/testing/testing.module').then(
                (m) => m.TestingModule
              ),
            canActivate: [AuthGuard]
          },
          {
            path: 'roles',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/roles/roles.module').then(
                (m) => m.RolesModule
              ),
            canActivate: [AuthGuard,RolesGuard]
          },

          {
            path: 'role-modules',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/role-modules/role-values.module').then(
                (m) => m.RoleValuesModule
              ),
            canActivate: [AuthGuard,RoleModuleGuard]
          },

          {
            path: 'role-sub-modules',
            loadChildren: () =>
              import('apps/manage-client/src/app/modules/manage/modules/role-sub-modules/role-sub-modules.module').then(
                (m) => m.RoleSubModulesModule
              ),
            canActivate: [AuthGuard,RoleSubModuleGuard]
          },
          
        ]
      },
    ],
  }
];
