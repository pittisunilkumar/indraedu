import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PearlsInputInterface, QuestionInterface, ResponseInterface } from '@application/api-interfaces';
import { PeralsService, QuestionsRepositoryService, SyllabusRepositoryService } from '@application/ui';
import { combineLatest, Observable, Subscription } from 'rxjs';
import {  switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl'
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-questions-container',
  templateUrl: './create-questions-container.component.html',
  styleUrls: ['./create-questions-container.component.less'],
})
export class CreateQuestionsContainerComponent implements OnInit, OnDestroy {
  public Editor = Editor
  questions: any;
  // syllabus$ = this.syllabusRepository.getOnlySubjects();
  syllabus$ = this.syllabusRepository.onlySubjects();
  // syllabus$ = this.api.getAllQBankSubjects();
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  question$: Observable<ResponseInterface<QuestionInterface>>;
  showPreview = this.router.url.includes('questions') && this.mode === 'add' || this.router.url.includes('questions') && this.mode === 'edit';
  questionToEdit: QuestionInterface;
  sub = new Subscription();
  qBankSubjectUuid: string;
  qBankChapterUuid: string;
  qBankTopicUuid: string;
  path: string;
  qBankSubjectName: string;
  qBankChapterName: string;
  qBankTopicName: string;
  ts_uuid: string;
  testUuid: string;
  testCourseName: string;
  testCategoryName: string;
  testName: string;
  order: number;
  questionsType: string;
  qTypeForm = new FormGroup({
    qtype: new FormControl('SINGLE')
  })
  QuestionsData: any;
  AllQuestions: any;
  perals: PearlsInputInterface[];
  subject_id: string;
  testSubjects: any;



  fileName: any;
  file: File | any = null;

  constructor(
    private api: QuestionsRepositoryService,
    private syllabusRepository: SyllabusRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
    private peralService: PeralsService
  ) { }

  ngOnInit(): void {
    console.log('this.Editor', this.Editor);

    this.questionsType = "SINGLE"
    this.path = window.localStorage.getItem('path');
    console.log('this.paththis.path', this.path);

    /////////// QBank  ///////////////
    // this.qBankSubjectUuid = window.sessionStorage.getItem('subjectUuid');
    // this.qBankChapterUuid = window.sessionStorage.getItem('chapteruuid');
    // this.qBankTopicUuid = window.sessionStorage.getItem('topicUuid');
    // this.qBankSubjectName = window.sessionStorage.getItem('subjectName');
    // this.qBankChapterName = window.sessionStorage.getItem('chapterName');
    // this.qBankTopicName = window.sessionStorage.getItem('topicName');
    // this.subject_id = window.sessionStorage.getItem('syllabus_id');
    this.qBankSubjectUuid = window.localStorage.getItem('subjectUuid');
    this.qBankChapterUuid = window.localStorage.getItem('chapteruuid');
    this.qBankTopicUuid = window.localStorage.getItem('topicUuid');
    this.qBankSubjectName = window.localStorage.getItem('subjectName');
    this.qBankChapterName = window.localStorage.getItem('chapterName');
    this.qBankTopicName = window.localStorage.getItem('topicName');
    this.subject_id = window.localStorage.getItem('syllabus_id');

    //////////test series ///////////////
    // this.ts_uuid = window.sessionStorage.getItem('cUuid');
    // this.testUuid = window.sessionStorage.getItem('testUuid');
    // this.testCourseName = window.sessionStorage.getItem('courseName');
    // this.testCategoryName = window.sessionStorage.getItem('categoryName');
    // this.testName = window.sessionStorage.getItem('testName');
    // this.testSubjects = JSON.parse(window.sessionStorage.getItem('testSubjects'));

    this.ts_uuid = window.localStorage.getItem('cUuid');
    this.testUuid = window.localStorage.getItem('testUuid');
    this.testCourseName = window.localStorage.getItem('courseName');
    this.testCategoryName = window.localStorage.getItem('categoryName');
    this.testName = window.localStorage.getItem('testName');
    this.testSubjects = JSON.parse(window.localStorage.getItem('testSubjects'));

   


    if (this.mode === 'edit') {
      this.sub.add(this.getQuestionByUuid$().subscribe(res => this.questionToEdit = res?.response));
      this.questionsType = window.localStorage.getItem('questionType')
      this.qTypeForm = this.formBuilder.group({
        qtype: new FormControl(window.localStorage.getItem('questionType'))
      })
    }
    this.getPeralsList();
  }

  getPeralsList() {
    this.peralService.getAllPerals().subscribe(data => {
      this.perals = data.response
    })
  }

  getQuestionByUuid$() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.api.findOne(params.get('uuid'));
      })
    );

  }
  selectquestionsType(value) {
    //  if(this.mode == 'add'){
    this.questionsType = value
    //  }

  }

  // getSubjects() {

  //   return this.api.getAllQBankSubjects().subscribe(
  //     (res) => {
  //       this.subjects = res.response;
  //     }
  //   );

  // }

  review(questions: QuestionInterface[]) {
    console.log('qstions', questions);

    this.questions = questions;
  }

  delete(index) {
    this.questions?.splice(index, 1);
  }

  edit(question: QuestionInterface) {
    this.questionToEdit = question;
  }

  onSubmit() {
    if (this.mode === 'add') {
      if (this.path == 'Qbank') {
        let questionsList = [];
        // this.order = parseInt(window.sessionStorage.getItem('lastOrder'))
        this.order = parseInt(window.localStorage.getItem('lastOrder'))
        this.questions.map(res => {
          // res.order =  this.order + 1
          questionsList.push({ "uuid": res.uuid, 'order': res.order })
          // questionsList.map(res => {
          //   this.order = res.order;
          // })
          // return this.order;
        })
        let QbankQuestions = {
          qbank_subject: this.qBankSubjectUuid,
          qbank_chapter: this.qBankChapterUuid,
          qbank_topic: this.qBankTopicUuid,
          que: this.questions,
          qbank_que: questionsList
        }
        console.log('QbankQuestions', QbankQuestions);
        this.api.qbankBulkQuestion(QbankQuestions).subscribe(data => {
          if(data.response){
            this._location.back();
          }
          })
        // this.api.qbankAddQuestion(QbankQuestions).subscribe(data => {
        //   console.log('data', data);
        //   this._location.back();
        // })
      }
      else if (this.path == 'test_series') {
        let questionsList = [];
        // this.order = parseInt(window.sessionStorage.getItem('lastOrder'))
        this.order = parseInt(window.localStorage.getItem('lastOrder'))
        this.questions.map(res => {
          // res.order =  this.order + 1
          questionsList.push({ "uuid": res.uuid, 'order': res.order, 'positive': 1, 'negative': 0 })
          // questionsList.map(res => {
          //   this.order = res.order;
          // })
          // return this.order;
        })
        let QbankQuestions = {
          ts_uuid: this.ts_uuid,
          test: this.testUuid,
          que: this.questions,
          test_que: questionsList,
          date: new Date()
        }
        console.log('QbankQuestions', QbankQuestions);
        this.api.testBulkQuestion(QbankQuestions).subscribe(data => {
          if(data.response){
            this._location.back();
          }
        })
        // this.api.testSeriesAddQuestion(QbankQuestions).subscribe(data => {
        //   console.log('data', data);
        //   this._location.back();
        // })
      }
      else {
        const obs = [];
        let QArray = [];
        this.questions.map((que) => {
          let question: any

          // this.api.getAllQuestions().subscribe(question=>{
          //    this.AllQuestions = question.response;
          //    this.AllQuestions.map(e=>{
          //      if(e.title.replace(/<(.|\n)*?>/g, '') != que.title.replace(/<(.|\n)*?>/g, '')){
          //       console.log('false');
          //      }
          //      else{
          //       console.log('true');
          //      }
          //    })
          // })

          if (que.type == "MATCH_THE_FOLLOWING") {
            question = {
              uuid: que.uuid,
              title: que.title,
              type: que.type,
              options: que.options,
              matchLeftSideOptions: que.matchLeftSideOptions,
              matchRightSideOptions: que.matchRightSideOptions,
              matchAnswer: que.matchAnswer,
              answer: que.answer,
              imgUrl: que.imgUrl,
              description: que.description,
              difficulty: que.difficulty,
              previousAppearances: que.previousAppearances,
              tags: que.tags?._id,
              // tags: que.tags,
              flags: que.flags,
              createdOn: que.createdOn,
              createdBy: que.createdBy,
              testSeries: que.testSeries,
              syllabus: que.syllabus.map(res => res._id),
              perals: que.perals.map(res => res._id),
              mathType: que.mathType,
              descriptionImgUrl: que.descriptionImgUrl,
              questionId: que.questionId,
              shortTitle:que.mathType=='no'?que.title.replace(/<(.|\n)*?>/g, '').trim():''
            };
          }
          else {
            question = {
              uuid: que.uuid,
              title: que.title,
              type: que.type,
              options: que.options,
              answer: que.answer,
              imgUrl: que.imgUrl,
              description: que.description,
              difficulty: que.difficulty,
              previousAppearances: que.previousAppearances,
              tags: que.tags?._id,
              // tags: que.tags,
              flags: que.flags,
              createdOn: que.createdOn,
              createdBy: que.createdBy,
              testSeries: que.testSeries,
              syllabus: que.syllabus.map(res => res._id),
              perals: que.perals.map(res => res._id),
              mathType: que.mathType,
              descriptionImgUrl: que.descriptionImgUrl,
              questionId: que.questionId,
              shortTitle:que.mathType=='no'?que.title.replace(/<(.|\n)*?>/g, '').trim():''
            };
          }

          QArray.push(question)
          // console.log('question', question);
          // obs.push(this.api.addQuestion(question));
        });
        obs.push(this.api.addQuestion(QArray));
        return combineLatest(obs).subscribe(
          (res) => {
            console.log({ res });

            this.questions = [];
            // this.router.navigateByUrl('/bank/questions/list');
            this._location.back();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    } else {
      this.api.editQuestion(this.questions[0]).subscribe(
        (res) => {
          console.log({ res });
          this.questions = [];
          // this.router.navigateByUrl('/bank/questions/list');
          this._location.back();
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
    }
    // window.sessionStorage.removeItem('questionType');
    window.localStorage.removeItem('questionType')

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }












  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  FileSubmited() {
    let array = [];
    let finalArray = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = async () => {
      this.QuestionsData = JSON.parse(fileReader.result);
      this.QuestionsData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: res.Question,
          type: 'SINGLE',
          options: JSON.parse(res.options),
          answer: JSON.parse(res.Answer),
          imgUrl: '',
          description: res.description,
          difficulty: res.difficulty,
          previousAppearances: res.previous_appearance,
          // tags: res.tags,
          // questionId: res.question_id,
          perals: [],
          tags: "61c169ed32bc7251f8b06f65",
          questionId: '',
          flags: {
            pro: false,
            editable: true,
            qBank: true,
            active: true,
            testSeries: true,
          },
          testSeries: null,
          syllabus: [res.syllabus],
          mathType: res.math_library,
          descriptionImgUrl: '',
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        // let cData = {
        //   uuid: res.uuid,
        //   title: res.title,
        // }
        array.push(cData)
      })
      console.log('array', array);

      // this.api.updateShortTitle(array).subscribe(data => {
      //   if (data) {
      //     console.log(data);
      //   }
      // })


      let result = []
      function find_duplicate_in_array(arr) {
        const count = {}
        arr.forEach(item => {
          if (count[item.title.replace(/<(.|\n)*?>/g, '')]) {
            count[item.title.replace(/<(.|\n)*?>/g, '')] += 1
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != item.title.replace(/<(.|\n)*?>/g, '')
            })
            result.push(item)
            return
          }
          count[item.title.replace(/<(.|\n)*?>/g, '')] = 1
        })
      }
      find_duplicate_in_array(array)
      result.map(res => {
        array.push(res)
      })
      this.AllQuestions = await this.api.getAllQuestions().toPromise();
      this.AllQuestions.response.find(QDATA => {
        array.map(e => {
          if (QDATA.title.replace(/<(.|\n)*?>/g, '') == e.title.replace(/<(.|\n)*?>/g, '')) {
            console.log(QDATA.title);
            QDATA.syllabus = QDATA.syllabus.filter(res => {
              return res._id != this.subject_id
            })
            QDATA.syllabus.push({_id:this.subject_id})
            this.api.editQuestionByJsonFile(QDATA).subscribe((res) => { } );
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != e.title.replace(/<(.|\n)*?>/g, '')
            })
          }
        })
      })
      console.log('finalArray', array);
      this.api.addManyQuestions(array).subscribe(data => {
        if (data) {
          console.log(data);
        }
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }
  FileTopicQueSubmited() {
    this.order = parseInt(window.localStorage.getItem('lastOrder'))
    let array = [];
    let questionsList = [];
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = async () => {
      this.QuestionsData = JSON.parse(fileReader.result);
      this.QuestionsData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: res.Question,
          type: 'SINGLE',
          // options: JSON.parse(res.options),
          // answer: JSON.parse(res.Answer),
          options: res.options,
          answer: res.Answer,
          imgUrl: res.Question_image == "" ? '' : res.Question_image,
          description: res.description == "" ? 'description' : res.description,
          difficulty: res.difficulty == "" ? 'EASY' : res.difficulty,
          previousAppearances: res.previous_apperance == '' ?  '':res.previous_apperance ,
          perals: [],
          tags: null,
          // questionId: res.question_id,
          questionId: '',
          flags: {
            pro: false,
            editable: true,
            qBank: true,
            active: true,
            testSeries: true,
          },
          testSeries: null,
          // syllabus: [res.syllabus]
          syllabus: [this.subject_id],
          mathType: res.math_library,
          descriptionImgUrl: res.description_image == "" ? '' : res.description_image,
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        array.push(cData)
      })
      console.log('array', array);
      let result = []
      function find_duplicate_in_array(arr) {
        const count = {}
        arr.forEach(item => {
          if (count[item.title.replace(/<(.|\n)*?>/g, '')]) {
            count[item.title.replace(/<(.|\n)*?>/g, '')] += 1
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != item.title.replace(/<(.|\n)*?>/g, '')
            })
            result.push(item)
            return
          }
          count[item.title.replace(/<(.|\n)*?>/g, '')] = 1
        })
      }
      find_duplicate_in_array(array)
      result.map(res => {
        array.push(res)
      })
      this.AllQuestions = await this.api.getAllQuestions().toPromise();
      this.AllQuestions.response.find(QDATA => {
        array.map(e => {
          if (QDATA.title.replace(/<(.|\n)*?>/g, '') == e.title.replace(/<(.|\n)*?>/g, '')) {
            questionsList.push({ "uuid": QDATA.uuid, 'order': this.order + 1 });
            QDATA.syllabus = QDATA.syllabus.filter(res => {
              return res._id != this.subject_id
            })
            QDATA.syllabus.push({_id:this.subject_id})
            questionsList.map(res => {
              this.order = res.order;
            })
            // console.log('QDATA',QDATA);
            this.api.editQuestionByJsonFile(QDATA).subscribe((res) => { } );
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != e.title.replace(/<(.|\n)*?>/g, '')
            })
          }
        })
      })
      array.map(res => {
        questionsList.push({ "uuid": res.uuid, 'order': this.order + 1 })
        questionsList.map(res => {
          this.order = res.order;
        })
      })

      console.log('finalArray', array);
      let QbankQuestions = {
        qbank_subject: this.qBankSubjectUuid,
        qbank_chapter: this.qBankChapterUuid,
        qbank_topic: this.qBankTopicUuid,
        que: array,
        qbank_que: questionsList
      }
      console.log('QbankQuestions', QbankQuestions);
      this.api.qbankBulkQuestion(QbankQuestions).subscribe(data => {
        this._location.back();
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }


  FileTestQueSubmited() {
    console.log(this.testSubjects.map(res=>res._id));
    
    this.order = parseInt(window.localStorage.getItem('lastOrder'))
    let array = [];
    let questionsList = [];
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = async () => {
      this.QuestionsData = JSON.parse(fileReader.result);
      this.QuestionsData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: res.Question,
          type: 'SINGLE',
          // options: JSON.parse(res.options),
          // answer: JSON.parse(res.Answer),
          options: res.options,
          answer: res.Answer,
          imgUrl: res.Question_image == "" ? '' : res.Question_image,
          description: res.description == "" ? 'description' : res.description,
          difficulty: res.difficulty == "" ? 'EASY' : res.difficulty,
          previousAppearances: res.previous_apperance == '' ?  '':res.previous_apperance ,
          perals: [],
          tags: null,
          // questionId: res.question_id,
          questionId: '',
          flags: {
            pro: false,
            editable: true,
            qBank: true,
            active: true,
            testSeries: true,
          },
          testSeries: null,
          // syllabus: [res.syllabus]
          syllabus:this.testSubjects.map(res=>res._id),
          mathType: res.math_library,
          descriptionImgUrl: res.description_image == "" ? '' : res.description_image,
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        array.push(cData)
      })

      console.log('array', array);
      let result = []
      function find_duplicate_in_array(arr) {
        const count = {}
        arr.forEach(item => {
          if (count[item.title.replace(/<(.|\n)*?>/g, '')]) {
            count[item.title.replace(/<(.|\n)*?>/g, '')] += 1
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != item.title.replace(/<(.|\n)*?>/g, '')
            })
            result.push(item)
            return
          }
          count[item.title.replace(/<(.|\n)*?>/g, '')] = 1
        })
      }
      find_duplicate_in_array(array)
      result.map(res => {
        array.push(res)
      })
      this.AllQuestions = await this.api.getAllQuestions().toPromise();
      this.AllQuestions.response.find(QDATA => {
        array.map(async e => {
          if (QDATA.title.replace(/<(.|\n)*?>/g, '') == e.title.replace(/<(.|\n)*?>/g, '')) {
            questionsList.push({ "uuid": QDATA.uuid, 'order': this.order + 1,'positive': 1, 'negative': 0 })
            
            questionsList.map(res => {
              this.order = res.order;
            })
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != e.title.replace(/<(.|\n)*?>/g, '')
            })
             await this.testSubjects.map(async tsub=>{
              QDATA.syllabus = QDATA.syllabus.filter(res => {
                return res._id != tsub._id
              })
             await QDATA.syllabus.push({_id:tsub._id});
              // this.api.editQuestionByJsonFile(QDATA).subscribe((res) => { } );
            })
          }
        })
      })
     
      array.map(res=>{
        questionsList.push({ "uuid": res.uuid, 'order': this.order + 1,'positive': 1, 'negative': 0 })
        questionsList.map(res => {
          this.order = res.order;
        })
      })

      console.log('finalArray', array);
      // array.map(res => {
        // questionsList.push({ "uuid": res.uuid, 'order': 1 })
        // let QbankQuestions = {
        //   ts_uuid: res.category_id,
        //   test: res.test_uuid,
        //   que: [res],
        //   test_que: [{ "uuid": res.uuid, 'order': 1 }]
        // }
        //console.log('QbankQuestions',QbankQuestions);
        // this.api.testSeriesAddQuestion(QbankQuestions).subscribe(data => {})
      // })
      let QbankQuestions = {
        ts_uuid: this.ts_uuid,
        test: this.testUuid,
        que: array,
        test_que: questionsList
      }

       console.log('testQuestions', QbankQuestions);
      // this.api.testSeriesAddQuestion(QbankQuestions).subscribe(data => {
      //   this._location.back();
      // })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }
}
