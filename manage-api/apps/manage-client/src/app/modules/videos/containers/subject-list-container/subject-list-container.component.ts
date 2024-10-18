import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankSubjectInterface, RoleModulesEnum, RoleSubModulesEnum, VideoSubjectInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, QBankRepositoryService, RolesService, VideosRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-subject-list-container',
  templateUrl: './subject-list-container.component.html',
  styleUrls: ['./subject-list-container.component.less']
})
export class SubjectListContainerComponent implements OnInit {

  list: VideoSubjectInterface[];
  _sub = new Subscription();
  errors: string[];
  length:number;

  constructor(
    private videosRepo: VideosRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private roleService: RolesService,
    public helper: HelperService,
  ) { }

  createEnable:boolean
  ngOnInit(): void {   
    this._sub.add(this.loadData());
    this.loadPermissions()
    window.sessionStorage.clear();

    window.localStorage.removeItem('videoSubjectName');
    window.localStorage.removeItem('videoSubjectUuid');
    window.localStorage.removeItem('subjectId');
    window.localStorage.removeItem('courseId');
    window.localStorage.removeItem('videoChapterUuid');
    window.localStorage.removeItem('videoChapterName');

  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.VIDEO_SUBJECT){
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.createEnable = true;
              }
            })
          }
        })
      // })
    }
  }

  loadData() {

    return this.videosRepo.getAllVideoSubjects().subscribe(
      (res) => {
        this.list = res.response;
        this.length = this.list.length
      }
    );

  }

  deleteSubject(subject: VideoSubjectInterface) {

    const dialogRef =  this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: subject,type: 'videoSubject' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {

        this.videosRepo.deleteVideoSubjectsByUuid(subject.uuid).subscribe(
          (res) => {
            console.log({ res });
            this._sub.add(this.loadData());
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );

      }

    });

  }

}
