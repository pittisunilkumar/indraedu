import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { EmployeeRepositoryService, HelperService, RolesService } from '@application/ui';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { Location } from '@angular/common';
@Component({
  selector: 'application-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  lastLogin: any;
  employeeImg: any;
  userName: string;
  isEnabled: boolean;
  baseUrl: string;
  routePath: string;
  employeeUuid: string;
  role: string;
  currentUserType: string;
  agentId: string
  access_token = true;
  roleData: any;
  department: boolean;


  ///////////// BANK /////////////
  bankEnable: boolean;
  bannersEnabled: boolean;
  tagsEnabled: boolean;
  questionsEnabled: boolean;
  syllabusEnabled: boolean;
  videoCypherEnabled: boolean;
  mcqEnabled: boolean;

  ///////////// MANAGE /////////////
  manageEnable: boolean;
  couponsEnable: boolean;
  organizationEnable:boolean;
  coursesEnable: boolean;
  employeeEnable: boolean;
  userEnable: boolean;
  userPaymentsEnable: boolean;
  roleSubModuleEnable: boolean;
  roleModuleEnable: boolean;
  rolesEnable: boolean;
  subscriptionsEnable: boolean;
  agentEnable: boolean;
  testSubmitEnable:boolean;
  departmentEnable:boolean;

  ///////////// QBANK /////////////
  // qbankEnable: boolean;
  qbankSubjectEnable: boolean;
  suggestedTopics: boolean;

  ///////////// VIDEOS /////////////
  // videosEnable: boolean;
  videoSubjectEnable: boolean;
  suggestedVideos: boolean;

  ///////////// TEST_SERIES /////////////
  // testSeriesEnable: boolean;
  testCategoriesEnable: boolean;
  suggestedTestsEnable: boolean;

  ///////////// PORTALS /////////////
  portalEnable: boolean;
  careersEnable: boolean;
  userMassagesEnable: boolean;
  aboutusEnable: boolean;
  notificationEnable: boolean;
  feedbackEnable:boolean;

  //////////// Agent Transactions //////////
  agentTransctionsEnable: boolean;
  agentCouponsEnable: boolean;


  ///////////// Perals ////////////////
  peralsEnable: boolean;
  paymentDashboard:boolean;
  masterAdvice:boolean;



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private roleService: RolesService,
    private helper: HelperService,
    private route: ActivatedRoute,
    private _location: Location,
    private employeeService: EmployeeRepositoryService

  ) { }

  getRoutePath(path, basePath) {
    localStorage.setItem('basePath', basePath);
    localStorage.setItem('routePath', path);
    localStorage.setItem('guardRoutePath', path);
    localStorage.setItem('guardBasePath', basePath);
    sessionStorage.removeItem('profile')
    this.baseUrl = basePath
    this.routePath = path;

    // if(path == 'dashboard'&& basePath=='dashboard'){
    //   let role = localStorage.getItem('role');
    //   this.roleService.getRoleById(role).subscribe(data => {
    //     localStorage.setItem('roleData',JSON.stringify(data.response));
    //   })
    // }
  }

  async ngOnInit() {
    this.roleData = JSON.parse(localStorage.getItem('roleData'));
    this.employeeUuid = localStorage.getItem('currentUserUuid');
    let currentUser
    currentUser = await this.employeeService.getEmployeeByUuid(this.employeeUuid).toPromise();
    localStorage.setItem('currentUser', JSON.stringify(currentUser.response))
    if (currentUser?.response?.department?.length) {
      this.department = true
    }
    this.baseUrl = localStorage.getItem('basePath');
    this.routePath = localStorage.getItem('routePath');
    this.currentUserType = localStorage.getItem('currentUserType');
    this.agentId = localStorage.getItem('agentId')
    this.userAccess();

    this.userName = localStorage.getItem('currentUserName')
    this.employeeImg = localStorage.getItem('currentEmpImg');

    let loc = window.location.pathname
    this.baseUrl = loc.split('/')[1]
    this.routePath = loc.split('/')[2];
    let nextPath = loc.split('/')[3];
    if(this.baseUrl == 'q-bank' && this.routePath == 'subjects'){
      this.routePath = 'qbankSubjects'
    }
   else if(this.baseUrl == 'videos'  && this.routePath == 'subjects'){
      this.routePath = 'videoSubjects'
    }
    else if(this.baseUrl == 'bank'  && this.routePath == 'questions' && nextPath=='mcq-list'){
      this.routePath = 'mcq-list'
    }
    else if(this.baseUrl == 'perals'){
      this.routePath = 'perals'
    }
    else if(nextPath == 'disableuserfortestsubmit'){
      this.routePath = 'disableuserfortestsubmit'
    }
  }

  profile() {
    this.router.navigate([`/manage/employee/${this.employeeUuid}/profile`]);
    sessionStorage.setItem('profile', 'profile');
  }

  async userAccess() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    // let roleData = JSON.parse(localStorage.getItem('roleData'));
    console.log('this.roleData[0]', this.roleData[0]);

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      // this.role =r.response[0].title
      this.role = this.roleData[0].title
      this.roleData[0].rolePermissions.map(res => {
        ////////////// MANAGE ///////////////
        if (res.module[0].title == modules.type.MANAGE) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.manageEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.COUPONS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.couponsEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.COURSES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.coursesEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.ORGANIZATIONS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.organizationEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.DEPARTMENT) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.departmentEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.AGENTS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.agentEnable = true;
            }
            else if (e.title == subM.type.AGENT_COUPONS) {
              this.agentCouponsEnable = true;
            }
            else if (e.title == subM.type.AGENT_TRANSACTIONS) {
              this.agentTransctionsEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.SUBSCRIPTIONS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.subscriptionsEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.EMPLOYEE) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.employeeEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.USERS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.userEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.USER_TRANSACTIONS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.userPaymentsEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.DISABLEUSERFORTESTSUBMIT) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.testSubmitEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.ROLE_SUB_MODULES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.roleSubModuleEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.ROLE_MODULES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.roleModuleEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.ROLES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.rolesEnable = true;
            }
          });
        }
        /////////////////////////////// BANK /////////////////////////////////////////////////////////////
        else if (res.module[0].title == modules.type.BANK) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.bankEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.BANNERS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.bannersEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.QUESTIONS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.questionsEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.QUESTION_TAGS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.tagsEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.SYLLABUS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.syllabusEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.VIDEO_CYPHER) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.videoCypherEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.MCQ_OF_THE_DAY) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.mcqEnabled = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.MASTER_ADVICE) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.masterAdvice = true;
            }
          });
        }

        /////////////////////////////// QBANK /////////////////////////////////////////////////////////////
        // else if (res.module[0].title == modules.type.QBANK) {
        //   res.subModules.map(e => {
        //     if (e.title == subM.type.VIEW) {
        //       this.qbankEnable = true;
        //     }
        //   });
        // }
        else if (res.module[0].title == modules.type.QBANK_SUBJECT) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.qbankSubjectEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.SUGGESTED_TOPICS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.suggestedTopics = true;
            }
          });
        }

        /////////////////////////////// VIDEOS /////////////////////////////////////////////////////////////
        // else if (res.module[0].title == modules.type.VIDEOS) {
        //   res.subModules.map(e => {
        //     if (e.title == subM.type.VIEW) {
        //       this.videosEnable = true;
        //     }
        //   });
        // }
        else if (res.module[0].title == modules.type.VIDEO_SUBJECT) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.videoSubjectEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.SUGGESTED_VIDEOS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.suggestedVideos = true;
            }
          });
        }

        /////////////////////////////// TEST SERIES /////////////////////////////////////////////////////////////
        // else if (res.module[0].title == modules.type.TEST_SERIES) {
        //   res.subModules.map(e => {
        //     if (e.title == subM.type.VIEW) {
        //       this.testSeriesEnable = true;
        //     }
        //   });
        // }
        else if (res.module[0].title == modules.type.TEST_CATEGORIES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.testCategoriesEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.SUGGESTED_TESTS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.suggestedTestsEnable = true;
            }
          });
        }

        /////////////////////////////// PORTALS /////////////////////////////////////////////////////////////
        else if (res.module[0].title == modules.type.PORTALS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.portalEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.CAREERS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.careersEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.ABOUT_US) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.aboutusEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.USER_MESSAGES) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.userMassagesEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.NOTIFICATION) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.notificationEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.FEEDBACK) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.feedbackEnable = true;
            }
          });
        }

        /////////////////////////////// PERALS /////////////////////////////////////////////////////////////
        else if (res.module[0].title == modules.type.PERALS) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.peralsEnable = true;
            }
          });
        }
        else if (res.module[0].title == modules.type.PAYMENTS_DASHBOARD) {
          res.subModules.map(e => {
            if (e.title == subM.type.VIEW) {
              this.paymentDashboard = true;
            }
          });
        }

        // else if (res.module[0].title == modules.type.AGENTS) {
        //   res.subModules.map(e => {
        //     console.log('subM.type.AGENT_COUPONS',subM.type.AGENT_COUPONS);

        //     if (e.title == subM.type.AGENT_COUPONS) {
        //       this.agentCouponsEnable = true;
        //     }
        //   });
        // }

        // else if (res.module[0].title == modules.type.AGENTS) {
        //   res.subModules.map(e => {
        //     if (e.title == subM.type.AGENT_TRANSACTIONS) {
        //       this.agentTransctionsEnable = true;
        //     }
        //   });
        // }

      });
      // })
    }
  }



  logout() {
    this.access_token = false
    window.localStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload()
  }
}
