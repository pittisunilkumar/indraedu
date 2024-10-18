import { AgentPaymentContainerComponent } from './agent-payment-container/agent-payment-container.component';
import { CreateFacultyContainerComponent } from './create-faculty-container/create-faculty-container.component';
import { FacultyCouponsListContainerComponent } from './faculty-coupons-list-container/faculty-coupons-list-container.component';
import { FacultyListContainerComponent } from './faculty-list-container/faculty-list-container.component';

export const containers = [
  CreateFacultyContainerComponent,
  FacultyListContainerComponent,
  FacultyCouponsListContainerComponent,
  AgentPaymentContainerComponent
];

export * from './create-faculty-container/create-faculty-container.component';
export * from './faculty-list-container/faculty-list-container.component';
export * from './faculty-coupons-list-container/faculty-coupons-list-container.component';
export * from './agent-payment-container/agent-payment-container.component';
