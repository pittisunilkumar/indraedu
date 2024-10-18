import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
import { Location } from '@angular/common'

@Injectable()
export class MainModuleGuard {
    constructor(
        private router: Router,
        private roleService: RolesService,
        public helperService: HelperService,
        private _location: Location,
    ) { }

    async canActivate() {
        let isAccess
        let modules = this.helperService.enumtoArray(RoleModulesEnum);
        let subM = this.helperService.enumtoArray(RoleSubModulesEnum);
        let MODULE
        let path = localStorage.getItem('currentPathURL')
        let guardBasePath = localStorage.getItem('guardBasePath');

        if (guardBasePath == 'bank') {
            MODULE = modules.type.BANK
        }
        else if (guardBasePath == 'manage') {
            MODULE = modules.type.MANAGE
        }
        // else if (guardBasePath == 'test-series') {
        //     MODULE = modules.type.TEST_SERIES
        // }
        // else if (guardBasePath == 'q-bank') {
        //     MODULE = modules.type.QBANK
        // }
        // else if (guardBasePath == 'videos') {
        //     MODULE = modules.type.VIDEOS
        // }
        else if (guardBasePath == 'portals') {
            MODULE = modules.type.PORTALS
        }


        let role = localStorage.getItem('role');
        let roleData = JSON.parse(localStorage.getItem('roleData'));

        // let r = await this.roleService.getRoleById(role).toPromise()
        roleData[0].rolePermissions.find(res => {
            if (res.module[0].title == MODULE) {
                let result = res.subModules.find(e => {
                    if (e.title == subM.type.VIEW) {
                        return true;
                    }
                })
                isAccess = result ? true : false
            }
        })
        if (isAccess) {
            localStorage.setItem('guardBasePath',guardBasePath)
            return isAccess
        }
        else {
            console.log('path', path);
            localStorage.removeItem('basePath')
            localStorage.removeItem('routePath');
            // this._location.back()
            this.router.navigate(['/dashboard']);
        }

        // if(guardBasePath == null){
        //     console.log('nullpath',path);
        //     this.router.navigate([`${path}`]);
        // }

    }


}