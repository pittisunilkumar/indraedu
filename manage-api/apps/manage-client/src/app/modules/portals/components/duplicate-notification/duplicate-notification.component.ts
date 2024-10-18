import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseRepositoryService, NotificationService, NotificationType, UsersRepositoryService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-duplicate-notification',
  templateUrl: './duplicate-notification.component.html',
  styleUrls: ['./duplicate-notification.component.less']
})
export class DuplicateNotificationComponent implements OnInit {
  notificationData:any;
  coursesList:any;

  form = new FormGroup({
    course:new FormControl('', Validators.required)
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any },
    private courseRepo: CourseRepositoryService,
    private userRepo: UsersRepositoryService,
    private notification: NotificationService,

  ) { }

  ngOnInit(): void {
    this.notificationData = this.data.payload;
    this.getCourses()
  }

  getCourses() {
    this.courseRepo.getAllActiveCourses().subscribe(
      (res) => {
        this.coursesList = res?.response;
      }
    );
  }

  submit(){
    let payload = {
      uuid: uuid.v4(),
      title: this.notificationData.title,
      icon: this.notificationData.icon,
      message: this.notificationData.message,
      // notificationType:this.notification_type=='branch'?"courses": value.notificationType,
      notificationType: this.notificationData.notificationType,
      subscriptions:  [],
      courses:[this.form.value.course._id],
      selectedUsers:  [],
      userFile:  [],
      createdOn: new Date(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
      branchUrl: this.notificationData.branchUrl ? this.notificationData.branchUrl : ''
    }
    console.log('payload', payload);
    this.userRepo.sendNotification(payload).subscribe(data => {
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
    // this.router.navigate(['portal/notifications/list'])
  }

}
