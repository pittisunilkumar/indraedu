import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, QBankInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, QBankRepositoryService, QuestionsRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'application-questions-list-container',
  templateUrl: './questions-list-container.component.html',
  styleUrls: ['./questions-list-container.component.less']
})
export class QuestionsListContainerComponent implements OnInit {
  qbank$: Observable<ResponseInterface<QBankInterface>>;
  chapterUuid: string;
  subjectUuid: string;
  mode = this.route.snapshot.data['mode'];
  selectedList: SelectedQuestionInterface[] = [];
  topicUuid: string;
  errors: string[];
  subjectName: string;
  chapterName: string;
  topicName:string;


  constructor(
    private questionsRepo: QuestionsRepositoryService,
    private qbankRepo: QBankRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // window.sessionStorage.removeItem('path');
    // this.subjectName = window.sessionStorage.getItem('subjectName');
    // this.chapterName = window.sessionStorage.getItem('chapterName');
    // this.chapterUuid = window.sessionStorage.getItem('chapteruuid');
    // this.topicName = window.sessionStorage.getItem('topicName');

    window.localStorage.removeItem('path');
    this.subjectName = window.localStorage.getItem('subjectName');
    this.chapterName = window.localStorage.getItem('chapterName');
    this.chapterUuid = window.localStorage.getItem('chapteruuid');
    this.topicName = window.localStorage.getItem('topicName');
    this.subjectUuid = this.route.snapshot.paramMap.get('uuid');
    this.loadData();
  }

  loadData() {
    this.qbank$ = this.getTestByUuid();
  }

  getTestByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.topicUuid = params.get('topicUuid')
        return this.qbankRepo.getQBankTopicsByUuid(this.subjectUuid, this.chapterUuid, params.get('topicUuid'));
      })
    );
  }

  createQuestion() {
    let orderList = [];
    let questions:any;
    var largest:any;
    this.getTestByUuid().subscribe(res=>{
      questions = res?.response
      questions.map(e=>{
        orderList.push(e.order)
      })
      console.log(orderList);
      largest = 0
      for (let i = 0; i <= largest; i++) {
        if (orderList[i] > largest) {
           largest = orderList[i];
        }
      }
      console.log(largest);
      // window.sessionStorage.setItem('lastOrder', largest)
      window.localStorage.setItem('lastOrder', largest)

    })
    // window.sessionStorage.setItem('path', 'Qbank');
    window.localStorage.setItem('path', 'Qbank')
    this.router.navigate(['/bank/questions/create'])
    
  }

  removeQuestion(question) {
    let fromQue: string[] = [];
    fromQue.push(question.uuid)
    let questionsPayload = {
      from_subject: this.subjectUuid,
      from_chapter: this.chapterUuid,
      from_topic: this.topicUuid,
      from_que: fromQue,
    }
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: question },
      height: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.qbankRepo.deleteQBankQuetionsByUuid(questionsPayload).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
      }
    })
  }

  multipleQuestionsDelete(questions) {
    let fromQue: string[] = [];
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: questions , type:'multiple' },
      height: '60%'
    });
    questions.map(res => {
      fromQue.push(res.uuid)
  
    let questionsPayload = {
      from_subject: this.subjectUuid,
      from_chapter: this.chapterUuid,
      from_topic: this.topicUuid,
      from_que: fromQue,
    }
   
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.qbankRepo.deleteQBankQuetionsByUuid(questionsPayload).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
      }
    })
  })
  }

  editQuestionPreview(question) {
    // window.sessionStorage.setItem('questionType',question.type);
    // window.sessionStorage.setItem('path', 'Qbank')
    window.localStorage.setItem('questionType',question.type);
    window.localStorage.setItem('path', 'Qbank')
    this.router.navigate([`bank/questions/${question.uuid}/edit`])
  }

  backToChapters() {
    this._location.back();
  }
  backToSubjects() {
    this.router.navigate(['/q-bank/subjects/list']);
  }

}
