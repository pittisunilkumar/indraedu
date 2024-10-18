import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, DialogService, EmployeeRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-employee-list-container',
  templateUrl: './employee-list-container.component.html',
  styleUrls: ['./employee-list-container.component.less']
})
export class EmployeeListContainerComponent implements OnInit {
  public employee: EmployeeInterface[];
  public _sub = new Subscription();
  errors: string[];
  createEnable:string
  constructor(
    private empRepo: EmployeeRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: DialogService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.loadData();
  }
  loadData(): void {
    this._sub.add(this.empRepo.getAllEmployees().subscribe(
      (res) => {
        this.employee = res?.response;
        console.log(this.employee);
      },
      (err) => { }
    ));
  }

  
  delete(user: EmployeeInterface) {
    const dialogRef = this.matDialog.open(CommandRemoveDialogComponent, {
      data: { payload: user },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empRepo.removeEmployee(user).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })
    // return this.userRepo.removeUser(user).subscribe(
    //   (result) => {
    //     console.log(result);
    //     if(user.type === 'STUDENT') {
    //       this.loadStudents();
    //     } else {
    //       this.loadData();
    //     }
    //   },
    //   (error) => {
    //     console.log({ error });
    //   }
    // );
  }

  resetPassword(employee: EmployeeInterface) {
    return this.dialog.openUserResetPassworDialog(employee);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }


}
