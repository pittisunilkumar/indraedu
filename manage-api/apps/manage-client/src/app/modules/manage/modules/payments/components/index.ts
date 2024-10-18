import { PayReceiptComponent } from "./pay-receipt/pay-receipt.component";
import { TransactionDetailsComponent } from "./transaction-details/transaction-details.component";
import { UserPaymentsComponent } from "./user-payments/user-payments.component";

export const components = [
    UserPaymentsComponent,
    TransactionDetailsComponent,
    PayReceiptComponent
];

export * from './user-payments/user-payments.component';
export * from './transaction-details/transaction-details.component';
export * from './pay-receipt/pay-receipt.component';



