import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  PearlsInputInterface,
  QuestionInterface,
  QuestionOptionsInterface,
  SyllabusInterface,
  TagInterface,
} from '@application/api-interfaces';
import { AWSS3Service, HelperService, NotificationService, NotificationType, QuestionsRepositoryService, SyllabusRepositoryService, TagsRepositoryService } from '@application/ui';
import * as uuid from 'uuid';
// import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl'


@Component({
  selector: 'application-create-questions',
  templateUrl: './create-questions.component.html',
  styleUrls: ['./create-questions.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateQuestionsComponent implements OnInit, OnChanges {

  // public Editor = Editor
  public config: any;
  @Input() Editor: any;


  @Input() syllabus: SyllabusInterface[];
  @Input() question: QuestionInterface;
  @Input() mode: string;
  @Input() perals: PearlsInputInterface[];

  @Input() type: string;
  @Output() review = new EventEmitter<QuestionInterface[]>();
  @Output() commit = new EventEmitter();


  // subjects: any;
  tags: TagInterface[];
  tagsList: any;

  createQuestionForm: FormGroup;
  // type = "SINGLE";
  questionsArray: any[] = [];
  imgUrl: string;
  optionsCount = 1;
  ansArray: number[] = [];
  multipleTypeAnsValue = [];
  isChecked: boolean;
  path: string;
  subjectName: string;
  subject_id: string;
  testSubjects: any;
  order:number;
  loading = false;


  insertPeralArray = [];
  deletePeralArray = [];

  // qBankSubjectUuid:string;
  // qBankChapterUuid:string;
  // qBankTopicUuid:string;

  constructor(
    private formBuilder: FormBuilder,
    private awsS3: AWSS3Service,
    private syllabusRepository: SyllabusRepositoryService,
    private questionService: QuestionsRepositoryService,
    private tagsRepo: TagsRepositoryService,
    public helper:HelperService,
    private notification: NotificationService,
  ) { 
    this.config = this.helper.editorProperties()
  }

  ngOnInit(): void {
    console.log('this.perals',this.perals);
    this.order = parseInt(window.localStorage.getItem('lastOrder'))
    this.path = window.localStorage.getItem('path');
    console.log(' this.path', this.path);
    this.subjectName = window.localStorage.getItem('subjectName');
    this.subject_id = window.localStorage.getItem('syllabus_id');
    this.testSubjects = JSON.parse(window.localStorage.getItem('testSubjects'));
    

    this.buildForm();
    if (this.mode === 'add') {
      this.addOptions(this.optionsCount);
    }
    // this.createQuestionForm.controls.type.valueChanges.subscribe((value) => {
    //   this.type = value;
    //   this.getType(value);
    //   console.log('type', this.type);
    // });

    // this.syllabusRepository.onlySubjects().subscribe(data => {
    //   this.subjects = data
    // })

    this.tagsRepo.getAllActiveTags().subscribe(data => {
      this.tags = data.response;
      this.tagsList = new MatTableDataSource(this.tags)
    })

    // this.createQuestionForm.controls.answer.valueChanges.subscribe((value) => {
    //   this.updateAnswer(value);
    //   console.log('type', this.type);
    // });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.question?.currentValue) {
      this.question = changes?.question?.currentValue;   
      this.insertPeralArray = this.question?.perals.map(res=>res?._id)
      this.buildForm();
    }

  }
  tagsFilter(event: any) {
    this.tagsList.filter = event.target.value.trim().toLowerCase();
    this.tags = this.tagsList.filteredData;
  }

  // questionsBySubject(subject) {
  //   this.questionsRepo.getAllQuestionsBySyllabusId(subject._id).subscribe(data => {
  //     if (data) {
  //       this.filteredQuestions = data.response;
  //       this.subjectLength = data.response.length
  //       this.filteredQuestions = new MatTableDataSource(this.filteredQuestions);
  //       this.filteredQuestions.paginator = this.paginator;
  //       this.total = this.filteredQuestions.data.length;
  //       this.isEnabled = true
  //     }
  //   })
  // }  

  buildForm() {
    console.log('this.question', this.question);
    console.log('path', this.path);
    // if (this.mode == 'edit') {
    //   this.ansArray = this.question?.answer.options;
      // this.ansArray?.map((res,i)=>{
      //  this.multipleTypeAnsValue[i] = res;
      // this.multipleTypeAnsValue.push({'val':res,'index':i})
      // console.log('multipleTypeAnsValue',this.multipleTypeAnsValue);
      // });



      // this.question?.options.map(res=>{
      //   this.multipleTypeAnsValue.push(res.value)
      // })
      // this.ansArray?.map(e=>{
      // this.multipleTypeAnsValue.map(res=>{
      //     console.log('res == e',res == e);
      //     if(res == e){
      //        this.isChecked = true
      //       //  console.log(' this.isChecked', this.isChecked);
      //     }
      //   })
      // })

    // }
    // console.log('multipleTypeAnsValue', this.multipleTypeAnsValue);
    // console.log('this.ansArray', this.ansArray);


    
    this.createQuestionForm = this.formBuilder.group({
      title: this.question ? this.question?.title : '',
      // type: this.question ? this.question?.type : 'SINGLE',
      options: this.formBuilder.array(
        this.question ?
          this.question?.options.map((option, index) => this.newOption(index, option)) : []),
      answer: [
        this.question ? this.question.answer.options : [],
        Validators.compose([Validators.required]),
      ],
      imgUrl: this.formBuilder.group({
        imgUrl: this.question ? this.question?.imgUrl : '',
        upload: false,
      }),
      description:[ this.question ? this.question?.description : '', Validators.required],
      descriptionImgUrl: this.formBuilder.group({
        imgUrl: this.question ? this.question?.descriptionImgUrl : '',
        upload: false,
      }),
      difficulty: [this.question ? this.question?.difficulty : '', Validators.required],
      previousAppearances: this.question ? this.question?.previousAppearances : '',
      tags: this.question ? this.question?.tags : [],
      flags: this.formBuilder.group({
        pro: this.question ? this.question?.flags.pro : false,
        editable: this.question ? this.question?.flags.editable : true,
        qBank: this.question ? this.question?.flags.qBank : true,
        active: this.question ? this.question?.flags.active : true,
        testSeries: this.question ? this.question?.flags.testSeries : true,
        paid: this.question ? this.question?.flags?.paid : true,
      }),
      syllabus: [this.question ? this.question.syllabus : [], Validators.required],
      perals: [this.question ? this.question.perals : []],
      mathType: [this.question ? this.question.mathType :'no', Validators.required],
      order:[this.order],
    });
    // console.log("createQuestionForm.get('options')['controls']",this.createQuestionForm?.get('options')['controls']);
    // this.ansArray?.map(e=>{
    // this.createQuestionForm?.get('options')['controls'].map(val=>{
    //     console.log(val.value.value == e);
    //      if(val.value.value == e){
    //       this.isChecked = true
    //      }
    //   })
    // })
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.createQuestionForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  getDescriptionImgUrl(data: { fileUrl: string; upload: boolean }) {
    this.createQuestionForm.controls['descriptionImgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  getOptionsUrl(data: { fileUrl: string; upload: boolean }, index: string) {
    // createQuestionForm.get('options')['controls'][i].value.upload
    console.log(data, "=>", index);

    this.createQuestionForm.get('options')['controls'][index].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
    console.log(this.createQuestionForm.value);

  }


  get options(): FormArray {
    return this.createQuestionForm?.get('options') as FormArray;
  }

  newOption(index: number, option?: QuestionOptionsInterface): FormGroup {
    console.log('optionsCountoptionsCount',index);
    
    return this.formBuilder.group({
      // name: option ? option.name : `TEST OPTION ${index + 1}`,
      name: option ? option.name : '',
      value: ++index,
      imgUrl: option ? option.imgUrl : '',
      upload: option ? option.imgUrl !== '' ? false : true : false,
    });
  }

  addOptions(count: number) {
    for (let i = 0; i < count; i++) {
      this.options?.push(this.newOption(i));
      // this.ansArray.push(0)
    }
  }

  addNewOption() {
    ++this.optionsCount;
    return this.options?.push(this.newOption(this.optionsCount));
  }

  removeOption(i) {
    return this.options.removeAt(i)
  }

  // toggleImgUrlTextBox(event) {
  //   event.target.value = event.target.checked;
  // }

  updateAnswer(event, val: number, index: number) {
    // if(this.mode == 'edit'){
    //   this.ansArray = this.question?.answer.options
    //  }

    if (this.type === 'SINGLE') {
      this.createQuestionForm.get('answer').setValue(val);
    } else {
      // const arr = []
      // if (arr?.indexOf(val) === -1) {
      //   this.createQuestionForm.get('answer').setValue(arr);
      // }
      if (event.checked == true) {
        this.ansArray = [...this.ansArray, val]
      }
      else {
        this.ansArray = this.ansArray.filter((value: any, key: any) => {
          return value != val;
        });
      }
      console.log('this.ansArray', this.ansArray);

      this.createQuestionForm.get('answer').setValue(this.ansArray);
    }

  }



  getType(value: string) {
    switch (value) {
      case 'SINGLE':
      case 'MULTIPLE': {
        this.createQuestionForm.controls.options.setValidators([
          Validators.required,
        ]);
        this.createQuestionForm.controls.answer.setValidators([
          Validators.required,
        ]);
        this.createQuestionForm.updateValueAndValidity();
        break;
      }
      case 'FIB':
      case 'IMG':
      case 'ESSAY': {
        this.createQuestionForm.controls.options.setValidators([]);
        this.createQuestionForm.controls.answer.setValidators([]);
        this.createQuestionForm.updateValueAndValidity();
        break;
      }
    }
  }

  compareFn(c1: SyllabusInterface, c2: SyllabusInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  async upload(
    event,
    option?: {
      name: string;
      value: number;
      imgUrl: string;
      upload: boolean;
    }
  ) {
    console.log('img upload', event, option);

    // if (this.checkFileExists(event[0].name)) {
    await this.awsS3.uploadFile(event).then((result) => {
      if (option) {
        option.imgUrl = result[0]?.Location;
      } else {
        this.createQuestionForm.controls.imgUrl.patchValue({
          url: result[0]?.Location,
        });
      }
    });
  }

  insertAndDeleteArray(event, peral) {
    if (event == true) {
      this.insertPeralArray = this.insertPeralArray.filter(res=>{
        return res != peral
      })
      this.deletePeralArray = this.deletePeralArray.filter(res=>{
        return res != peral
      })
      this.insertPeralArray.push(peral);
    }
    else if (event == false) {
      this.deletePeralArray = this.deletePeralArray.filter(res=>{
        return res != peral
      })
      this.insertPeralArray = this.insertPeralArray.filter(res=>{
        return res != peral
      })
      this.deletePeralArray.push(peral);
    }
  }

  buildQuestionsArray() {
    const createForm = this.createQuestionForm.value;
    createForm.title = createForm.title.split('<p>&nbsp;</p>').join('<br>');
    createForm.title = createForm.title.split('</p><p>').join('<br>');
    createForm.description = createForm.description.split('<p>&nbsp;</p>').join('<br>');
    createForm.description = createForm.description.split('</p><p>').join('<br>');
    if(createForm.description.includes('</table>')){
      createForm.description = createForm.description.split('<figure class="table">').join('<div style="overflow-x:auto;">');
      createForm.description = createForm.description.split('</figure>').join('</div>');
    // createForm.description =
    //   `<!DOCTYPEhtml><html><head><metaname="viewport"content="width=device-width,initial-scale=1"><style>table{border-collapse:collapse;border-spacing:0;width:100%;border:1pxsolid#ddd;}th,td{text-align:left;padding:8px;}tr:nth-child(even){background-color:#f2f2f2}</style></head><body>${createForm.description}</body></html>`;
    }
    let syllabus_id: any;
    let peral_id:any;
    if (this.path == 'Qbank') {
      syllabus_id = [this.subject_id]
      peral_id =createForm.perals ? createForm.perals.map(res=>res._id):[]
    }
    else if (this.path == 'test_series') {
      syllabus_id = this.testSubjects.map(res=>res._id);
      peral_id =createForm.perals ? createForm.perals.map(res=>res._id):[]
    }
    else {
      // syllabus_id = createForm.syllabus.map(res => res._id)
      syllabus_id = createForm.syllabus.map(res => res);
      peral_id =createForm.perals ? createForm.perals.map(res=>res._id):[]
    }
    createForm.options.map((res,i)=>{
      createForm.options[i].name = createForm.options[i].name.split('<p>&nbsp;</p>').join('<br>')
      createForm.options[i].imgUrl = res.imgUrl ?res.imgUrl:'';
      createForm.options[i].upload = res.imgUrl == '' ? false : true ;
      return createForm.options[i].value = i+1
    })

    if (this.mode === 'add') {

      const question: any = {
        uuid: uuid.v4(),
        title: createForm.title,
        type: this.type,
        options: createForm.options,
        answer: { options: createForm.answer },
        imgUrl: createForm.imgUrl.imgUrl?createForm.imgUrl.imgUrl:'',
        description: createForm.description,
        difficulty: createForm.difficulty,
        previousAppearances: createForm.previousAppearances,
        tags: createForm.tags,
        flags: createForm.flags,
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        testSeries: null,
        syllabus: syllabus_id,
        perals:peral_id,
        descriptionImgUrl: createForm.descriptionImgUrl.imgUrl ? createForm.descriptionImgUrl.imgUrl:'',
        mathType:createForm.mathType,
        questionId:'',
        order:createForm.order ? parseInt(createForm.order):this.order,
        shortTitle:createForm?.title.replace(/<(.|\n)*?>/g, '').trim(),
      };
      console.log(question);

      this.questionsArray.push(question);

    } else {
      this.insertPeralArray.map(e=>{
        this.question.perals.map(res=>{
          if( res._id == e){
            this.insertPeralArray =  this.insertPeralArray.filter(d=>{
              return res._id != d
            })
          }
        })
      })
      this.deletePeralArray.map(e=>{
        this.question.perals.map(res=>{
          if( res._id != e){
            this.deletePeralArray =  this.deletePeralArray.filter(d=>{
              return res._id != e
            })
          }
        })
      })
      const question: any = {
        _id:this.question._id,
        uuid: this.question.uuid,
        title: createForm.title,
        type: this.type,
        options: createForm.options,
        answer: { options: createForm.answer },
        imgUrl: createForm.imgUrl.imgUrl?createForm.imgUrl.imgUrl:'',
        description: createForm.description,
        difficulty: createForm.difficulty,
        previousAppearances: createForm.previousAppearances,
        tags: createForm.tags,
        flags: createForm.flags,
        createdOn: this.question.createdOn,
        createdBy: this.question.createdBy,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        testSeries: null,
        syllabus: createForm.syllabus,
        perals: createForm.perals,
        insertPeralArray: this.insertPeralArray,
        deletePeralArray :this.deletePeralArray,
        descriptionImgUrl: createForm.descriptionImgUrl.imgUrl ? createForm.descriptionImgUrl.imgUrl:'',
        mathType:createForm.mathType,
        shortTitle:createForm?.title.replace(/<(.|\n)*?>/g, '').trim(),
        order:createForm.order ? parseInt(createForm.order):this.order
      };
     console.log('questionquestion',question);

      this.questionsArray.push(question);

    }
    this.createQuestionForm.reset();
    // this.createQuestionForm.get('type').setValue(createForm.type);
  }

  onSubmit() {
    this.commit.emit();
    this.loading = false;

  }

  onReview() {
    // if(this.createQuestionForm.valid){
    this.buildQuestionsArray();
    this.review.emit(this.questionsArray);
    this.loading = true
    
    // }
    // else if(!this.createQuestionForm.valid){
    //   alert('Please Select All Fields')
    //   console.log('Please Select All Fields');

    // }

    // this.checkQuestion(this.questionsArray)
  }
  checkQuestion(question) {
    this.questionService.CheckQuestionBeforeAdd(question[0]).subscribe(data => {
      console.log(data);
    })
  }

  checkExistedQuestion(){

    let filterValue = this.createQuestionForm.value.title.replace(/<(.|\n)*?>/g, '');

    let data = {
      search : filterValue.trim()
    }
    if (filterValue) {
      this.questionService.searchQuestion(data).subscribe(
        (res: any) => {
          console.log(res);
          if(res?.response?.length){
            this.notification.showNotification({
              type: NotificationType.ERROR,
              payload: {
                message: 'This question was already existed',
                statusCode: 200,
                statusText: 'Successfully',
                status: 201,
              },
            });
          }else{
            this.notification.showNotification({
              type: NotificationType.SUCCESS,
              payload: {
                message: 'This is a new question',
                statusCode: 200,
                statusText: 'Successfully',
                status: 201,
              },
            });
          }
        },
        (err) => { }
      );
    }
  
  }

  onReset() {
    this.createQuestionForm.reset();
  }
}
