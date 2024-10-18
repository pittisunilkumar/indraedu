import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
import { Observable } from 'rxjs';


@Injectable()
export class AccessToBankGuard implements CanActivate {
    constructor(
        private router: Router,
        private helper: HelperService,
        private roleService: RolesService,
    ) { }

    async canActivate() {
        let isAccess
        let modules = this.helper.enumtoArray(RoleModulesEnum);
        let subM = this.helper.enumtoArray(RoleSubModulesEnum);

        let role = localStorage.getItem('role');
        let roleData = JSON.parse(localStorage.getItem('roleData'));

        // let r = await this.roleService.getRoleById(role).toPromise()
        roleData[0].rolePermissions.find(res => {
            if (res.module[0].title == modules.type.BANK) {
                let result = res.subModules.find(e => {
                    if (e.title == subM.type.VIEW) {
                        return true;
                    }
                })
                isAccess = result ? true : false
            }
        })
        if (isAccess) {
            return isAccess
        }
        else {
            this.router.navigate(['/dashboard']);
        }
    }


}
