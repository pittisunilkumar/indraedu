/* tslint:disable:max-line-length */
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeInterface, TestInterface, UserInterface } from '@application/api-interfaces';
import * as dialogs from '../dialogs';

@Injectable()
export class DialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openTestRemovedialog(test: TestInterface): MatDialogRef<dialogs.TestRemoveDialogComponent> {
    return this.dialog.open(dialogs.TestRemoveDialogComponent, {
      width: '600px',
      height: '260px',
      data: { test },
    });
  }

  openUserResetPassworDialog(user: EmployeeInterface): MatDialogRef<dialogs.ResetPasswordComponent> {
    return this.dialog.open(dialogs.ResetPasswordComponent, {
      width: '600px',
      height: '320px',
      data: { user },
    });
  }

}
