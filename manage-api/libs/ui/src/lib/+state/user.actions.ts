import { createAction, props } from '@ngrx/store';

export const logout = createAction(
  '[User] Logout'
)

export const loginUserLoad = createAction(
  '[User] Login User Load',
  props<{ payload: { mobile: number; password: string; } }>()
);
export const loginUserSuccess = createAction(
  '[User] Login User Success',
  props<{ result: any }>()
);
export const loginUserFailure = createAction(
  '[User] Login User Failure',
  props<{ error: any }>()
);

export const loginUserWithOTPLoad = createAction(
  '[User] Login User with otp Load',
  props<{ payload: { mobile: string; } }>()
);
export const loginUserWithOTPSuccess = createAction(
  '[User] Login User with otp Success',
  props<{ result: any }>()
);
export const loginUserWithOTPFailure = createAction(
  '[User] Login User with otp Failure',
  props<{ error: any }>()
);
