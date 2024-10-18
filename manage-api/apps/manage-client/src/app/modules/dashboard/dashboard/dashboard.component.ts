import { Component, OnInit } from '@angular/core';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { BannersRepositoryService, HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  cardsArray = [];
  courseEnable: boolean;
  currentUserType: string;
  roleData:any

  constructor(
    private roleService: RolesService,
    private helper: HelperService,
    private bannerRepo: BannersRepositoryService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentUserType = localStorage.getItem('currentUserType');
    let role = localStorage.getItem('role');
    this.roleData = localStorage.getItem('roleData');
    if (!this.roleData) {
     let data = await this.roleService.getRoleById(role).toPromise()
      localStorage.setItem('roleData', JSON.stringify(data.response));
      location.reload()
    }

    // this.roleService.getRoleById(role).subscribe(data => {
    //   localStorage.setItem('roleData', JSON.stringify(data.response));
    // })

    await this.loadPermissions();

    // this.cardsArray = [
    //   { icon: "auto_stories", name: "Courses", count: 150, link: '/manage/courses/list', active: true },
    //   { icon: "subject", name: "Subjects", count: 1800, link: '/bank/syllabus/list', active: true },
    //   { icon: "play_circle_outline", name: "Videos", count: 6080, link: '/bank/videoCipher/list', active: true },
    //   { icon: "people", name: "Employee", count: 64, link: '/manage/employee/list', active: true },
    //   { icon: "people", name: "Users", count: 100000, link: '/manage/users/list', active: true },
    //   { icon: "quiz", name: "Tests", count: 1000000, link: '/test-series/categories/list', active: true },
    //   { icon: "subscriptions", name: "Subscriptions", count: 8978, link: '/manage/subscriptions/list', active: true },
    //   { icon: "sell", name: "Coupons", count: 268, link: '/manage/coupons/list', active: true },
    // ]

  }
  // loadPermissions(){
  //   this.cardsArray.map(it => {
  //     if (it.name.includes('Courses')) {
  //       return it.active = false;
  //     }
  //   });
  // }
  getRoutePath(path, basePath) {
    localStorage.setItem('basePath', basePath);
    localStorage.setItem('routePath', path);
    localStorage.setItem('guardRoutePath', path);
    localStorage.setItem('guardBasePath', basePath);
  }
  async loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let count = await this.bannerRepo.getDashboardCount().toPromise();
    console.log('count',count);
    

    if (role) {
      let r = await this.roleService.getRoleById(role).toPromise()
      r.response[0].rolePermissions.map(res => {
        if (res.module[0].title == modules.type.COURSES) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "auto_stories", name: "Courses", count: count.response[0].Course, link: '/manage/courses/list', active: true })
              this.getRoutePath('courses','manage')
            }
          })
        }
        else if (res.module[0].title == modules.type.SYLLABUS) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "subject", name: "Subjects", count: count.response[0].Syllabus, link: '/bank/syllabus/list', active: true })
              this.getRoutePath('syllabus','bank')
            }
          })
        }
        else if (res.module[0].title == modules.type.VIDEO_CYPHER) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "play_circle_outline", name: "Videos", count: count.response[0].Videos, link: '/bank/videoCipher/list', active: true })
              this.getRoutePath('videoSubjects','videos')
            }
          })
        }
        else if (res.module[0].title == modules.type.EMPLOYEE) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "people", name: "Employee", count: count.response[0].Employee, link: '/manage/employee/list', active: true })
              this.getRoutePath('employee','manage')
            }
          })
        }
        else if (res.module[0].title == modules.type.USERS) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "people", name: "Users", count: count.response[0].Users, link: '/manage/users/list', active: true });
              this.cardsArray.push({ icon: "people", name: "Active Users", count: count.response[0].activeUsers, link: '/manage/users/list', active: true })
              this.cardsArray.push({ icon: "people", name: "SubscribedUsers", count: count.response[0].SubscribedUserCount, link: '/manage/users/list', active: true })
              this.getRoutePath('user','manage')
            }
          })
        }
        else if (res.module[0].title == modules.type.TESTS) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "quiz", name: "Tests", count: count.response[0].Tests, link: '/test-series/categories/list', active: true })
              this.getRoutePath('categories','test-series')
            }
          })
        }
        else if (res.module[0].title == modules.type.SUBSCRIPTIONS) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "subscriptions", name: "Packages", count: count.response[0].Subscription, link: '/manage/subscriptions/list', active: true })
              this.getRoutePath('subscriptions','manage')
            }
          })
        }
        else if (res.module[0].title == modules.type.COUPONS) {
          res.subModules.find(e => {
            if (e.title == subM.type.VIEW) {
              this.cardsArray.push({ icon: "sell", name: "Coupons", count: count.response[0].Coupons, link: '/manage/coupons/list', active: true })
              this.getRoutePath('coupons','manage')
            }
          })
        }
        else if (res.module[0].title == modules.type.AGENTS) {
          res.subModules.find(e => {
            if (e.title == subM.type.AGENT_COUPONS) {
              if (this.currentUserType == 'AGENT') {
                this.cardsArray.push({ icon: "sell", name: "Agents", count: 0, link: '/agent/coupons', active: true })
                this.getRoutePath('faculty','manage')
              }
            }
          })
        }
      });
    }
    this.cardsArray=this.cardsArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

  }


  getRouthPath(url) {
    let currentURL = url;
    let pathName = currentURL.split("/").join(" ");
    let basePath = pathName.split(" ")[1];
    let routePath = pathName.split(" ")[2];
    localStorage.setItem('basePath', basePath);
    localStorage.setItem('routePath', routePath);
  }

}
