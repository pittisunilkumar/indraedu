import { CreateOrgContainerComponent } from './create-org-container/create-org-container.component';
import { OrgContainerComponent } from './org-container/org-container.component';
import { OrgListContainerComponent } from './org-list-container/org-list-container.component';

export const containers = [
  CreateOrgContainerComponent,
  OrgListContainerComponent,
  OrgContainerComponent,
];

export * from './create-org-container/create-org-container.component';
export * from './org-list-container/org-list-container.component';
export * from './org-container/org-container.component';
