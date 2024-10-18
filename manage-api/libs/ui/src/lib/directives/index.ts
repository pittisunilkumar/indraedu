import { FormControlErrorContainerDirective } from './form-error-container/form-error-container.directive';
import { FormErrorDirective } from './form-error/form-error.directive';
import { FormSubmitDirective } from './form-submit/form-submit.directive';

export const directives = [
  FormControlErrorContainerDirective,
  FormErrorDirective,
  FormSubmitDirective,
];

export * from './form-error/form-error.directive';
export * from './form-error-container/form-error-container.directive';
export * from './form-submit/form-submit.directive';