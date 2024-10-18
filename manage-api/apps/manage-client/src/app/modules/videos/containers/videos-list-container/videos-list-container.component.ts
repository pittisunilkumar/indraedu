import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, RoleModulesEnum, RoleSubModulesEnum, VideoInterface, VideoSubjectChapterInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, RolesService, VideosRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-videos-list-container',
  templateUrl: './videos-list-container.component.html',
  styleUrls: ['./videos-list-container.component.less']
})
export class VideosListContainerComponent implements OnInit {

  chapters: VideoSubjectChapterInterface[];
  _sub = new Subscription();
  errors: string[];
  subjectUuid: string;
  videoSubjectName:string;
  addVideoVisible:boolean;

  constructor(
    private videosRepo: VideosRepositoryService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router:Router,
    private roleService: RolesService,
    public helper: HelperService,
  ) { }

  ngOnInit(): void {
    this.videoSubjectName = window.localStorage.getItem('videoSubjectName')
    this._sub.add(this.loadData());
    this.loadPermissions()
  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.VIDEOS){
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.addVideoVisible = true;
              }
            })
          }
        })
      // })
    }
  }

  getSubjectBySubjectUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.subjectUuid = params.get('uuid');
        return this.videosRepo.getVideoSubjectsByUuid(params.get('uuid'));
      })
    );
  }

  loadData() {
    this.getSubjectBySubjectUuid().subscribe(
      (res) => {
        this.chapters = res.response.chapters;
        console.log(' this.chapters', this.chapters);
        
      }
    )
  }

  delete(video: VideoInterface) {

    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: video },
    });
    let chapterUuid = window.localStorage.getItem('videoChapterUuid')
    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    let fromVideo: string[] = [];
    fromVideo.push(video.uuid);
    let videosPayload = {
      from_subject: subjectUuid,
      from_chapter: chapterUuid,
      from_video: fromVideo,
      count:fromVideo.length
    }
    console.log('videosPayload',videosPayload);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.videosRepo.deleteVideosByUuid(videosPayload).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );
      }
    });

    // const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
    //   data: { payload: video },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.videosRepo.deleteVideoByUuid(this.subjectUuid, video.uuid).subscribe(
    //       (res) => {
    //         console.log({ res });
    //         this.loadData();
    //       },
    //       (err) => {
    //         this.errors = err;
    //         console.error({ err });
    //       }
    //     );
    //   }
    // });

  }

  chapterDelete(chapter: VideoSubjectChapterInterface) {
    let chapterUuid = []
    chapterUuid.push(chapter.uuid)
    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    let chaptersList = {
      'to_subject': subjectUuid,
      'from_chapter': chapterUuid,
      'count':chapter.videos.length
    }
    console.log('chaptersList',chaptersList);
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: chapter },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.videosRepo.deleteVideoChaptersByUuid(chaptersList).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            this.errors = err;
            console.error({ err });
          }
        );
      }
    });
  }

  edit(video: VideoInterface) {
  }
  backToSubjects() {
    this.router.navigate(['/videos/subjects/list']);
    window.localStorage.removeItem('videoSubjectName');
    window.localStorage.removeItem('videoSubjectUuid');
  }

}
