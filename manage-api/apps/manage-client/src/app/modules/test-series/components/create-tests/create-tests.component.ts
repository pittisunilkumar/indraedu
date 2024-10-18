import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SelectedQuestionInterface, TestInterface, EntityStatusEnum, TestCategoryInterface, SyllabusInterface, TestSeries } from '@application/api-interfaces';
import { HelperService, NotificationService, NotificationType, QuestionsRepositoryService, TestsRepositoryService } from '@application/ui';
import { switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { TestDataInterface } from '../../containers';
import { Location } from '@angular/common';
import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl';

@Component({
  selector: 'application-create-tests',
  templateUrl: './create-tests.component.html',
  styleUrls: ['./create-tests.component.less']
})
export class CreateTestsComponent implements OnInit, OnChanges {

  public Editor = Editor
  public config: any;

  @Input() data: TestDataInterface;
  @Input() mode: string;
  @Input() test: TestInterface;
  @Output() commit = new EventEmitter<TestInterface>();
  @Input() isApiCalling: boolean;

  courses = [];
  subjects = [];
  questions = [];
  questionsList = [];
  form: FormGroup;
  isEnableAssignQue: boolean;
  subject: SyllabusInterface;
  category: TestCategoryInterface;
  selectedQuestionsCount = 0;
  categoryUuid: string;
  courseId: string;
  courseName: string;
  categoryName: string;
  questionsAssigned = [];
  subjectName = [];
  assignedQuestionsFilter: any;
  total: number
  subjectIds: any;
  assignQuesList: any;


  constructor(
    private _formBuilder: FormBuilder,
    public helper: HelperService,
    private questionsRepo: QuestionsRepositoryService,
    private testsRepo: TestsRepositoryService,
    private route: ActivatedRoute,
    private location: Location,
    private notification: NotificationService,

  ) { this.config = this.helper.editorProperties() }



  ngOnChanges(changes: SimpleChanges) {
    if (changes?.test?.currentValue) {
      console.log('changes?.test?.currentValue', changes?.test?.currentValue);

      this.test = changes?.test?.currentValue;
      this.form = this.buildForm();
      let inputBody = [];
      let sub = '';
      if (this.mode == 'edit') {
        // this.assignQuesList = this.test.que
        this.subjectIds = this.test?.subjects.map(res => res._id)
        this.test?.subjects.map(res => {
          inputBody.push(res._id)
          if (res._id) {
            sub = sub + "&subjectIds[]=" + res._id
          }
        })
        let data = {
          page: 1,
          limit: 100,
          search: '',
          subjectIds: sub
        };
        console.log('data8978', data);

        this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
          (res: any) => {
            this.questions = res?.response?.data;
            this.total = res?.response?.totalRecords;
            console.log(' this.total', this.total);

            console.log('this.questions = res?.response?.data', this.questions);

          },
          (err) => { }
        );
        // this.questionsRepo.getAllQuestionsByMultipleSubjectId({ subjectIds: inputBody }).subscribe(
        //   (res) => {
        //     this.questions = res?.response;
        //     this.storeQstionUuid();
        //   },
        // )
        this.getTSSubjects();
      }

    }

  }

  ngOnInit() {
    this.categoryUuid = window.localStorage.getItem('cUuid');
    this.courseId = window.localStorage.getItem('courseId');
    this.courseName = window.localStorage.getItem('courseName');
    this.categoryName = window.localStorage.getItem('categoryName');
    this.form = this.buildForm();
    this.getTSSubjects();
    this.storeQstionUuid();


  }
  // getTSCategoryCourses(cId) {
  //   const inputBody = { categorieId: cId }
  //   this.testsRepo.getTSCategoryCourses(inputBody).subscribe(data => {
  //     console.log('data', data);

  //     this.courses = data.response[0].courses
  //   })
  // }
  getTSSubjects() {
    const inputBody = { courseId: this.courseId }
    this.testsRepo.getTSSubjects(inputBody).subscribe(data => {
      this.subjects = data.response[0].syllabus;
      this.notification.showNotification({
        type: NotificationType.SUCCESS,
        payload: {
          message: '',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });
      // if(this.mode == 'edit'){
      //   // console.log('this.subjects',this.subjects);
      //   // console.log(' this.test?.subjects', this.test?.subjects);
      //   this.subjects.map(res=>{
      //     this.test?.subjects.map(element=>{
      //       if(res._id === element._id){
      //           this.subjectName.push({'title':res.title});
      //           console.log('this.subjectName',this.subjectName);

      //       }
      //     })
      //   })

      // }
    })
  }
  getTSQuestions(subject) {
    let inputBody = [];
    let sub = ''
    this.subjectIds = subject.map(res => res._id)

    subject.map(res => {
      inputBody.push(res._id);
      if (res._id) {
        sub = sub + "&subjectIds[]=" + res._id
      }

    })
    let data = {
      page: 1,
      limit: 100,
      search: '',
      subjectIds: sub
    };
    console.log('data8978', data);

    this.questionsRepo.paginatedQuestionsBySubject(data).subscribe(
      (res: any) => {
        this.questions = res?.response?.data;
        this.total = res?.response?.totalRecords;
        console.log('this.questions = res?.response?.data', this.questions);

      },
      (err) => { }
    );
    // this.questionsRepo.getAllQuestionsByMultipleSubjectId({ subjectIds: inputBody }).subscribe(
    //   (res) => {
    //     this.questions = res?.response;
    //     this.storeQstionUuid();
    //     this.notification.showNotification({
    //       type: NotificationType.SUCCESS,
    //       payload: {
    //         message: '',
    //         statusCode: 200,
    //         statusText: 'Successfully',
    //         status: 201
    //       },
    //     });
    //     console.log('this.questions', this.questions);
    //   },
    // )

  }



  storeQstionUuid() {
    this.questionsAssigned = [];
    // this.questions.map(res=>{
    //   this.test?.que.forEach(question => {
    //     if(res._id === question._id){
    //       this.questionsAssigned.push({ uuid: question?.uuid, order: question?.order, positive: question?.positive, negative: question?.negative });
    //     }
    //   });
    // })
    // console.log(' this.questionsAssigned', this.questionsAssigned);
    // this.form.value.assignQuestionsForm.questions = this.questionsAssigned
    this.test?.que.forEach(question => {
      this.questionsAssigned.push({ uuid: question?.uuid, order: question?.order, positive: question?.positive, negative: question?.negative, title: question?.title });
    });
  }




  buildForm() {
    console.log(' this.test', this.test?.que);
    return this._formBuilder.group({
      chooseCategoryForm: this._formBuilder.group({
        title: [this.test ? this.test.title : '', Validators.required],
        description: [this.test ? this.test.description : '', Validators.required],
        time: [this.test ? this.test.time : '', Validators.required],
        order: [this.test ? this.test.order : '', Validators.required],
        testType: [this.test ? this.test?.testType : '', Validators.required],
        scheduledDate: [this.test ? this.test.scheduledDate : '', Validators.required],
        scheduledTime: [this.test ? this.test?.scheduledTime : '', Validators.required],
        expiryDate: [this.test ? this.test.expiryDate : ''],
        expiryTime: [this.test ? this.test?.expiryTime : ''],
        resultDate: [this.test ? this.test.resultDate : ''],
        resultTime: [this.test ? this.test?.resultTime : ''],
        testStatus: [this.test ? this.test?.testStatus : 0],
        positiveMarks: [this.test ? this.test?.positiveMarks : 1],
        negativeMarks: [this.test ? this.test?.negativeMarks : 0],
        rules: [this.test ? this.test?.rules : ''],
        testInformation: [this.test ? this.test?.testInformation : ''],
        // totalMarks: [this.test ? this.test?.totalMarks : 0],
        pdf: this._formBuilder.group({
          fileUrl: this.test ? this.test?.pdf : '',
          upload: this.test?.pdf ? true : false,
        }),
        image: this._formBuilder.group({
          imgUrl: this.test ? this.test?.imgUrl : '',
          upload: this.test?.imgUrl ? false : true,
        }),
        suggestedBanner: this._formBuilder.group({
          imgUrl: this.test?.suggestedBanner ? this.test?.suggestedBanner : '',
          upload: this.test?.suggestedBanner ? false : true,
        }),
        // categories: [this.test ? this.test.categories : null, Validators.required],
        // courses: [this.test ? this.test.courses : null, Validators.required],
        subjects: [this.test ? this.test.subjects : null, Validators.required],
        flags: this._formBuilder.group({
          active: this.test ? this.test?.flags?.active : true,
          suggested: this.test ? this.test?.flags?.suggested : false,
          testInfo:this.test ? this.test?.flags?.testInfo : false,
          paid: this.test ? this.test?.flags?.paid : true,
          editable: this.test ? this.test?.flags?.editable : true,
          //  active: true, suggested: true, paid: true, editable: true
        }),
      }),
      assignQuestionsForm: this._formBuilder.group({
        questions: [this.test ? this.test.que : [], Validators.required],
      }),
    });

  }

  getFileUrl(data: { fileUrl: string; upload: boolean }, control: string) {

    switch (control) {
      case 'imgUrl': {
        this.form.controls.chooseCategoryForm?.get('image').patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;
      }
      case 'pdf': {
        this.form.controls.chooseCategoryForm?.get('pdf').patchValue({
          fileUrl: data.fileUrl,
          upload: data.upload,
        });
        break;
      }
      case 'suggestedBanner': {
        this.form.controls.chooseCategoryForm?.get('suggestedBanner').patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;
      }
    }

  }

  get marksOrder(): FormArray {

    return this.form?.get('assignMarksForm').get('marksOrder') as FormArray;

  }

  newGroup() {

    return this._formBuilder.group({
      positive: 0,
      negative: 0,
      order: 0,
    });

  }

  addNewGroup() {

    this.marksOrder.push(this.newGroup());

  }

  assignQuestions(payload: any) {
    this.form.controls.assignQuestionsForm.patchValue({
      questions: payload
    });

    this.assignedQuestionsFilter = this.form.value.assignQuestionsForm.questions
    this.selectedQuestionsCount = this.form.value.assignQuestionsForm.questions.length
  }


  deleteQuestions(uuid) {
    this.assignedQuestionsFilter = this.assignedQuestionsFilter.filter((res) => {
      return res.que?.uuid != uuid
    })
    this.form.value.assignQuestionsForm.questions = this.assignedQuestionsFilter
    console.log(this.assignedQuestionsFilter);

    this.selectedQuestionsCount = this.form.value.assignQuestionsForm.questions.length
  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.form.value.assignQuestionsForm.questions = this.assignedQuestionsFilter.filter((question) => {
        return question.que.title.toLowerCase().includes(filterValue);
      });
    } else {
      this.form.value.assignQuestionsForm.questions = this.form.value.assignQuestionsForm.questions;
    }
  }





  submit() {
    this.form.value.assignQuestionsForm.questions.map((res) => {
      this.questionsList.push({
        "_id": res.que._id,
        "uuid": res.que.uuid,
        "order": parseInt(res.order),
        "positive": parseInt(res.positive),
        "negative": parseInt(res.negative)
      })
    })

    const value = this.form.value;
    console.log('value', value);

    value.assignQuestionsForm.questions.map(it => {
      it.order = Number(it.order);
      it.positive = Number(it.positive);
      it.negative = Number(it.negative);
      return it;
    });
    let sub = []
    value.chooseCategoryForm.subjects.map(it => {
      sub.push({ '_id': it._id, 'uuid': it.uuid })
    })
    if (this.mode === 'add') {
      var datetime = value.chooseCategoryForm.scheduledDate;
      var month = datetime.getMonth() + 1;
      var day = datetime.getDate();
      var year = datetime.getFullYear();
      var dateTimeString = year + '-' + month + '-' + day + ' ' + value.chooseCategoryForm.scheduledTime;
      let time = new Date(dateTimeString);

      var exDatetime = value.chooseCategoryForm.expiryDate;
      var exMonth = value.chooseCategoryForm.expiryDate ? exDatetime.getMonth() + 1 : '';
      var exDay = value.chooseCategoryForm.expiryDate ? exDatetime.getDate() : '';
      var exYear = value.chooseCategoryForm.expiryDate ? exDatetime.getFullYear() : '';
      var exDateTimeString = exYear + '-' + exMonth + '-' + exDay + ' ' + value.chooseCategoryForm.expiryTime;
      let exTime = new Date(exDateTimeString);

      var rDatetime = value.chooseCategoryForm.resultDate;
      var rMonth = value.chooseCategoryForm.resultDate ? rDatetime.getMonth() + 1 : '';
      var rDay = value.chooseCategoryForm.resultDate ? rDatetime.getDate() : '';
      var rYear = value.chooseCategoryForm.resultDate ? rDatetime.getFullYear() : '';
      var rDateTimeString = rYear + '-' + rMonth + '-' + rDay + ' ' + value.chooseCategoryForm.resultTime;
      let rTime = new Date(rDateTimeString);

      // let exactTime = time.getTime() + (5.5 * 60 * 60 * 1000)

      const payload: any = {
        // courses: this.courseId,
        // categories: this.categoryUuid,
        // subjects: value.chooseCategoryForm.subjects._id,
        uuid: this.categoryUuid,
        tests: {
          uuid: uuid.v4(),
          title: value.chooseCategoryForm.title,
          imgUrl: value.chooseCategoryForm.image?.imgUrl,
          subjects: sub,
          que: this.questionsList,
          testType: value.chooseCategoryForm.testType,
          count: value.assignQuestionsForm.questions.length,
          description: value.chooseCategoryForm.description,
          time: parseInt(value.chooseCategoryForm.time),
          order: Number(value.chooseCategoryForm.order),
          // scheduledDate: value.chooseCategoryForm.scheduledDate,
          // expiryDate: value.chooseCategoryForm.expiryDate,
          scheduledDate: new Date(time),
          expiryDate: value.chooseCategoryForm.expiryDate ? new Date(exTime) : '',
          resultDate: value.chooseCategoryForm.resultDate ? new Date(rTime) : '',
          scheduledTime: value.chooseCategoryForm.scheduledTime,
          expiryTime: value.chooseCategoryForm.expiryTime,
          resultTime: value.chooseCategoryForm.resultTime,
          rules: value.chooseCategoryForm.rules,
          testInformation: value.chooseCategoryForm.testInformation,
          pdf: value.chooseCategoryForm.pdf?.fileUrl,
          suggestedBanner: value.chooseCategoryForm.suggestedBanner?.imgUrl,
          createdOn: new Date().toISOString().toString(),
          modifiedOn: null,
          // status: EntityStatusEnum.YET_TO_START,
          status: 0,
          testStatus: value.chooseCategoryForm.testStatus ? parseInt(value.chooseCategoryForm.testStatus) : 0,
          positiveMarks: parseInt(value.chooseCategoryForm.positiveMarks),
          negativeMarks: parseFloat(value.chooseCategoryForm.negativeMarks),
          // totalMarks:parseInt(value.chooseCategoryForm.totalMarks),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          flags: {
            active: value.chooseCategoryForm.flags?.active,
            paid: value.chooseCategoryForm.flags?.paid,
            editable: value.chooseCategoryForm.flags?.editable,
            suggested: value.chooseCategoryForm.flags?.suggested,
            testInfo: value.chooseCategoryForm.flags?.testInfo,
            subscribed: false,
          }
        }
      };
      console.log('payload', payload);

      this.commit.emit(payload);

    } else {
      var dateTime = new Date(value.chooseCategoryForm.scheduledDate);
      var Month = dateTime.getMonth() + 1;
      var Day = dateTime.getDate();
      var Year = dateTime.getFullYear();
      var dateTimeString = Year + '-' + Month + '-' + Day + ' ' + value.chooseCategoryForm.scheduledTime;
      let time = new Date(dateTimeString);
      // let exactTime = time.getTime() + (5.5 * 60 * 60 * 1000);

      var ExDatetime = new Date(value.chooseCategoryForm.expiryDate);
      var ExMonth = ExDatetime.getMonth() + 1;
      var ExDay = ExDatetime.getDate();
      var ExYear = ExDatetime.getFullYear();
      var ExDateTimeString = ExYear + '-' + ExMonth + '-' + ExDay + ' ' + value.chooseCategoryForm.expiryTime;
      let ExTime = new Date(ExDateTimeString);

      var RDatetime = new Date(value.chooseCategoryForm.resultDate);
      var RMonth = RDatetime.getMonth() + 1;
      var RDay = RDatetime.getDate();
      var RYear = RDatetime.getFullYear();
      var RDateTimeString = RYear + '-' + RMonth + '-' + RDay + ' ' + value.chooseCategoryForm.resultTime;
      let RTime = new Date(RDateTimeString);
      if (this.questionsList.length) {
        const payload: any = {
          uuid: this.categoryUuid,
          tests: {
            uuid: this.test.uuid,
            title: value.chooseCategoryForm.title,
            imgUrl: value.chooseCategoryForm.image?.imgUrl,
            subjects: sub,
            que: this.questionsList,
            testType: value.chooseCategoryForm.testType,
            count: value.assignQuestionsForm.questions.length,
            description: value.chooseCategoryForm.description,
            time: parseInt(value.chooseCategoryForm.time),
            order: Number(value.chooseCategoryForm.order),
            // scheduledDate: value.chooseCategoryForm.scheduledDate,
            scheduledDate: new Date(time),
            expiryDate: value.chooseCategoryForm.expiryDate ? new Date(ExTime) : '',
            resultDate: value.chooseCategoryForm.resultDate ? new Date(RTime) : '',
            // expiryDate: value.chooseCategoryForm.expiryDate,
            scheduledTime: value.chooseCategoryForm.scheduledTime,
            expiryTime: value.chooseCategoryForm.expiryTime,
            resultTime: value.chooseCategoryForm.resultTime,
            rules: value.chooseCategoryForm.rules,
            testInformation: value.chooseCategoryForm.testInformation,
            pdf: value.chooseCategoryForm.pdf?.fileUrl,
            suggestedBanner: value.chooseCategoryForm.suggestedBanner?.imgUrl,
            createdOn: this.test.createdOn,
            // status: EntityStatusEnum.YET_TO_START,
            status: this.test.status,
            testStatus: parseInt(value.chooseCategoryForm.testStatus),
            positiveMarks: parseInt(value.chooseCategoryForm.positiveMarks),
            negativeMarks: parseFloat(value.chooseCategoryForm.negativeMarks),
            // totalMarks:parseInt(value.chooseCategoryForm.totalMarks),
            createdBy: this.test.createdBy,
            modifiedOn: new Date().toISOString().toString(),
            modifiedBy: {
              uuid: localStorage.getItem('currentUserUuid'),
              name: localStorage.getItem('currentUserName'),
            },
            flags: {
              active: value.chooseCategoryForm.flags?.active,
              paid: value.chooseCategoryForm.flags?.paid,
              editable: value.chooseCategoryForm.flags?.editable,
              suggested: value.chooseCategoryForm.flags?.suggested,
              testInfo: value.chooseCategoryForm.flags?.testInfo,
              subscribed: false,
            }
          }
        };
        console.log('payload', payload);
        this.commit.emit(payload);
      }
      else {
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: 'Please Assign Questions',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
    }

  }



  updateTest() {
    const value = this.form.value;

    let sub = []
    value.chooseCategoryForm.subjects.map(it => {
      sub.push({ '_id': it._id, 'uuid': it.uuid })
    })
    var dateTime = new Date(value.chooseCategoryForm.scheduledDate);
    var Month = dateTime.getMonth() + 1;
    var Day = dateTime.getDate();
    var Year = dateTime.getFullYear();
    var dateTimeString = Year + '-' + Month + '-' + Day + ' ' + value.chooseCategoryForm.scheduledTime;
    let time = new Date(dateTimeString);
    // let exactTime = time.getTime() + (5.5 * 60 * 60 * 1000);

    var ExDatetime = new Date(value.chooseCategoryForm.expiryDate);
    var ExMonth = ExDatetime.getMonth() + 1;
    var ExDay = ExDatetime.getDate();
    var ExYear = ExDatetime.getFullYear();
    var ExDateTimeString = ExYear + '-' + ExMonth + '-' + ExDay + ' ' + value.chooseCategoryForm.expiryTime;
    let ExTime = new Date(ExDateTimeString);

    var RDatetime = new Date(value.chooseCategoryForm.resultDate);
    var RMonth = RDatetime.getMonth() + 1;
    var RDay = RDatetime.getDate();
    var RYear = RDatetime.getFullYear();
    var RDateTimeString = RYear + '-' + RMonth + '-' + RDay + ' ' + value.chooseCategoryForm.resultTime;
    let RTime = new Date(RDateTimeString);
    const payload: any = {
      uuid: this.categoryUuid,
      tests: {
        uuid: this.test.uuid,
        title: value.chooseCategoryForm.title,
        imgUrl: value.chooseCategoryForm.image?.imgUrl,
        subjects: sub,
        que: this.test.que,
        testType: value.chooseCategoryForm.testType,
        count: value.assignQuestionsForm.questions.length,
        description: value.chooseCategoryForm.description,
        time: parseInt(value.chooseCategoryForm.time),
        order: Number(value.chooseCategoryForm.order),
        // scheduledDate: value.chooseCategoryForm.scheduledDate,
        scheduledDate: new Date(time),
        expiryDate: value.chooseCategoryForm.expiryDate ? new Date(ExTime) : '',
        resultDate: value.chooseCategoryForm.resultDate ? new Date(RTime) : '',
        // expiryDate: value.chooseCategoryForm.expiryDate,
        scheduledTime: value.chooseCategoryForm.scheduledTime,
        expiryTime: value.chooseCategoryForm.expiryTime,
        resultTime: value.chooseCategoryForm.resultTime,
        rules: value.chooseCategoryForm.rules,
        testInformation: value.chooseCategoryForm.testInformation,
        pdf: value.chooseCategoryForm.pdf?.fileUrl,
        suggestedBanner: value.chooseCategoryForm.suggestedBanner?.imgUrl,
        createdOn: this.test.createdOn,
        // status: EntityStatusEnum.YET_TO_START,
        status: this.test.status,
        testStatus: parseInt(value.chooseCategoryForm.testStatus),
        positiveMarks: parseInt(value.chooseCategoryForm.positiveMarks),
        negativeMarks: parseFloat(value.chooseCategoryForm.negativeMarks),
        // totalMarks:parseInt(value.chooseCategoryForm.totalMarks),
        createdBy: this.test.createdBy,
        modifiedOn: new Date().toISOString().toString(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.chooseCategoryForm.flags?.active,
          paid: value.chooseCategoryForm.flags?.paid,
          editable: value.chooseCategoryForm.flags?.editable,
          suggested: value.chooseCategoryForm.flags?.suggested,
          testInfo: value.chooseCategoryForm.flags?.testInfo,
          subscribed: false,
        }
      }
    };
    console.log('payload', payload);
    this.commit.emit(payload);
  }


  // assignQue() {
  // this.isEnableAssignQue = true;
  // console.log(this.form);
  // }
  cancel() {
    this.location.back();
  }


}
