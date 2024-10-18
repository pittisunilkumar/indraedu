import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInterface } from '@application/api-interfaces';
import { EmployeeRepositoryService, UsersRepositoryService } from '@application/ui';

@Component({
  selector: 'application-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  user: UserInterface;
  form =new FormGroup({
    newPassword:new FormControl('',Validators.required)
  })
  errors: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { user: UserInterface },
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    private userRepo: UsersRepositoryService,
    private empRepo: EmployeeRepositoryService,

  ) { }

  ngOnInit() {

    this.user = this.data.user;
    // this.form = this.buildForm();
    this.errors = null;

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  buildForm(): FormGroup {

    return this.formBuilder.group({});

  }

  async submit() {

    try {
      console.log('this.user',this.user.uuid);
      console.log('this.form',this.form.value);
      this.empRepo.resetUserPassword(this.user.uuid,this.form.value).subscribe(data=>{

      })

      this.errors = null;
      this.form.disable();
      // await this.userRepo.editUser(this.user).toPromise();
      // this.notification.showSuccess(result.message);
      this.dialogRef.close();

    } catch (e) {

      this.errors = e;
      this.form.enable();

    }

  }

}
