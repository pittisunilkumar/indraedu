import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { LoaderService } from './loader.service';
import { NotificationService } from './notification.service';

export const services = [
  AuthService,
  DialogService,
  LoaderService,
  NotificationService
];

export * from './auth.service';
export * from './dialog.service';
export * from './loader.service';
export * from './notification.service';
