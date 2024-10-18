import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
import { Location } from '@angular/common'

@Injectable()
export class SubModuleGuard {
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
        let guardRoutePath = localStorage.getItem('guardRoutePath');
        let routePath = localStorage.getItem('routePath');
        console.log(guardRoutePath, routePath);

        guardRoutePath = guardRoutePath == 'guardRoutePath' ? routePath : guardRoutePath

        if (guardRoutePath != 'guardRoutePath') {
            /////////////  MANAGE //////////////////////
            if (guardRoutePath == 'coupons') {
                MODULE = modules.type.COUPONS
            }
            else if (guardRoutePath == 'courses') {
                MODULE = modules.type.COURSES
            }
            else if (guardRoutePath == 'faculty') {
                MODULE = modules.type.AGENTS
            }
            else if (guardRoutePath == 'users') {
                MODULE = modules.type.USERS
            }
            else if (guardRoutePath == 'subscriptions') {
                MODULE = modules.type.SUBSCRIPTIONS
            }
            else if (guardRoutePath == 'employee') {
                MODULE = modules.type.EMPLOYEE
            }
            else if (guardRoutePath == 'userPayments') {
                MODULE = modules.type.USER_TRANSACTIONS
            }
            else if (guardRoutePath == 'role-sub-modules') {
                MODULE = modules.type.ROLE_SUB_MODULES
            }
            else if (guardRoutePath == 'role-modules') {
                MODULE = modules.type.ROLE_MODULES
            }
            else if (guardRoutePath == 'roles') {
                MODULE = modules.type.ROLES
            }

            /////////////  BANK //////////////////////
            else if (guardRoutePath == 'banners') {
                MODULE = modules.type.BANNERS
            }
            else if (guardRoutePath == 'questions') {
                MODULE = modules.type.QUESTIONS
            }
            else if (guardRoutePath == 'tags') {
                MODULE = modules.type.QUESTION_TAGS
            }
            else if (guardRoutePath == 'syllabus') {
                MODULE = modules.type.SYLLABUS
            }
            else if (guardRoutePath == 'videoCipher') {
                MODULE = modules.type.VIDEO_CYPHER
            }

            /////////////  TEST SERIES //////////////////////
            else if (guardRoutePath == 'testCategories') {
                MODULE = modules.type.TEST_CATEGORIES
            }

            /////////////  QBANK //////////////////////
            else if (guardRoutePath == 'qbankSubjects') {
                MODULE = modules.type.QBANK_SUBJECT
            }

            /////////////  VIDEOS //////////////////////
            else if (guardRoutePath == 'videoSubjects') {
                MODULE = modules.type.VIDEO_SUBJECT
            }

            /////////////  PORTALS //////////////////////
            else if (guardRoutePath == 'careers') {
                MODULE = modules.type.CAREERS
            }
            else if (guardRoutePath == 'messages') {
                MODULE = modules.type.USER_MESSAGES
            }
            else if (guardRoutePath == 'aboutUs') {
                MODULE = modules.type.ABOUT_US
            }
        }
        // else if (guardRoutePath == 'guardRoutePath') {
        //     MODULE = 'QUESTION_TAGS'
        // }

        console.log('MODULEMODULEMODULE', MODULE);

        if (MODULE) {
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
                // localStorage.removeItem('guardRoutePath')
                return isAccess
            }
            // else {
            //     console.log(guardRoutePath, routePath);
            //     console.log('path', path);
            //     localStorage.removeItem('basePath')
            //     localStorage.removeItem('routePath');
            //     // this._location.back()
            //     // this.router.navigate(['/dashboard']);
            // }
        }
        else if(MODULE === undefined){
            this.router.navigate(['/']);
        }




        // if(guardRoutePath == null){
        //     console.log('nullpath',path);
        //     this.router.navigate([`${path}`]);
        // }


    }


}