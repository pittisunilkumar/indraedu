import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum, UserInterface } from '@application/api-interfaces';
import {  RolesService } from '@application/ui';
import * as config from '../../config';
import { HelperService } from '../../helpers/helper-service';
import { AuthService } from '../../services';

@Component({
  selector: 'application-title',
  templateUrl: './application-title.component.html',
  styleUrls: ['./application-title.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationTitleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() userName: string;
  @Input() manageEnable:boolean
  @Input() bankEnable:boolean
  @Input() qbankEnable: boolean;
  @Input() videosEnable: boolean;
  @Input() testSeriesEnable: boolean;
  @Input() portalEnable: boolean;

  employeeImg: string;
  // @Input() navItems: string;

  currentUser: any;
  isManageVisible: any;
  manageType: boolean

  navItems = [
    { name: 'COMMON.DASHBOARD', link: ['dashboard'], access: true },
    { name: 'COMMON.BANKS', link: ['bank'], access: true },
    { name: 'COMMON.MANAGE', link: ['manage'], access: true },
    { name: 'COMMON.TEST_SERIES', link: ['test-series'], access: true },
    { name: 'COMMON.QBANK', link: ['q-bank'], access: true },
    { name: 'COMMON.VIDEOS', link: ['videos'], access: true },
    { name: 'COMMON.PORTALS', link: ['portal'], access: true },
  ];
  initials: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private helper: HelperService,
    private roleService: RolesService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.manageEnable);
    this.navItems.map(it => {
      if (it.link.includes('bank')) {
        return it.access = this.bankEnable;
      }
      else if (it.link.includes('manage')) {
        return it.access = this.manageEnable;
      }
      else if (it.link.includes('q-bank')) {
        return it.access = this.qbankEnable;
      }
      else if (it.link.includes('test-series')) {
        return it.access = this.testSeriesEnable;
      }
      else if (it.link.includes('videos')) {
        return it.access = this.videosEnable;
      }
      else if (it.link.includes('portal')) {
        return it.access = this.portalEnable;
      }
    });
    if (changes?.userName?.currentValue) {
      this.userName = changes?.userName?.currentValue;
      this.initials = changes?.userName?.currentValue?.replace(/[^a-zA-Z]+/g, '').substring(0, 2);
    }
  }
  

  ngOnInit(): void {
    this.employeeImg = localStorage.getItem('currentEmpImg')
  }

  logout() {

    this.authService.logout();
    window.location.reload();
    this.router.navigate(['/']);

  }

  ngOnDestroy() {

    this.userName = null;
  }

  // enumtoArray(type: any) {
  //   return {
  //     type
  //   };
  // }
  // async userAccess() {
  //   let modules = this.enumtoArray(RoleModulesEnum);
  //   let subM = this.enumtoArray(RoleSubModulesEnum);
  //   let role = localStorage.getItem('role');
  //   this.roleService.getRoleById(role).subscribe(r => {
  //     r.response[0].rolePermissions.map(res => {
  //       if (res.module[0].title == modules.type.MANAGE) {
  //         res.subModules.map(e => {
  //           if (e.title == subM.type.VIEW) {
  //             console.log(e.title);
  //             this.navItems.map(it => {
  //               if (it.link.includes('manage')) {
  //                 return it.access = true;
  //               }
  //             });
  //           }
  //           else {
  //             this.navItems.map(it => {
  //               if (it.link.includes('manage')) {
  //                 return it.access = false;
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   })
  // }

  // bankAccess() {
  // let type
  // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  // this.currentUser?.roles.map(res => {
  //   if (res.module === 'BANK') {
  //     res.submodules.map(e => {
  //       if (e == 'VIEW') {
  //         type = true
  //       }
  //     })
  //   }
  // })
  //   return type
  // }

}
