import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeInterface, ResponseInterface, UserInterface } from '@application/api-interfaces';
import { catchError, map } from 'rxjs/operators';
import { UserStateService } from '../../+state/user-state.service';
import { AuthService, LoaderService, NotificationService, NotificationType } from '../../services';

@Component({
  selector: 'application-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  form: FormGroup;
  route = this.activatedRoute.snapshot.data['route'];
  reloaded = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userState: UserStateService,
    private loaderService: LoaderService,
    private notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      mobile: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  // submit() {
  //   const formData = this.form.value;
  //   formData.mobile = Number(formData.mobile);

  //   this.authService.login(formData).pipe().subscribe(

  //     (result: ResponseInterface<UserInterface>) => {
  //       console.log('in effects', result);
  //       if (result?.response) {
  //         localStorage.setItem('isLoggedIn', "yes");
  //         localStorage.setItem('access_token', result?.response?.accessToken);
  //         localStorage.setItem('currentUserUuid', result?.response?.uuid);
  //         localStorage.setItem('currentUserName', result?.response?.name);
  //         localStorage.setItem('currentUserType', result?.response?.type);
  //         localStorage.setItem('currentUser', JSON.stringify(result?.response));
  //       }
  //       this.router.navigateByUrl('bank');
  //       this.loaderService.setUser(result?.response);

  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error(error);
  //       localStorage.setItem('isLoggedIn', "no");
  //       this.notification.showNotification({
  //         type: NotificationType.ERROR,
  //         payload: {
  //           message: 'Invalid Credentials',
  //           statusCode: 404,
  //           statusText: 'Successfully',
  //           status: 404
  //         },
  //       });
  //     }
  //   )
  // }

  submit() {
    const formData = this.form.value;
    formData.mobile = Number(formData.mobile);

    this.authService.employeeLogin(formData).pipe().subscribe(

      (result: ResponseInterface<EmployeeInterface>) => {
        console.log('in effects', result);
        if (result?.response) {
          localStorage.setItem('isLoggedIn', "yes");
          localStorage.setItem('access_token', result?.response?.accessToken);
          localStorage.setItem('currentUserUuid', result?.response?.uuid);
          localStorage.setItem('currentUserName', result?.response?.name);
          localStorage.setItem('currentUserType', result?.response?.type);
          localStorage.setItem('currentUser', JSON.stringify(result?.response));
        }
        this.router.navigateByUrl('bank');
        this.loaderService.setUser(result?.response);

      },
      (error: HttpErrorResponse) => {
        console.error(error);
        localStorage.setItem('isLoggedIn', "no");
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: 'Invalid Credentials',
            statusCode: 404,
            statusText: 'Successfully',
            status: 404
          },
        });
      }
    )
  }

  ngOnDestroy() {
    window.location.reload();
  }
}
