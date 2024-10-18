import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, DialogService, UsersRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-users-list-container',
  templateUrl: './users-list-container.component.html',
  styleUrls: ['./users-list-container.component.less'],
})
export class UsersListContainerComponent implements OnInit, OnDestroy {

  public users: UserInterface[];
  public students: UserInterface[];
  public _sub = new Subscription();
  errors: string[];
  createEnable:string;
  

  constructor(
    private userRepo: UsersRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: DialogService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    window.sessionStorage.clear();
    this.loadData();
    this.loadStudents();

  }

  loadData(): void {

    this._sub.add(this.userRepo.getAllUsers().subscribe(
      (res) => {
        this.users = res?.response;
      },
      (err) => { }
    ));

  } 

  loadStudents(): void {
    let data = {
      page: 1,
      limit:10,
      search:''
    }
    this._sub.add(this.userRepo.getStudentsPerPage(data).subscribe(
      (res) => {
        this.students = res?.response;
        console.log('this.students', this.students);

      },
      (err) => { }
    ));

    // this._sub.add(this.userRepo.getAllStudents().subscribe(
    //   (res) => {
    //     this.students = res?.response;
    //     console.log('this.students', this.students);

    //   },
    //   (err) => { }
    // ));

  }

  delete(user: UserInterface) {
    const dialogRef = this.matDialog.open(CommandRemoveDialogComponent, {
      data: { payload: user },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userRepo.removeUser(user).subscribe(
          (res) => {
            console.log({ res });
            if (user.type === 'STUDENT') {
              this.loadStudents();
            } else {
              this.loadData();
            }
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

  resetPassword(user: UserInterface) {
    return this.dialog.openUserResetPassworDialog(user);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

}
