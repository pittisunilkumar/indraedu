import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResetPasswordInterface, SignUpInterface } from '@application/api-interfaces';
import { Observable, of } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  isLoggedIn = false;
  redirectUrl: string;
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  login(request: { mobile: number; password: string }): Observable<any> {
    return this.http.post(this.baseUrl + 'users/login', request);
  }

  employeeLogin(request: { mobile: number; password: string }): Observable<any> {
    return this.http.post(this.baseUrl + 'employee/employeeLogin', request);
  }

  loginWithOtp(payload: { mobile: string }) {

    return this.http.post(this.baseUrl + '/userOtpService', payload);

  }

  changePassword(uuid: string, payload: ResetPasswordInterface): Observable<any> {
    return this.http.put(this.baseUrl + `users/${uuid}/resetPassword`, payload);
  }

  changeEmployeePassword(uuid: string, payload: ResetPasswordInterface): Observable<any> {
    return this.http.put(this.baseUrl + `employee/${uuid}/resetEmployeePassword`, payload);
  }


  logout() {

    localStorage.clear();
    this.isLoggedIn = false;

  }

  register(payload: SignUpInterface, options?: any) {

    return this.http.post(this.baseUrl + '/register_user', payload, options)
      .pipe(
        tap(
          (data: any) => {
            console.log({ data });
            // localStorage.setItem('token', data.response.token);
            // localStorage.setItem('userId', data.response.id);
          },
          error => {
            console.error(error);
          }
        )
      )

  }

}
