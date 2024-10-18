import { CouponsModule } from './coupons/coupons.module';
import { CoursesModule } from './courses/courses.module';
import { EmployeeModule } from './employee/employee.module';
import { FacultyModule } from './faculty/faculty.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PaymentsModule } from './payments/payments.module';
import { RoleValuesModule } from './role-modules/role-values.module';
import { RoleSubModulesModule } from './role-sub-modules/role-sub-modules.module';
import { RolesModule } from './roles/roles.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UsersModule } from './users/users.module';

// let currentUser;
// currentUser = JSON.parse(localStorage.getItem('rolePermissions'));
// console.log('M-currentUser',currentUser);

// export let moduleArray = []
// currentUser?.rolePermissions.map(res => {
//   if (res.module[0].title === 'COUPONS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(CouponsModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'COURSES') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(CoursesModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'EMPLOYEE') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(EmployeeModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'AGENTS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(FacultyModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'ORGANIZATIONS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(OrganizationsModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'ROLE_SUB_MODULES') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(RoleSubModulesModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'ROLE_MODULES') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(RoleValuesModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'ROLES') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(RolesModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'SUBSCRIPTIONS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(SubscriptionsModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'USERS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(UsersModule)
//       }
//     })
//   }
//   else if (res.module[0].title === 'USER_PAYMENTS') {
//     res.subModules.map(e => {
//       if (e.title == 'VIEW') {
//         moduleArray.push(PaymentsModule)
//       }
//     })
//   }

// })
// moduleArray.sort()
// export const modules = moduleArray.length > 0 ? moduleArray : []
// console.log('m-modules', modules);

export const modules = [
  CouponsModule,
  CoursesModule,
  FacultyModule,
  OrganizationsModule,
  SubscriptionsModule,
  UsersModule,
  PaymentsModule,
  EmployeeModule,
  RolesModule,
  RoleValuesModule,
  RoleSubModulesModule
];

export * from './coupons/coupons.module';
export * from './courses/courses.module';
export * from './faculty/faculty.module';
export * from './organizations/organizations.module';
export * from './subscriptions/subscriptions.module';
export * from './users/users.module';
export * from './employee/employee.module';
export * from './role-modules/role-values.module';
export * from './role-sub-modules/role-sub-modules.module';
export * from './roles/roles.module';

