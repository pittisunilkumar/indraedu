import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { CommandRemoveDialogComponent } from './command-remove-dialog/command-remove-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TestRemoveDialogComponent } from './test-remove-dialog/test-remove-dialog.component';

export const dialogs = [
  TestRemoveDialogComponent,
  ResetPasswordComponent,
  CommandRemoveDialogComponent,
  AlertDialogComponent
];

export * from './command-remove-dialog/command-remove-dialog.component';
export * from './reset-password/reset-password.component';
export * from './test-remove-dialog/test-remove-dialog.component';
export * from './alert-dialog/alert-dialog.component';

