import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { defer, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from '../services';
import * as UserActions from './user.actions';
import * as fromUser from './user.reducer';

@Injectable()
export class UserEffects {


  route = this.activatedRoute.snapshot.data['route'];

  loginUserWithPassword$ = createEffect(() => {

    // localStorage.clear();
    // localStorage.clear();

    return this.actions$.pipe(
      ofType(UserActions.loginUserLoad),
      exhaustMap(action =>
        this.authService.login(action.payload).pipe(
          map((result: any) => {
            console.log('in effects', { result });
            if (result.accessToken) {
              localStorage.setItem('isLoggedIn', "yes");
              localStorage.setItem('access_token', result.accessToken);
              localStorage.setItem('currentUserUuid', result.uuid);
              localStorage.setItem('currentUserName', result.name);
              localStorage.setItem('currentUserType', result.type);
              localStorage.setItem('currentUser', JSON.stringify(result));

              this.router.navigateByUrl('bank');

            }

            return UserActions.loginUserSuccess({ result })
          }),
          catchError(error => {

            console.log({error});

            localStorage.setItem('isLoggedIn', "no");
            localStorage.setItem('loginError', error.error.message);

            return of(UserActions.loginUserFailure({ error }))
          })
        )
      )
    )

  });

  loginUserWithOtp$ = createEffect(() => {

    return this.actions$.pipe(
      ofType(UserActions.loginUserWithOTPLoad),
      exhaustMap(action =>
        this.authService.loginWithOtp(action.payload).pipe(
          map((result: any) => {
            console.log('in effects', { result });
            if (result.status) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('user_id', result.response.id);
              localStorage.setItem('otp', result.otp);
            }

            return UserActions.loginUserWithOTPSuccess({ result })
          }),
          catchError(error => {

            localStorage.setItem('isLoggedIn', "false");

            return of(UserActions.loginUserWithOTPFailure({ error }))
          })
        )
      )
    )

  });
  // mergeMap(action => {

  //   return defer(async () => {

  //     return await this.authservice.login(action.payload).toPromise();

  //   })

  //     .pipe(
  //       switchMap((result) => {
  //         console.log('in effects', result);
  //         return of({ type: '[User] Login User Success', result })
  //       }),
  //       catchError((error) => of({ type: '[User] Login User Failure', error })),
  //     )
  // }),

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }
}
