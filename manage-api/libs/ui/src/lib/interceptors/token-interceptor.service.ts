import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserStateService } from '../+state';
import { AuthService, LoaderService } from '../services';
import { NotificationService, NotificationType } from '../services/notification.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  method: string;
  constructor(
    private userState: UserStateService,
    private loaderService: LoaderService,
    private notification: NotificationService,
    private authService: AuthService,
    private router: Router,
    @Inject('environment') private env,
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.method = req.method;
    const userToken = localStorage.getItem('access_token');

    const videoCipherReq = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Authorization': `Apisecret ${this.env.videoCipherApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const backendReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${userToken}`,
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      }
    });

    const request = req.url.includes('vdocipher') ?
      videoCipherReq : backendReq;

    this.showLoader();

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.url.includes('/proxy/api')) {
          if(this.method !== 'GET') {
            this.notification.showNotification({
              type: NotificationType.SUCCESS,
              payload: event.body
            });
          }
          this.onEnd();
        }
      },
      (err: HttpErrorResponse) => {
        console.log({err});
        if(err?.error?.statusCode === 401) {
          this.authService.logout();
          this.router.navigateByUrl('/');
        }
        if(this.method === 'GET') {
          this.notification.showNotification({
            type: NotificationType.ERROR,
            payload: err?.error,
          });
        }
        this.onEnd();
      })
    );
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
