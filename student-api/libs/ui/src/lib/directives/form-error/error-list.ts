import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  required: (error) => "This field is required.",
  minlength: ({ requiredLength, actualLength }) => `Expect ${requiredLength} but got ${actualLength}`
}

export const ERROR_LIST = new InjectionToken('ERROR_LIST', {
  providedIn: 'root',
  factory: () => defaultErrors
});
