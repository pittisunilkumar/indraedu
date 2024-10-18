import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ToastMessageComponent } from '../components/toast-message/toast-message.component';

export enum NotificationType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}

export interface MatSnackBarDefaultData {
  type: NotificationType;
  payload: MatSnackBarDefaultDataPayloadInterface;
}

export interface MatSnackBarDefaultDataPayloadInterface {
  message?: string;
  statusCode?: number;
  statusText?: string;
  status?: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  showNotification(data: MatSnackBarDefaultData) {

    this.snackBar.openFromComponent(ToastMessageComponent, {
      data: data,
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

  }

}
