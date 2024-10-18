import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankInterface, QBankSubjectChapterInterface, RoleModulesEnum, RoleSubModulesEnum, TestInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, DialogService, HelperService, QBankRepositoryService, RolesService } from '@application/ui';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-qbank-topics-list-container',
  templateUrl: './topics-list-container.component.html',
  styleUrls: ['./topics-list-container.component.less']
})
export class TopicsListContainerComponent implements OnInit, OnDestroy {

  _sub = new Subscription();
  chapters: QBankSubjectChapterInterface[];
  errors: string[];
  subjectName: string;
  addTopicEnable:boolean;

  constructor(
    private qbankRepo: QBankRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private roleService: RolesService,
    public helper: HelperService,
  ) { }

  ngOnInit(): void {
    // this.subjectName = window.sessionStorage.getItem('subjectName');
    this.subjectName = window.localStorage.getItem('subjectName');

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
          if (res.module[0].title === modules.type.QBANK_TOPICS){
            res.subModules.map(e => {
              if (e.title == subM.type.ADD) {
                this.addTopicEnable = true;
              }
            })
          }
        })
      // })
    }
  }

  getAllQBankTestsBySubjectUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.qbankRepo.getQBankSubjectsByUuid(params.get('uuid'));
      })
    );
  }

  loadData() {
    this.getAllQBankTestsBySubjectUuid().subscribe(
      (res) => {
        this.chapters = res.response.chapters;
        console.log(this.chapters);

      }
    )
  }

  delete(topic: QBankInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: topic },
    });
    // let chapterUuid = window.sessionStorage.getItem('chapteruuid')
    let chapterUuid = window.localStorage.getItem('chapteruuid')

    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    let fromTopic: string[] = [];
    fromTopic.push(topic.uuid);
    let topicsPayload = {
      from_subject: subjectUuid,
      from_chapter: chapterUuid,
      from_topic: fromTopic,
      count:fromTopic.length
    }
    console.log('topicsPayload',topicsPayload);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.qbankRepo.deleteQBankTopicsByUuid(topicsPayload).subscribe(
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
  multipleTopicsDelete(topics) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: topics,type: 'multiple'  },
      height:'50%'
    });
    let fromTopic: string[] = [];
    let count = 1;
    // let chapterUuid = window.sessionStorage.getItem('chapteruuid')
    let chapterUuid = window.localStorage.getItem('chapteruuid')

    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    
    topics.map((res,i)=>{
      fromTopic.push(res.uuid);
      let topicsPayload = {
        from_subject: subjectUuid,
        from_chapter: chapterUuid,
        from_topic: fromTopic,
        count: count
      }
      console.log('topicsPayload',topicsPayload);
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.qbankRepo.deleteQBankTopicsByUuid(topicsPayload).subscribe(
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
    })
   
  }

  chapterDelete(chapter: QBankSubjectChapterInterface) {
    let chapterUuid = []
    chapterUuid.push(chapter.uuid)
    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    let chaptersList = {
      'to_subject': subjectUuid,
      'from_chapter': chapterUuid,
      'count':chapter.topics.length
    }
    console.log(chaptersList);
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: chapter },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.qbankRepo.deleteQBankChaptersByUuid(chaptersList).subscribe(
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

  multipleChaptersDelete(chapters) {
    let fromQue: string[] = [];
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: chapters, type: 'multiple' },
      height: '60%'
    });
    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    chapters.map((res,i) => {
      fromQue.push(res.uuid)
      let questionsPayload = {
        to_subject: subjectUuid,
        from_chapter: fromQue,
        count:res.topics.length
      }
      console.log(questionsPayload);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.qbankRepo.deleteQBankChaptersByUuid(questionsPayload).subscribe(
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
    })
  }

  viewQuestions(obj: TestInterface) {
    return this.router.navigate(['../', obj.uuid, 'view-questions'], { relativeTo: this.route });
  }

  edit(obj: TestInterface) {
    console.log(obj);
    let subjectUuid;
    this.route.paramMap.subscribe(params => {
      subjectUuid = params.get('uuid');
    });
    return this.router.navigate(['../', obj.uuid, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
  backToSubjects() {
    this.router.navigate(['/q-bank/subjects/list']);
    // window.sessionStorage.removeItem('subjectName');
    // window.sessionStorage.removeItem('subjectUuid');
    // window.sessionStorage.removeItem('topicName');
    // window.sessionStorage.removeItem('topicUuid');

    window.localStorage.removeItem('subjectName');
    window.localStorage.removeItem('subjectUuid');
    window.localStorage.removeItem('topicName');
    window.localStorage.removeItem('topicUuid');
  }

}
