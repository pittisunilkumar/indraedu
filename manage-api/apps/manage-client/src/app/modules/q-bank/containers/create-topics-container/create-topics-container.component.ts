import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankInterface, QBankSubjectInterface, QuestionInterface, ResponseInterface } from '@application/api-interfaces';
import { CourseRepositoryService, QBankRepositoryService, QuestionsRepositoryService, SyllabusRepositoryService, TestCategoriesRepositoryService, TestsRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';

export interface QBankDataInterface {
  questions: QuestionInterface[];
  subject: QBankSubjectInterface;
}

@Component({
  selector: 'application-qbank-create-topics-container',
  templateUrl: './create-topics-container.component.html',
  styleUrls: ['./create-topics-container.component.less']
})
export class CreateTopicsContainerComponent implements OnInit, OnDestroy {

  qbank$: Observable<ResponseInterface<QBankInterface>>;
  data: QBankDataInterface;
  mode = this.route.snapshot.data['mode'];
  _sub = new Subscription();
  errors: string[] = [];
  subjectUuid: string;
  isApiCalling = false;
  chapterUuid: string;
  subjectName: string;
  fileName: any;
  file: File | any = null;
  topicsData: any;
  total:any;
  constructor(
    private questionsRepo: QuestionsRepositoryService,
    private qbankRepo: QBankRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // this.subjectName = window.sessionStorage.getItem('subjectName');
    // this.chapterUuid = window.sessionStorage.getItem('chapteruuid')
    this.subjectName = window.localStorage.getItem('subjectName');
    this.chapterUuid = window.localStorage.getItem('chapteruuid')
    this.data = {
      questions: [],
      subject: null,
    };
    this.getSubjectByUuid().subscribe(val => {
      this.data.subject = val?.response;
    })
    this._sub.add(this.bindQuestionsData());

    if (this.mode === 'edit') {
      this.qbank$ = this.getTestByUuid();
    }



  }

  getSubjectByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.subjectUuid = params.get('uuid');
        return this.qbankRepo.getQBankSubjectsByUuid(params.get('uuid'));
      })
    );
  }

  getTestByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.qbankRepo.getQBankTestsByUuid(this.subjectUuid, this.chapterUuid, params.get('topicUuid'));
      })
    );
  }

  // bindQuestionsData() {

  //   this.questionsRepo.getAllQuestions().subscribe(
  //     (res) => {
  //       this.data.questions = res?.response;
  //     },
  //   )

  // }
  bindQuestionsData() {
    // this.subjectUuid
    let subId;
    this.route.paramMap.subscribe(params => {
      subId = params.get('subjectId')
    })
    // const subjId = "60d89411587a58032ad59f9a"
    // this.questionsRepo.getAllQuestionsBySubjectId(subId).subscribe(
    //   (res) => {
    //     this.data.questions = res?.response;
    //   },
    // )

    let data = {
      page: 1,
      limit: 10,
      search: '',
      subjectIds: subId
    };
    console.log('data8978', data);

    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        this.data.questions = res?.response?.data;
        this.total = res?.response?.totalRecords;
        console.log('this.data.questions',this.data.questions);
      },
      (err) => { }
    );
  }


  submit(data) {
    this.isApiCalling = true;
    let suggestedTopic = {
      uuid: uuid.v4(),
      // subjectId: sessionStorage.getItem('Qbank_id'),
      // courseId: sessionStorage.getItem('courseId'),
      subjectId: localStorage.getItem('Qbank_id'),
      courseId: localStorage.getItem('courseId'),
      chapterId: data.chapter_id,
      qbankUuid: data.topics.uuid,
      status: data.topics.flags.suggested,
      createdOn: new Date().toISOString().toString(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    }
    if (this.mode === 'add') {
      console.log('datadatadatadata', data);

      this.qbankRepo.addQBankTests(data).subscribe(
        (res) => {
          this.isApiCalling = false;
          if (res.response) {
            if (suggestedTopic?.status) {
              this.qbankRepo.suggestedTopics(suggestedTopic).subscribe(data => { })
            }
          }
          console.log({ res });
          this._location.back()
          // this.router.navigateByUrl('/q-bank/subjects/list');
          // this.router.navigateByUrl(`/q-bank/subjects/${this.data.subject.uuid}/${this.data.subject._id}/topics/list`);
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      )

    } else {
      console.log('suggestedTopic', suggestedTopic);
      this.qbankRepo.editQBankTestsByUuid(data).subscribe(
        (res) => {
          this.isApiCalling = false;
          if (res.ok) {
            this.qbankRepo.suggestedTopics(suggestedTopic).subscribe(data => { })
          }
          console.log({ res });
          this._location.back();
          // this.router.navigateByUrl('/q-bank/subjects/list');
          // this.router.navigateByUrl(`/q-bank/subjects/${this.data.subject.uuid}/${this.data.subject._id}/topics/list`);
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
      window.sessionStorage.removeItem('chapteruuid')
      window.localStorage.removeItem('chapteruuid')
    }
  }

  ngOnDestroy(): void {

    this._sub.unsubscribe();

  }

  backToSubjects() {
    this.router.navigate(['/q-bank/subjects/list']);
    // window.sessionStorage.removeItem('chapteruuid');
    // window.sessionStorage.removeItem('chapterName');
    // window.sessionStorage.removeItem('subjectName');

    window.localStorage.removeItem('chapteruuid');
    window.localStorage.removeItem('chapterName');
    window.localStorage.removeItem('subjectName');
  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  FileSubmited() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.topicsData = JSON.parse(fileReader.result);
      this.topicsData.map(res => {
        let cData = {
          subject: res.subject_id,
          courses: res.course_id,
          chapter: res.chapter_id,
          topics: {
            uuid: uuid.v4(),
            title: res.title,
            description: res.description,
            // order: parseInt(res.order),
            order: 1,
            scheduledDate: new Date(),
            pdf: res.pdf_path ? { fileUrl: res.pdf_path, upload: true } : {},
            image: res.image_Url ? { imgUrl: res.image_Url, upload: true } : {},
            icon: res.icon_Url ? { imgUrl: res.icon_Url, upload: true } : {},
            suggestedBanner: res.suggestedBanner ? { imgUrl: res.suggestedBanner, upload: true } : {},
            flags: {
              active: true,
              suggested: true,
              paid: true
            },
            que: [],
            createdOn: new Date(),
            modifiedOn: null,
            createdBy: {
              uuid: localStorage.getItem('currentUserUuid'),
              name: localStorage.getItem('currentUserName'),
            },
          },
        }
        array.push(cData)

      })

      console.log(array);
      this.qbankRepo.addBulkQBankTests(array).subscribe(data => {
        if (data) {
          console.log(data);
        }
      })

      // array.map(res => {
      //    this.qbankRepo.addQBankTests(res).subscribe(data => {
      //     if (data) {
      //       console.log(data);
      //     }
      //   })
      // })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }

}
