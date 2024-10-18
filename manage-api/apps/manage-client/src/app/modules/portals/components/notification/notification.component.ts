import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionInterface } from '@application/api-interfaces';
import { AWSS3Service, CourseRepositoryService, FacultyRepositoryService, HelperService, NotificationService, NotificationType, QBankRepositoryService, QuestionsRepositoryService, SubscriptionsRepositoryService, TestCategoriesRepositoryService, UsersRepositoryService, VideosRepositoryService } from '@application/ui';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as uuid from 'uuid';


@Component({
  selector: 'application-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {
  userList = [];
  allUsers: any;
  users: any;
  subscriptionList: SubscriptionInterface[];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  notificationForm: FormGroup;
  coursesList: any;
  iconFile: any;
  fileName: any;
  file: File | any = null;
  userFile: any;
  userMobileFile = [];
  question: any;
  showQuestion = false;

  branchIOUrl: any
  branchType: string;

  videoSubjects: any;
  videoChaptes: any;
  videosList: any;

  testCategory: any;
  testList: any;
  categoryList: any;

  QBankSubject: any;
  QBnankChapters: any;
  QbankTopics: any;
  QbankSubjectList: any;

  sheduleNotificationData: any;

  subscriptionsData: SubscriptionInterface[];

  EBookForm = new FormGroup({
    ebookTitle: new FormControl('', Validators.required),
    ebookUrl: new FormControl('', Validators.required)
  })

  brachKey = 'key_live_jj8zAGPOliW8euvIDwQWUemjssfsR1yK'
  notification_type: string;
  course: any;



  constructor(
    public helper: HelperService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userRepo: UsersRepositoryService,
    private subRepo: SubscriptionsRepositoryService,
    private facultyRepo: FacultyRepositoryService,
    private courseRepo: CourseRepositoryService,
    private awsS3: AWSS3Service,
    private notification: NotificationService,
    private questionsRepo: QuestionsRepositoryService,
    private videosRepo: VideosRepositoryService,
    private testCategoriesRepo: TestCategoriesRepositoryService,
    private qbankRepo: QBankRepositoryService,

  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.getCourses();
    this.getSubscriptions();
  }

  selectNotificationType(type) {
    this.notification_type = type
  }
  buildForm() {
    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      notificationType: ['', Validators.required],
      subscription: [''],
      users: [''],
      courses: [''],
      fileUrl: '',
      uploadFile: '',
      upload: true,
    });
  }

  async upload(
    event,
    option?: {
      name: string;
      value: number;
      fileUrl: string;
      upload: boolean;
    }
  ) {
    await this.awsS3.uploadFile(event, 'uploads').then((result) => {
      if (option) {
        option.fileUrl = result[0]?.Location;
      } else {
        this.iconFile = result[0]?.Location
      }
    });
  }
  // getImageUrl(data: { fileUrl: string; upload: boolean }) {
  //   this.notificationForm.controls['icon'].patchValue({
  //     imgUrl: data.fileUrl,
  //     upload: true,
  //   });
  // }


  getSubscriptions() {
    this.subRepo.getCouponSubscriptions().subscribe(
      (res) => {
        this.subscriptionList = res?.response;
      }
    );
  }
  getCourses() {
    this.courseRepo.getAllActiveCourses().subscribe(
      (res) => {
        this.coursesList = res?.response;
      }
    );
  }

  getUsers() {
    let data = {
      page: 1,
      limit: 10,
      search: ''
    }
    console.log('data', data);

    this.userRepo.getStudentsPerPage(data).subscribe(
      (res) => {
        this.users = res?.response?.data;
        this.allUsers = res?.response?.data;
      },
      (err) => { }
    );
  }

  remove(user: string): void {
    const index = this.userList.indexOf(user);
    if (index >= 0) {
      this.userList.splice(index, 1);
    }
  }

  selected(user): void {
    this.userList.push(user.option.value);
  }
  applyFilter(event: any) {
    const filterValue = event;
    let data = {
      page: 1,
      limit: 100,
      search: filterValue
    }
    this.userRepo.getStudentsPerPage(data).subscribe(
      (res: any) => {
        this.users = this.allUsers = res?.response?.data
      },
      (err) => { }
    );
  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.userFile = JSON.parse(fileReader.result);
      this.userFile.map(res => {
        let cData = {
          mobile: res.mobile
        }
        array.push(cData)
      })
      this.userMobileFile = array
      console.log(array);
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
  }

  getSubjectsBasedOnCourse(cou) {
    this.course = cou
    this.courseRepo.getCouseSubjects({ courseId: cou._id }).subscribe(res => {
      this.QBankSubject = res.response.qbankSubjects;
      this.videoSubjects = res.response.videoSubjects;
      this.testCategory = res.response.testCategories;
    })
  }

  setectBarchIOType(type) {
    console.log(type);
    this.branchType = type;
    // if (this.branchType == 'video') {
    //   this.videosRepo.getAllVideoSubjects().subscribe(
    //     (res) => {
    //       this.videoSubjects = res.response;
    //     }
    //   );
    // }
    // else if (this.branchType == 'qbank') {
    //   this.qbankRepo.getAllQBankSubjects().subscribe(
    //     (res) => {
    //       this.QBankSubject = res.response;
    //     }
    //   );
    // }
    // else if (this.branchType == 'testSeries') {
    //   this.testCategoriesRepo.getAllTSCategories().subscribe(
    //     (res) => {
    //       this.testCategory = res?.response;
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   )
    // }
    if (this.branchType == 'subscriptions') {
      this.subRepo.getCouponSubscriptions().subscribe(
        (res) => {
          this.subscriptionsData = res?.response;
        }
      );
    }
    else if (this.branchType == 'questions') {
      this.qbankRepo.getAllQBankSubjects().subscribe(
        (res) => {
          this.QBankSubject = res.response;
        }
      );
    }
  }

  getVideoChapters(sub) {
    this.videosRepo.getVideoSubjectsByUuid(sub.uuid).subscribe(res => {
      this.videoChaptes = res.response;
    })
  }
  getVideos(chapter) {
    this.videosList = chapter.videos
  }

  async getVideoInfo(video) {
    console.log(video);
    let branchVideoPayload = {
      "branch_key": this.brachKey,
      "channel": "plato",
      "feature": "Videos",
      "campaign": "Videos",
      "stage": "Videos",
      "tags": ["video"],
      "data": {
        "$canonical_identifier": "video",
        "$og_title": video.title ? video.title : "Video Title",
        "$og_description": video.title ? video.title : "Video Title",
        "videoInfo": video,
        "isPaid": video.flags.paid
      }
    }
    console.log('branchPayload', branchVideoPayload);
    await this.questionsRepo.brachIOQuestion(branchVideoPayload).subscribe(
      async (res: any) => {

        this.branchIOUrl = res.response
      }
    )



  }

  getQBankChapters(sub) {
    this.qbankRepo.getQBankSubjectsByUuid(sub.uuid).subscribe(res => {
      this.QBnankChapters = res.response;
    })
  }
  getQBankTopics(chapter) {
    this.QbankTopics = chapter.topics
  }

  async getQbankTopicInfo(topic) {
    let branchTopicPayload = {
      "branch_key": this.brachKey,
      "channel": "plato",
      "feature": "Qbank",
      "campaign": "Qbank",
      "stage": "Qbank",
      "tags": ["Qbank"],
      "data": {
        "$canonical_identifier": "solveQb",
        "$og_title": topic.title ? topic.title : "qbank Title",
        "$og_description": topic.title ? topic.title : "qbank Title",
        "isPaid": topic.flags.paid,
        "subjectUUID": this.QBnankChapters.uuid,
        "topicUUID": topic.uuid,
        "topicTitle": topic.title,
        "qBankSubjectId": this.QBnankChapters.syllabus._id,
        "topicTotalMcq": Number(topic.que.length)
      }
    }
    await this.questionsRepo.brachIOQuestion(branchTopicPayload).subscribe(
      async (res: any) => {
        this.branchIOUrl = res.response;
        console.log('this.branchIOUrl', this.branchIOUrl);
      }
    )


  }

  getTestList(cat) {
    this.testCategoriesRepo.getTestsByUuid(cat.uuid).subscribe(
      (res) => {
        this.categoryList = res.response
        // this.testList = res.response[0].categories
        this.testList = res.response[0].categories.tests;
      }
    )
  }

  async getTestInfo(test) {
    let branchTestPayload = {
      "branch_key": this.brachKey,
      "channel": "plato",
      "feature": "TestSeries",
      "campaign": "TestSeries",
      "stage": "TestSeries",
      "tags": ["TestSeries"],
      "data": {
        "$canonical_identifier": "solveTest",
        "$og_title": test.title ? test.title : "Test Title",
        "$og_description": test.title ? test.title : "Test Title",
        "isPaid": test.flags.paid,
        "uuid": this.categoryList[0].uuid,
        "categoryTitle": this.categoryList[0].categories.title,
        "testUUID": test.uuid,
        "testTitle": test.title,
        "testTime": Number(test.time),
        "testSubjectId": test.subjects[0]._id,
        "topicTotalMcq": Number(test.que.length)
      }
    }
    console.log('branchPayload', branchTestPayload);
    await this.questionsRepo.brachIOQuestion(branchTestPayload).subscribe(
      async (res: any) => {
        this.branchIOUrl = res.response;
        console.log('this.branchIOUrl', this.branchIOUrl);
      }
    )

  }

  async getSubcriptionInfo(sub) {
    let branchSubPayload = {
      "branch_key": this.brachKey,
      "channel": "plato",
      "feature": "subscription",
      "campaign": "subscription",
      "stage": "subscription",
      "tags": ["subscription"],
      "data": {
        "$canonical_identifier": "purchase",
        "$og_title": sub.title ? sub.title : "subscription Title",
        "$og_description": sub.title ? sub.title : "subscription Title",
        "subscriptionsId": sub._id,
      }
    }
    console.log('branchPayload', branchSubPayload);
    await this.questionsRepo.brachIOQuestion(branchSubPayload).subscribe(
      async (res: any) => {

        this.branchIOUrl = res.response
      }
    )

  }



  filterQuestions(event: any) {
    let filterValue = event;
    let data = {
      search: filterValue.trim()
    }
    if (filterValue) {
      this.questionsRepo.searchQuestion(data).subscribe(
        async (res: any) => {
          this.question = res?.response;
          this.showQuestion = true;
          let branchPayload = {
            "branch_key": this.brachKey,
            "channel": "plato",
            "feature": "question",
            "campaign": "Notification OF the Day",
            "stage": "Notification of the day",
            "tags": ["questions"],
            "data": {
              "$canonical_identifier": "question",
              "$og_title": this.question[0].shortTitle ? this.question[0].shortTitle : "question Title",
              "$og_description": this.question[0].shortTitle ? this.question[0].shortTitle : "question Test",
              "questionId": this.question[0]._id
            }
          }
          await this.questionsRepo.brachIOQuestion(branchPayload).subscribe(
            async (res: any) => {

              this.branchIOUrl = res.response;
              console.log('this.branchIOUrl', this.branchIOUrl);

            }
          )


        },
        (err) => { }
      );
    }
  }

  async ebookInfo() {
    console.log("ebook", this.EBookForm.value);
    let branchEbookPayload = {
      "branch_key": this.brachKey,
      "channel": "plato",
      "feature": "ebook",
      "campaign": "ebook",
      "stage": "ebook",
      "tags": ["ebook"],
      "data": {
        "$canonical_identifier": "ebook",
        "$og_title": this.EBookForm.value.ebookTitle ? this.EBookForm.value.ebookTitle : "ebook Title",
        "$og_description": this.EBookForm.value.ebookTitle ? this.EBookForm.value.ebookTitle : "ebook Title",
        "ebookUrl": this.EBookForm.value.ebookUrl,
        "ebookTitle": this.EBookForm.value.ebookTitle
      }
    }
    console.log('branchPayload', branchEbookPayload);
    await this.questionsRepo.brachIOQuestion(branchEbookPayload).subscribe(
      async (res: any) => {

        this.branchIOUrl = res.response
      }
    )


  }



  async submit() {
    let value = this.notificationForm.value;
    let payload = {
      uuid: uuid.v4(),
      title: value.title,
      icon: this.iconFile ? this.iconFile : value.fileUrl,
      message: value.message,
      // notificationType:this.notification_type=='branch'?"courses": value.notificationType,
      notificationType: value.notificationType ? value.notificationType : "courses",
      subscriptions: value.subscription ? value.subscription.map(res => res._id) : [],
      courses: value.notificationType == 'selectedUsers' ? [] : this.notification_type == 'branch' ? [this.course._id] : value.courses ? value.courses.map(res => res._id) : [],
      selectedUsers: this.userList ? this.userList.map(res => res._id) : [],
      userFile: this.userMobileFile ? this.userMobileFile.map(res => res.mobile) : [],
      createdOn: new Date(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
      branchUrl: this.branchIOUrl ? this.branchIOUrl : ''
    }
    console.log('payload', payload);
    this.userRepo.sendNotification(payload).subscribe(data => {
      if (data.response) {
        this.notificationForm.reset();
        this.notificationForm.controls['upload'].patchValue(true);
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'Notification sended successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
    })
    this.router.navigate(['portal/notifications/list'])

  }

  notificationFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }

  FileSheduleNotificationsSubmited() {
    let array = [];
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = async () => {
      this.sheduleNotificationData = JSON.parse(fileReader.result);
      this.sheduleNotificationData.map(res => {
        let fromDate = new Date(res.scheduleDate).getTime() + (5.5 * 60 * 60 * 1000);
        let newFromDate = new Date(fromDate).setUTCHours(parseInt(res?.scheduleTime), 0, 0, 0);
        let scheduleDate = new Date(newFromDate).getTime() - (5.5 * 60 * 60 * 1000);

        let cData = {
          uuid: uuid.v4(),
          title: res?.title ? res?.title : '',
          message: res?.message ? res?.message : '',
          icon: res?.image ? res?.image : '',
          scheduleDate: new Date(scheduleDate),
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        array.push(cData)
      })

      let payload = {
        courses: this.course._id,
        notificationData: array
      }
      console.log('payload', payload);
      this.userRepo.sendScheduleNotification(payload).subscribe(data => {
        if (data.response) {
          this.notification.showNotification({
            type: NotificationType.SUCCESS,
            payload: {
              message: 'Notification sended successfully',
              statusCode: 200,
              statusText: 'Successfully',
              status: 201
            },
          });
        }
      })

    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
    this.router.navigate(['portal/notifications/list'])

  }

}
