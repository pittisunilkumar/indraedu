import { Component, OnInit } from '@angular/core';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { RolesService } from '@application/ui';

@Component({
  selector: 'application-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.less']
})
export class BankAsideMenuComponent implements OnInit {
  currentUser: any;
  isBannersVisible: boolean;
  isTagsVisible: boolean;
  isQuestionsVisible: boolean;
  isSyllabusVisible: boolean;
  isVideoChypherVisible: boolean;

  constructor(
    private roleService: RolesService,
  ) { }

  enumtoArray(type: any) {
    return {
      type
    };
  }

  ngOnInit(): void {
    // window.location.reload()
    window.onload = function() {
      //considering there aren't any hashes in the urls already
      if(!window.location.hash) {
          //setting window location
          window.location = window.location 
          //using reload() method to reload web page
          window.location.reload();
      }
  }

    let modules = this.enumtoArray(RoleModulesEnum);
    let subM = this.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
          if (res.module[0].title == modules.type.BANNERS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isBannersVisible = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.QUESTION_TAGS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isTagsVisible = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.QUESTIONS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isQuestionsVisible = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.SYLLABUS) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isSyllabusVisible = true;
              }
            });
          }
          else if (res.module[0].title == modules.type.VIDEO_CYPHER) {
            res.subModules.map(e => {
              if (e.title == subM.type.VIEW) {
                this.isVideoChypherVisible = true;
              }
            });
          }
        });
      // })
    }
  }

}
