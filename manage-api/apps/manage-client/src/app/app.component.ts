import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum, UserInterface } from '@application/api-interfaces';
import { AuthService, HelperService, LoaderInterface, LoaderService, RolesService } from '@application/ui';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
@Component({
  selector: 'application-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  title = 'manage-client';
  userName: string;

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'indeterminate';
  value = 50;
  bufferValue = 75;
  user: any;

  manageEnable: boolean;
  bankEnable: boolean;
  qbankEnable: boolean;
  videosEnable: boolean;
  testSeriesEnable: boolean;
  portalEnable: boolean;


  Dis: boolean

  show: boolean;
  showHeaderStuff = false;
  private _sub = new Subscription();


  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private roleService: RolesService,
    private helper: HelperService
  ) { }

  async ngOnInit() {
    // this.userAccess()
    this.userName = localStorage.getItem('currentUserName');
    if (!this.userName) {
      this.router.navigate(['login'])
      this.show = false;
    }
    else {
      this._sub.add(this.loader());
    }
    let role = localStorage.getItem('role');
    if (role) {
      let data = await this.roleService.getRoleById(role).toPromise()
      localStorage.setItem('roleData', JSON.stringify(data.response));
    }
    // let scroll = this
    // window.onscroll = function () { scroll.myFunction() };

  }


  // myFunction() {
  //   var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  //   console.log(winScroll);
  //   if (winScroll == 0) {
  //     this.Dis = false
  //   }
  //   else {
  //     this.Dis = true
  //   }
  //   console.log('this.Dis ', this.Dis);
  // }

  // async userAccess() {
  //   let modules = this.helper.enumtoArray(RoleModulesEnum);
  //   let subM = this.helper.enumtoArray(RoleSubModulesEnum);
  //   let role = localStorage.getItem('role');
  //   if (role) {
  //     this.roleService.getRoleById(role).subscribe(r => {
  //       localStorage.setItem('rolePermissions', JSON.stringify(r.response[0]));
  //       r.response[0].rolePermissions.map(res => {
  //         if (res.module[0].title == modules.type.MANAGE) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.manageEnable = true;
  //             }
  //           });
  //         }
  //         else if (res.module[0].title == modules.type.BANK) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.bankEnable = true;
  //             }
  //           });
  //         }
  //         else if (res.module[0].title == modules.type.QBANK) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.qbankEnable = true;
  //             }
  //           });
  //         }
  //         else if (res.module[0].title == modules.type.VIDEOS) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.videosEnable = true;
  //             }
  //           });
  //         }
  //         else if (res.module[0].title == modules.type.TEST_SERIES) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.testSeriesEnable = true;
  //             }
  //           });
  //         }
  //         else if (res.module[0].title == modules.type.PORTALS) {
  //           res.subModules.map(e => {
  //             if (e.title == subM.type.VIEW) {
  //               this.portalEnable = true;
  //             }
  //           });
  //         }
  //       });
  //     })
  //   }
  // }


  loader() {
    return this.loaderService.loaderState
      .subscribe((state: LoaderInterface) => {
        this.show = state.show;
        this.cdr.detectChanges();
      })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.authService.logout();
    this._sub.unsubscribe();
  }




}
