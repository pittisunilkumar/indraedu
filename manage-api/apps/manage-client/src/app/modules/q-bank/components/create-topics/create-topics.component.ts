import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { QBankInterface, SelectedQuestionInterface, TestInterface } from '@application/api-interfaces';
import { CourseRepositoryService, HelperService, NotificationService, NotificationType, QBankRepositoryService, QuestionsRepositoryService, SyllabusRepositoryService } from '@application/ui';
import { switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';
import { EntityStatusEnum } from '../../../../../../../../libs/api-interfaces/src/lib/api-interfaces';
import { QBankDataInterface } from '../../containers';
@Component({
  selector: 'application-qbank-create-topics',
  templateUrl: './create-topics.component.html',
  styleUrls: ['./create-topics.component.less']
})
export class CreateTopicsComponent implements OnInit, OnChanges {

  @Input() data: QBankDataInterface;
  @Input() mode: string;
  @Input() topic: QBankInterface;
  @Input() isApiCalling: boolean;
  @Input() total: number;

  // @Input() questionsAssigned: Array<String>;
  @Output() commit = new EventEmitter<QBankInterface>();
  subjectUuid: any;
  selectedQuestionsCount = 0;
  assignedQuestionsFilter: any
  // isEditable:boolean;


  form: FormGroup;
  questionsAssigned = [];
  questions = []
  subjectName: string;
  couresName: string;
  chapter: any;
  constructor(
    private _formBuilder: FormBuilder,
    public helper: HelperService,
    private location: Location,
    private _snackBar: MatSnackBar,
    private syllabusRepo: SyllabusRepositoryService,
    private coursesRepo: CourseRepositoryService,
    private route: ActivatedRoute,
    private qbankRepo: QBankRepositoryService,
    private questionService: QuestionsRepositoryService,
    private notification: NotificationService,

  ) { }

  ngOnInit() {
    this.subjectUuid = this.route.snapshot.paramMap.get('uuid')
    this.form = this.buildForm();
    this.form.controls['chooseCategoryForm'].get('subjects')
    this.storeQstionUuid();

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('chapterslist', this.data?.subject);
    if (changes?.topic?.currentValue) {
      this.topic = changes?.topic?.currentValue;
      this.form = this.buildForm();
      this.storeQstionUuid();
    }

  }
  storeQstionUuid() {
    this.questionsAssigned = [];
    this.topic?.que.forEach(question => {
      this.questionsAssigned.push({ uuid: question?.uuid, order: question?.order, title: question?.title });
    });
    // console.log('questionsAssigned',this.questionsAssigned);

  }
  // getQuestions(){
  //   this.form.value.assignQuestionsForm.questions = this.topic?.que
  //   console.log(this.form.value.assignQuestionsForm.questions);
  // }

  buildForm() {
    console.log('topic', this.topic);
    // console.log(this.topic?.que);
    // this.questionsAssigned = this.topic?.que

    let createTopicForm = this._formBuilder.group({
      chooseCategoryForm: this._formBuilder.group({
        title: [this.topic ? this.topic.title : '', Validators.required],
        description: [this.topic ? this.topic.description : '', Validators.required],
        order: [this.topic ? this.topic.order : '', Validators.required],
        scheduledDate: [this.topic ? this.topic.scheduledDate : '', Validators.required],
        pdf: this._formBuilder.group({
          fileUrl: this.topic ? this.topic?.pdf?.fileUrl : '',
          upload: this.topic?.pdf ? true : false,
        }),
        image: this._formBuilder.group({
          imgUrl: this.topic ? this.topic?.image?.imgUrl : '',
          upload: this.topic?.image ? false : true,
        }),
        icon: this._formBuilder.group({
          imgUrl: this.topic ? this.topic?.icon?.imgUrl : '',
          upload: this.topic?.icon ? false : true,
        }),
        suggestedBanner: this._formBuilder.group({
          imgUrl: this.topic?.suggestedBanner ? this.topic?.suggestedBanner?.imgUrl : '',
          upload: this.topic?.suggestedBanner ? false : true,
        }),
        chapter: [this.topic ? this.topic.chapter : null, Validators.required],
        flags: this._formBuilder.group({
          active: this.topic ? this.topic?.flags.active : true,
          suggested: this.topic ? this.topic?.flags.suggested : false,
          paid: this.topic ? this.topic?.flags.paid : true,
          //  active: true, suggested: true, paid: true
        }),
      }),
      assignQuestionsForm: this._formBuilder.group({
        questions: [this.topic ? this.topic.que : [], Validators.required],
      }),
    });
    console.log(createTopicForm);


    return createTopicForm;

  }

  getFileUrl(data: { fileUrl: string; upload: boolean }, control: string) {
    console.log(data.fileUrl, control);

    switch (control) {
      case 'imgUrl': {
        this.form.controls.chooseCategoryForm?.get('image').patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;
      }
      case 'iconUrl': {
        this.form.controls.chooseCategoryForm?.get('icon').patchValue({
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
      order: 1,
    })
  }

  addNewGroup() {
    this.marksOrder.push(this.newGroup());
  }

  getSubjectName() {
    this.subjectName = this.data?.subject.syllabus.title
    this.couresName = this.data?.subject.courses.title
  }

  async assignQuestions(payload: any) {
    //  console.log('payload', payload);
    // let array =[]
    // let questions
    // this.data?.questions.map(e => {
    //   payload.map(res => {
    //     if (e.uuid === res.que.uuid) {
    //       questions = {
    //         isSelected: true,
    //         negative: null,
    //         order: parseInt(res.order),
    //         positive: null,
    //         que: e
    //       }
    //       array.push(questions)
    //     }
    //   })
    // })
    // console.log('array',array);
    // payload = array
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
      this.questions.push({
        "_id": res.que?._id,
        "uuid": res.que?.uuid,
        "order": parseInt(res.order)
      })
    })
    const value = this.form.value;
    value.assignQuestionsForm.questions.map(it => {
      it.order = Number(it.order);
      return it;
    });

    if (this.mode === 'add') {
      const payload: any = {
        subject: this.data.subject.syllabus._id,
        courses: this.data?.subject.courses._id,
        chapter: value.chooseCategoryForm.chapter._id,
        chapter_id: value.chooseCategoryForm.chapter._id,
        topics: {
          uuid: uuid.v4(),
          title: this.form.value.chooseCategoryForm.title,
          description: this.form.value.chooseCategoryForm.description,
          order: parseInt(this.form.value.chooseCategoryForm.order),
          scheduledDate: this.form.value.chooseCategoryForm.scheduledDate,
          pdf: this.form.value.chooseCategoryForm.pdf,
          image: this.form.value.chooseCategoryForm.image,
          icon: this.form.value.chooseCategoryForm.icon,
          suggestedBanner: value.chooseCategoryForm.suggestedBanner,
          flags: {
            active: this.form.value.chooseCategoryForm.flags.active,
            suggested: this.form.value.chooseCategoryForm.flags.suggested,
            paid: this.form.value.chooseCategoryForm.flags.paid
          },
          que: this.questions,
          createdOn: new Date(),
          modifiedOn: null,
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
        },
      };
      console.log(payload);
      this.commit.emit(payload);
    } else {      
      if(this.questions.length){
        let payload: any = {
          chapter_uuid: value.chooseCategoryForm.chapter.uuid,
          chapter_id: value.chooseCategoryForm.chapter._id,
          subject: this.data.subject.syllabus._id,
          courses: this.data?.subject.courses._id,
          qbank_subject_uuid: this.subjectUuid,
          topic_uuid: this.topic.uuid,
          topics: {
            uuid: this.topic.uuid,
            title: this.form.value.chooseCategoryForm.title,
            description: this.form.value.chooseCategoryForm.description,
            order: parseInt(this.form.value.chooseCategoryForm.order),
            scheduledDate: this.form.value.chooseCategoryForm.scheduledDate,
            pdf: this.form.value.chooseCategoryForm.pdf,
            image: this.form.value.chooseCategoryForm.image,
            icon: this.form.value.chooseCategoryForm.icon,
            suggestedBanner: value.chooseCategoryForm.suggestedBanner,
            // pdf: this.form.value.chooseCategoryForm.pdf.fileUrl?.fileUrl ? { fileUrl: this.form.value.chooseCategoryForm.pdf.fileUrl.fileUrl, upload: true } : this.form.value.chooseCategoryForm.pdf,
            // image: this.form.value.chooseCategoryForm.image.imgUrl?.imgUrl ? { imgUrl: this.form.value.chooseCategoryForm.image.imgUrl.imgUrl, upload: true } : this.form.value.chooseCategoryForm.image,
            // icon: this.form.value.chooseCategoryForm.icon.imgUrl?.imgUrl ? { imgUrl: this.form.value.chooseCategoryForm.icon.imgUrl.imgUrl, upload: true } : this.form.value.chooseCategoryForm.icon,
            flags: {
              active: this.form.value.chooseCategoryForm.flags.active,
              suggested: this.form.value.chooseCategoryForm.flags.suggested,
              paid: this.form.value.chooseCategoryForm.flags.paid
            },
            que: this.questions,
            createdOn: this.topic.createdOn,
            createdBy: this.topic.createdBy,
            modifiedOn: new Date(),
            modifiedBy: {
              uuid: localStorage.getItem('currentUserUuid'),
              name: localStorage.getItem('currentUserName'),
            },
          },
        };
  
        console.log(payload);
  
        this.commit.emit(payload);
      }
      else{
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
   



      // const payload: QBankInterface = {
      //   uuid: this.topic.uuid,
      //   title: value.chooseCategoryForm.title,
      //   imgUrl: value.chooseCategoryForm.image?.imgUrl,
      //   iconUrl: value.chooseCategoryForm.icon?.imgUrl,
      //   subject: this.data.subject,
      //   chapter: value.chooseCategoryForm.chapter,
      //   questions: value.assignQuestionsForm.questions,
      //   count: value.assignQuestionsForm.questions.length,
      //   description: value.chooseCategoryForm.description,
      //   order: Number(value.chooseCategoryForm.order),
      //   scheduledDate: value.chooseCategoryForm.scheduledDate,
      //   pdf: value.chooseCategoryForm.pdf.fileUrl,
      //   createdOn: this.topic.createdOn,
      //   createdBy: this.topic.createdBy,
      //   modifiedBy: {
      //     uuid: localStorage.getItem('currentUserUuid'),
      //     name: localStorage.getItem('currentUserName'),
      //   },
      //   modifiedOn: new Date(),
      //   flags: {
      //     active: true,
      //     editable: true,
      //     suggested: true,
      //     subscribed: false,
      //   }
      // };


      // const payload: QBankInterface = {
      //   uuid: uuid.v4(),
      //   title: value.chooseCategoryForm.title,
      //   imgUrl: value.chooseCategoryForm.image?.imgUrl,
      //   iconUrl: value.chooseCategoryForm.icon?.imgUrl,
      //   subject: this.data.subject,
      //   chapter: value.chooseCategoryForm.chapter,
      //   questions: value.assignQuestionsForm.questions,
      //   count: value.assignQuestionsForm.questions.length,
      //   description: value.chooseCategoryForm.description,
      //   order: Number(value.chooseCategoryForm.order),
      //   scheduledDate: value.chooseCategoryForm.scheduledDate,
      //   pdf: value.chooseCategoryForm.pdf.fileUrl,
      //   status: EntityStatusEnum.YET_TO_START,
      //   createdOn: new Date(),
      //   modifiedOn: null,
      //   createdBy: {
      //     uuid: localStorage.getItem('currentUserUuid'),
      //     name: localStorage.getItem('currentUserName'),
      //   },
      //   flags: {
      //     active: true,
      //     editable: true,
      //     suggested: true,
      //     subscribed: false,
      //   }
      // };

    }

  }
  cancel() {
    this.location.back();
  }

}
