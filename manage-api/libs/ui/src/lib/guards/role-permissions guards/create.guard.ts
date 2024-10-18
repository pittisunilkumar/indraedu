import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';


@Injectable()
export class CreateGuard {
    constructor(
        private router: Router,
        private roleService: RolesService,
        public helperService: HelperService
    ) { }

    async canActivate() {
        let isAccess
        let modules = this.helperService.enumtoArray(RoleModulesEnum);
        let subM = this.helperService.enumtoArray(RoleSubModulesEnum);
        let MODULE
        let guardRoutePath = localStorage.getItem('guardRoutePath');
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
        else if (guardRoutePath == 'user') {
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
        else if (guardRoutePath == 'department') {
            MODULE = modules.type.DEPARTMENT
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
        else if (guardRoutePath == 'mcq-list') {
            MODULE = modules.type.MCQ_OF_THE_DAY
          }

        /////////////  TEST SERIES //////////////////////
        else if (guardRoutePath == 'categories') {
            MODULE = modules.type.TEST_CATEGORIES
        }
        else if (guardRoutePath == 'suggested-tests') {
            MODULE = modules.type.SUGGESTED_TESTS
          }

        /////////////  QBANK //////////////////////
        else if (guardRoutePath == 'qbankSubjects') {
            MODULE = modules.type.QBANK_SUBJECT
        }
        else if (guardRoutePath == 'suggested-qbank-topics') {
            MODULE = modules.type.SUGGESTED_TOPICS
          }

        /////////////  VIDEOS //////////////////////
        else if (guardRoutePath == 'videoSubjects') {
            MODULE = modules.type.VIDEO_SUBJECT
        }
        else if (guardRoutePath == 'suggested-videos') {
            MODULE = modules.type.SUGGESTED_VIDEOS
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
        else if (guardRoutePath == 'notifications') {
            MODULE = modules.type.NOTIFICATION
          }
          else if (guardRoutePath == 'organizations') {
            MODULE = modules.type.ORGANIZATIONS
          }
          else if (guardRoutePath == 'feedback') {
            MODULE = modules.type.FEEDBACK
        }

        let role = localStorage.getItem('role');
        let roleData = JSON.parse(localStorage.getItem('roleData'));

        // let r = await this.roleService.getRoleById(role).toPromise()
        roleData[0].rolePermissions.find(res => {
            if (res.module[0].title == MODULE) {
                let result = res.subModules.find(e => {
                    if (e.title == subM.type.ADD) {
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
        else {
            // localStorage.removeItem('basePath')
            // localStorage.removeItem('routePath')
            this.router.navigate(['/dashboard']);
        }

    }


}