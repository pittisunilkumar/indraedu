import { Component, OnInit } from '@angular/core';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.less']
})
export class ManageAsideMenuComponent implements OnInit {
  // currentUser: any;
  isRole: boolean;
  isRoleSubMOdule: boolean;
  isRoleModule: boolean;
  isCoupons: boolean;
  isCourses: boolean;
  isAgent: boolean;
  isEmployee: boolean;
  isUser: boolean;
  isUserPayment: boolean;
  isSubscription: boolean;
  isOrganization: boolean;


  constructor(
    private roleService: RolesService,
    private helper:HelperService
  ) { }

  ngOnInit(): void {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title == modules.type.ROLES) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isRole = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.ROLE_MODULES) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isRoleModule = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.ROLE_SUB_MODULES) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isRoleSubMOdule = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.COUPONS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isCoupons = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.COURSES) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isCourses = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.SUBSCRIPTIONS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isSubscription = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.ORGANIZATIONS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isOrganization = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.USERS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isUser = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.EMPLOYEE) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isEmployee = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.USER_TRANSACTIONS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isUserPayment = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.AGENTS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isAgent = true;
              }
            });
          }
        });
      // })
    }
  }

}
