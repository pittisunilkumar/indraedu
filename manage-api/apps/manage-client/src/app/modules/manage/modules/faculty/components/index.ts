import { AgentPaymentComponent } from './agent-payment/agent-payment.component';
import { AgentPaymentsListComponent } from './agent-payments-list/agent-payments-list.component';
import { CreateFacultyComponent } from './create-faculty/create-faculty.component';
import { FacultyCouponsListComponent } from './faculty-coupons-list/faculty-coupons-list.component';
import { FacultyListComponent } from './faculty-list/faculty-list.component';

export const components = [
    CreateFacultyComponent, 
    FacultyListComponent,
    FacultyCouponsListComponent,
    AgentPaymentComponent,
    AgentPaymentsListComponent
];

export * from './create-faculty/create-faculty.component';
export * from './faculty-list/faculty-list.component';
export * from './faculty-coupons-list/faculty-coupons-list.component';
export * from './agent-payment/agent-payment.component';
export * from './agent-payments-list/agent-payments-list.component';



