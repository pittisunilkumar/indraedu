import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, SelectedQuestionInterface, TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { CommandRemoveDialogComponent, TestsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-view-questions-list-container',
  templateUrl: './view-questions-list-container.component.html',
  styleUrls: ['./view-questions-list-container.component.less']
})
export class ViewQuestionsListContainerComponent implements OnInit {

  test$: Observable<ResponseInterface<any>>;
  uuid: string;
  subjectUuid: string;
  mode = this.route.snapshot.data['mode'];
  selectedList: SelectedQuestionInterface[] = [];
  testUuid: string;
  errors: string[];
  courseName: string;
  categoryName: string;
  testName: string;
  isEnable:boolean

  constructor(
    private testsRepo: TestsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // window.sessionStorage.removeItem('path');
    // this.courseName = window.sessionStorage.getItem('courseName');
    // this.categoryName = window.sessionStorage.getItem('categoryName');
    // this.testName = window.sessionStorage.getItem('testName');
    // this.uuid = window.sessionStorage.getItem('cUuid');

    window.localStorage.removeItem('path');
    this.courseName = window.localStorage.getItem('courseName');
    this.categoryName = window.localStorage.getItem('categoryName');
    this.testName = window.localStorage.getItem('testName');
    this.uuid = window.localStorage.getItem('cUuid');
    this.loadData();
  }

  loadData() {
    this.test$ = this.getTestByUuid();
    // this.getTestByUuid().subscribe(data=>{
    //   if(data.response){
    //     this.isEnable = true
    //   }
    //   console.log(data);
    // })
  }

  getTestByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.testUuid = params.get('testUuid')
        return this.testsRepo.getQuetionsByTestUuid(this.uuid, params.get('testUuid'));
      })
    );
  }

  createQuestion() {
    let orderList = [];
    let questions: any;
    var largest: any;
    this.getTestByUuid().subscribe(res => {
      questions = res?.response
      questions.map(e => {
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
    // window.sessionStorage.setItem('path', 'test_series')
    window.localStorage.setItem('path', 'test_series')
    this.router.navigate(['/bank/questions/create'])

  }

  removeQuestion(question) {
    let fromQue: string[] = [];
    fromQue.push(question.uuid)
    let questionsPayload = {
      uuid: this.uuid,
      from_test: this.testUuid,
      from_que: fromQue,
    }

    console.log('questionsPayload',questionsPayload);
    
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: question },
      height: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testsRepo.deleteTSQuetionsByUuid(questionsPayload).subscribe(
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
      data: { payload: questions, type: 'multiple' },
      height: '60%'
    });
    questions.map(res => {
      fromQue.push(res.uuid)

      let questionsPayload = {
        uuid: this.uuid,
        from_test: this.testUuid,
        from_que: fromQue,
      }

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.testsRepo.deleteTSQuetionsByUuid(questionsPayload).subscribe(
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
    // window.sessionStorage.setItem('questionType', question.type)
    window.localStorage.setItem('questionType', question.type)
    this.router.navigate([`bank/questions/${question.uuid}/edit`])
  }

  backToCategories() {
    this._location.back();
  }
  

}
