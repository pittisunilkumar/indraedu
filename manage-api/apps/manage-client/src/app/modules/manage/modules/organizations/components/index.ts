import { AssignUsersComponent } from './assign-users/assign-users.component';
import { CreateOrgComponent } from './create-org/create-org.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { OrgListComponent } from './org-list/org-list.component';
import { OrgComponent } from './org/org.component';

export const components = [
  CreateOrgComponent,
  OrgListComponent,
  OrgComponent,
  CreateUserComponent,
  AssignUsersComponent,
];

export * from './create-org/create-org.component';
export * from './org-list/org-list.component';
export * from './org/org.component';
export * from './create-user/create-user.component';
export * from './assign-users/assign-users.component';
