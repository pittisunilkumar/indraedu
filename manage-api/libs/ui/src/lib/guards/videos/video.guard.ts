import { Injectable } from '@angular/core';
import {  Router} from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';


@Injectable()
export class VideoChapterGuard {
  constructor(
    private router: Router,
    private roleService: RolesService,
    public helperService: HelperService
  ) { }

  async canActivate() {
    this.helperService.createPermission();
    this.helperService.deletePermission();
    this.helperService.editPermission();
    let isAccess
    let modules = this.helperService.enumtoArray(RoleModulesEnum);
    let subM = this.helperService.enumtoArray(RoleSubModulesEnum);
   
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    // let r = await this.roleService.getRoleById(role).toPromise()
    roleData[0].rolePermissions.find(res => {
      if (res.module[0].title ==  modules.type.VIDEO_CHAPTERS) {
        let result = res.subModules.find(e => {
          if (e.title == subM.type.VIEW) {
            return true;
          }
        })
        isAccess = result ? true : false
      }
    })
    console.log('isAccess', isAccess);
    if (isAccess) {
      return isAccess
    }
    else {
      this.router.navigate(['/dashboard']);
    }


  }


}