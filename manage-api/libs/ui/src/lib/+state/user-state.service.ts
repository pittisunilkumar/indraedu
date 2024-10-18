import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInterface } from '@application/api-interfaces';
import { State, Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { LoaderService } from '../services';
import * as fromStore from './index';
import * as UserActions from './user.actions';
import { getUserData } from './user.selectors';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  constructor(
    private store: Store<fromStore.AppState>,
    private router: Router,
    private loaderService: LoaderService,
  ) { }

  public loadState(payload: LoginInterface) {

    this.store.dispatch(
      UserActions.loginUserLoad({ payload })
    );

  }

  public loadStateWithoutPassword(payload: { mobile: string }) {

    this.store.dispatch(UserActions.loginUserWithOTPLoad({ payload }));

  }

  public getState$() {

    // return this.store.select(getUserData).pipe(
    const data = JSON.parse(localStorage.getItem('currentUser'))
      // map((data) => {
        this.loaderService.setUser(data);

        return data;
      // }),
    // );

  }

  public getUserData$() {

    return this.store.select(getUserData).pipe(
      map((data) => data.response),
    );

  }

  public checkLogin() {

    return this.getState$().pipe(take(1)).subscribe(result => {
      console.log({ result });

      return result; //.data.status;
    });

  }

  logout() {
    this.store.dispatch(UserActions.logout());
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
