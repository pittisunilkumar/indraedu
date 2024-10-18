import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NotificationService, NotificationType } from '../../services';

@Component({
  selector: 'application-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  changePasswordForm: FormGroup;
  errors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.changePasswordForm = this.buildForm();
  }

  buildForm() {
    return this.formBuilder.group({
      old: ['', Validators.required],
      new: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }

  resetForm() {
    this.changePasswordForm.reset();
  }

  submit() {
    const value = this.changePasswordForm.value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(value);
    console.log(currentUser);
    
    if(value.new === value.confirm){
    this.authService.changeEmployeePassword(
      currentUser.uuid, 
      { oldPassword: value.old, newPassword: value.new }
    ).subscribe(
      (res) => {

        console.log({res});
        this.authService.logout();
        this.router.navigate(['/']);

      },
      (err) => {
        console.error({ err });
        this.errors = err.error.error;
      }
      
    )
    }
    else{
      this.notification.showNotification({
        type: NotificationType.ERROR,
        payload: {
          message: 'New password and confirm password are not matching.',
          statusCode: 404,
          statusText: 'Successfully',
          status: 404
        },
      });
      // this.changePasswordForm.reset();
    }
    
    
  }

  ngOnDestroy() {
    window.location.reload();
  }

}
