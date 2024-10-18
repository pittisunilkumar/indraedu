import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStateService } from '../+state/user-state.service';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private auth: AuthService,
    private router: Router,
    private userState: UserStateService,
    private route: ActivatedRoute) {

  }

  checkLogin(url: string): Observable<boolean> {

    const user = localStorage.getItem('access_token');
    let isUserLoggedIn;
    if (user) {
      // this.router.navigateByUrl(this.route.snapshot.data['route']);

      isUserLoggedIn = true;
    } else {
      // Store the attempted URL for redirecting
      this.auth.redirectUrl = url;
      // Navigate to the login page with extras
      this.router.navigate(['/login']);
      isUserLoggedIn = false;
    }

    return isUserLoggedIn;

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const url: string = state.url;

    return this.checkLogin(url);

  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
