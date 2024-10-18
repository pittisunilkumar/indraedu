import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleValueInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, RolesService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-role-value-list-container',
  templateUrl: './role-value-list-container.component.html',
  styleUrls: ['./role-value-list-container.component.less']
})
export class RoleValueListContainerComponent implements OnInit {
  public roleValues: RoleValueInterface[];
  public _sub = new Subscription();
  errors: string[];
  createEnable:string
  constructor(
    private roleService: RolesService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.loadData();
  }
  loadData(): void {
    this._sub.add(this.roleService.getAllRolesValues().subscribe(
      (res) => {
        this.roleValues = res?.response;
        console.log(this.roleValues);
      },
      (err) => { }
    ));
  }

  
  delete(user: RoleValueInterface) {
    const dialogRef = this.matDialog.open(CommandRemoveDialogComponent, {
      data: { payload: user },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.removeRoleValue(user).subscribe(
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
  
  }


  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

}
