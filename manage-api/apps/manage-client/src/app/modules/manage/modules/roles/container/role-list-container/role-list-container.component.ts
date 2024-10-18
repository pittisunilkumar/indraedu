import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {  RoleInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, DialogService, RolesService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-role-list-container',
  templateUrl: './role-list-container.component.html',
  styleUrls: ['./role-list-container.component.less']
})
export class RoleListContainerComponent implements OnInit {
  public roles: RoleInterface[];
  public _sub = new Subscription();
  errors: string[];
  rolePermissions:any;
  createEnable:string;
  constructor(
    private roleService: RolesService,
    private matDialog: MatDialog,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.loadData();
    
    // window.location.reload();
  }
  loadData(): void {
    this._sub.add(this.roleService.getAllRoles().subscribe(
      (res) => {
        this.roles = res?.response;
      },
      (err) => { }
    ));
    // let role = localStorage.getItem('role')
    // this.roleService.getRoleById(role).subscribe(data=>{
    //   this.rolePermissions = data.response;
    //   localStorage.setItem('rolePermissions', JSON.stringify(this.rolePermissions[0]));
    // })
  }

  
  delete(user: RoleInterface) {
    const dialogRef = this.matDialog.open(CommandRemoveDialogComponent, {
      data: { payload: user },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.removeRole(user).subscribe(
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
