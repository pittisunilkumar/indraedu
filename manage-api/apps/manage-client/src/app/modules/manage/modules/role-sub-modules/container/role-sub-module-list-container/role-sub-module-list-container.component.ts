import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleSubModuleInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, RolesService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-role-sub-module-list-container',
  templateUrl: './role-sub-module-list-container.component.html',
  styleUrls: ['./role-sub-module-list-container.component.less']
})
export class RoleSubModuleListContainerComponent implements OnInit {
  public roleSubModule: RoleSubModuleInterface[];
  public _sub = new Subscription();
  errors: string[];
  createEnable:string;
  constructor(
    private roleService: RolesService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.loadData();
  }
  loadData(): void {
    this._sub.add(this.roleService.getAllRoleSubModule().subscribe(
      (res) => {
        this.roleSubModule = res?.response;
        console.log(this.roleSubModule);
      },
      (err) => { }
    ));
  }

  
  delete(user: RoleSubModuleInterface) {
    const dialogRef = this.matDialog.open(CommandRemoveDialogComponent, {
      data: { payload: user },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.removeRoleSubModule(user).subscribe(
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
