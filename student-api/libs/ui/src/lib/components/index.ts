import { ApplicationLayoutComponent } from './application-layout/application-layout.component';
import { ApplicationTitleComponent } from './application-title/application-title.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import * as fromCourseComponents from './courses/components';
import * as fromCourseContainers from './courses/containers';
import { FormErrorComponent } from './form-error/form-error.component';
import { FormFieldErrorComponent } from './form-field-error/form-field-error.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SpinnerComponent } from './spinner/spinner.component';
import * as fromSyllabusComponents from './syllabus/components';
import * as fromSyllabusContainers from './syllabus/containers';
import { TableComponent } from './table/table.component';
import { ToastMessageComponent } from './toast-message/toast-message.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { UsersListComponent } from './users-list/users-list.component';

export const components = [
  ApplicationLayoutComponent,
  ApplicationTitleComponent,
  ChangePasswordComponent,
  FormErrorComponent,
  FormFieldErrorComponent,
  ...fromCourseComponents.components,
  ...fromCourseContainers.containers,
  ...fromSyllabusComponents.SyllabusComponents,
  ...fromSyllabusContainers.SyllabusContainers,
  UploadImageComponent,
  UsersListComponent,
  LoginComponent,
  PageNotFoundComponent,
  ToastMessageComponent,
  TableComponent,
  SpinnerComponent
];

export * from './application-layout/application-layout.component';
export * from './application-title/application-title.component';
export * from './change-password/change-password.component';
export * from './courses/components';
export * from './courses/containers';
export * from './form-error/form-error.component';
export * from './form-field-error/form-field-error.component';
export * from './login/login.component';
export * from './page-not-found/page-not-found.component';
export * from './syllabus/components';
export * from './syllabus/containers';
export * from './upload-image/upload-image.component';
export * from './users-list/users-list.component';
export * from './toast-message/toast-message.component';
export * from './table/table.component';
export * from './spinner/spinner.component';
