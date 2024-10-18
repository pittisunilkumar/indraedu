import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseRepositoryService, FeedbackService, HelperService, UsersRepositoryService } from '@application/ui';
import * as uuid from 'uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'application-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.less'],
})
export class CreateFeedbackComponent implements OnInit {
  mode = this.route.snapshot.data['mode'];

  feedback?: any;
  // mode: string;
  createFeedbackForm: FormGroup;
  batchList: any;

  userList = [];
  studentsList = [];
  allUsers: any;
  users: any;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addUsersToEventList = [];
  coursesList: any;
  course: any;
  FeedbackTypeList = ['free_users', 'subscribed_users', 'both'];

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private router: Router,
    private userService: UsersRepositoryService,
    private courseRepo: CourseRepositoryService
  ) {}
  async ngOnInit(): Promise<void> {
    this.createFeedbackForm = this.buildForm();
    if (this.mode === 'edit') {
      let departmentsUuid = this.route.snapshot.paramMap.get('uuid');
      let feedback: any;
      feedback = await this.feedbackService
        .findFeedback(departmentsUuid)
        .toPromise();
      this.feedback = feedback.response;
      console.log(' this.feedback', this.feedback);

      // this.loadUsers(this.feedback?.course);
      this.userList = this.feedback?.users;
      // this.addUsersToEventList = this.userList.map(res => res._id)
      this.createFeedbackForm = this.buildForm();
    }
    this.getCourses();
  }
  buildForm() {
    return this.formBuilder.group({
      title: [this.feedback ? this.feedback?.title : '', Validators.required],
      course: [this.feedback ? this.feedback?.course : '', Validators.required],
      feedback_type: [
        this.feedback ? this.feedback?.feedback_type : '',
        Validators.required,
      ],
      // users: [this.feedback ? this.feedback?.users : ''],
      flags: this.formBuilder.group({
        active: this.feedback ? this.feedback?.flags.active : true,
        // options: this.feedback ? this.feedback?.flags?.options : false,
        // optionCount: [this.feedback ? this.feedback?.flags?.optionCount : 5],
      }),
    });
  }

  getCourses() {
    this.courseRepo.getAllActiveCourses().subscribe((res) => {
      this.coursesList = res?.response;
    });
  }

  // loadUsers(course) {
  //   this.course = course;
  //   // let cou = course.map(res => res._id)
  //   this.userService.getUsersByCourseId({ courseId: course.map(res => res._id) }).subscribe(res => {
  //     this.allUsers = this.users = res?.response;
  //   })

  // }
  // selectAllUsers() {
  //   this.loadUsers(this.course);
  //   this.userList = this.users;
  //   this.addUsersToEventList = this.userList.map(res => res._id)
  // }
  // remove(user: string): void {
  //   const index = this.userList.indexOf(user);
  //   if (index >= 0) {
  //     this.userList.splice(index, 1);
  //   }
  //   this.addUsersToEventList = this.userList.map(res => res._id)
  // }
  // selected(user): void {
  //   this.userList = this.userList.filter(res => {
  //     return res != user.option.value
  //   })
  //   this.userList.push(user.option.value);
  //   this.addUsersToEventList = this.userList.map(res => res._id)
  // }

  // applyFilter(event: any) {
  //   const filterValue = event;
  //   this.users = this.allUsers.filter((user) => {
  //     return (
  //       user?.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
  //       user?.mobile.toString().toLowerCase().includes(filterValue.toLocaleLowerCase())
  //     )
  //   });
  // }

  submit() {
    const value = this.createFeedbackForm.value;
    if (this.mode === 'add') {
      const payload: any = {
        uuid: uuid.v4(),
        title: value.title,
        feedback_type: value.feedback_type,
        course: value.course.map((res) => res._id),
        //  users: this.addUsersToEventList,
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload);
      this.feedbackService.createFeedback(payload).subscribe((res) => {
        if (res) {
          this.router.navigate(['/portal/feedback/list']);
        }
      });
    } else {
      const payload: any = {
        _id: this.feedback?._id,
        uuid: this.feedback?.uuid,
        title: value.title,
        feedback_type: value.feedback_type,
        course: value.course.map((res) => res._id),
        // users: this.addUsersToEventList,
        createdBy: this.feedback?.createdBy,
        createdOn: this.feedback?.createdOn,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload);
      this.feedbackService.updateFeedback(payload).subscribe((res) => {
        if (res) {
          this.router.navigate(['/portal/feedback/list']);
        }
      });
    }
  }
  resetForm() {
    this.createFeedbackForm.reset();
  }
}
