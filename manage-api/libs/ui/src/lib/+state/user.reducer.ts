import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { State } from '@application/api-interfaces';
import * as UserActions from './user.actions';
import { UserEntity } from './user.models';

export const USER_FEATURE_KEY = 'user';

export interface AppState {
  loginData: State;
}

export interface UserPartialState {
  [USER_FEATURE_KEY]: State;
}

export const initialState: State = { //userAdapter.getInitialState({
  pending: false,
  loaded: false,
  error: null,
  data: null,
};

const userReducer = createReducer(
  initialState,
  // register
  on(UserActions.loginUserLoad, state => ({ ...state, loaded: false, error: null })),
  on(UserActions.loginUserSuccess, (state, { result }) => ({
    ...state,
    loaded: true,
    data: result,
  })
  ),
  on(UserActions.loginUserFailure, (state, { error }) => ({ ...state, error })),
  // login 
  on(UserActions.loginUserWithOTPLoad, state => ({ ...state, loaded: false, error: null })),
  on(UserActions.loginUserWithOTPSuccess, (state, { result }) => ({
    ...state,
    loaded: true,
    data: result,
  })
  ),
  on(UserActions.loginUserWithOTPFailure, (state, { error }) => ({ ...state, error })),
  on(UserActions.logout, (state) => ({
    ...state,
    data: null,
    loaded: false,
    pending: false,
    error: null,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return userReducer(state, action);
}
