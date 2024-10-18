import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AppState,
  UserPartialState,
  USER_FEATURE_KEY,
} from './user.reducer';

// Lookup the 'User' feature state managed by NgRx
export const selectUserFeatureState = createFeatureSelector<AppState>(
  USER_FEATURE_KEY
);

export const getUserData = createSelector(
  selectUserFeatureState,
  (state: any) => {
    console.log(state);

    return state.data;
  }
);


