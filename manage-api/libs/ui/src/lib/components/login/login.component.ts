import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeInterface, ResponseInterface, RoleModulesEnum, UserInterface } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
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
    private roleService:RolesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userState: UserStateService,
    private loaderService: LoaderService,
    private notification: NotificationService,
    public helperService: HelperService

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

 async submit() {
    let modules = this.helperService.enumtoArray(RoleModulesEnum);
    const formData = this.form.value;
    formData.mobile = Number(formData.mobile);

   await this.authService.employeeLogin(formData).pipe().subscribe(
      async (result: ResponseInterface<any>) => {
        console.log('result',result);
        if (result?.response) {
          if(result?.response?.role){
           let data =await this.roleService.getRoleById(result.response.role).toPromise()
              localStorage.setItem('roleData',JSON.stringify(data.response));
            localStorage.setItem('isLoggedIn', "yes");
            localStorage.setItem('access_token', result?.response?.accessToken);
            localStorage.setItem('currentUserUuid', result?.response?.uuid);
            localStorage.setItem('currentUserName', result?.response?.name);
            localStorage.setItem('currentUserType', 'ADMIN');
            localStorage.setItem('currentEmpImg', result?.response?.imgUrl);
            localStorage.setItem('role', result?.response?.role);
            localStorage.setItem('currentUser', JSON.stringify(result?.response));
          }
          else {
            localStorage.setItem('isLoggedIn', "yes");
            localStorage.setItem('access_token', result?.response?.accessToken);
            localStorage.setItem('currentUserUuid', result?.response?.uuid);
            localStorage.setItem('agentId', result?.response?._id);
            sessionStorage.setItem('agentId', result?.response?._id);
            localStorage.setItem('currentUserName', result?.response?.name);
            localStorage.setItem('currentUserType', 'AGENT');
            localStorage.setItem('currentEmpImg', result?.response?.imgUrl);
            localStorage.setItem('role', '61e958304461b251b03e411c');
            let roles
            this.roleService.getAllRoles().subscribe(data => {
              roles = data.response
              roles.find(async res => {
                if (res.title == 'AGENT') {
                  console.log(res._id);
                  localStorage.setItem('role', res._id);
                let data =await  this.roleService.getRoleById(res._id).toPromise()
           localStorage.setItem('roleData',JSON.stringify(data.response));
                }
              })
            })
          }
          
        }
        else{
          this.notification.showNotification({
            type: NotificationType.ERROR,
            payload: {
              message: 'Your employment status is inActive. Please contact admin',
              statusCode: 404,
              statusText: 'Successfully',
              status: 404
            },
          });
        }
        
        this.router.navigateByUrl('dashboard');
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
