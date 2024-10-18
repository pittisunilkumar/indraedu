import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AWSS3Service, DepartmentsService, HelperService, NotificationService, NotificationType } from '@application/ui';

@Component({
  selector: 'application-send-reply',
  templateUrl: './send-reply.component.html',
  styleUrls: ['./send-reply.component.less']
})
export class SendReplyComponent implements OnInit {
  fileName: any;
  reply_image = [];
  @ViewChild('input') message: ElementRef;
  ticketData: any;

  constructor(
    public helperService: HelperService,
    private router: Router,
    private awsS3: AWSS3Service,
    private departmentsService: DepartmentsService,
    private notification: NotificationService,
    @Inject(MAT_DIALOG_DATA) private data: { payload: any },

  ) { }

  ngOnInit(): void {
    this.ticketData = this.data.payload;
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
    this.fileName = event;
    await this.awsS3.uploadFile(event, 'uploads').then((result) => {
      if (option) {
        option.fileUrl = result[0]?.Location;
      } else {
        // this.reply_image = result[0]?.Location
        this.reply_image = result.map((res) => res.Location);
        console.log('student_image_path', this.reply_image);
      }
    });
    return false;
  }

  SendReplay() {
    let payload = {
      uuid: this.ticketData.uuid,
      reply:{
        reply_message: this.message.nativeElement.value
        ? this.message.nativeElement.value
        : '',
        reply_image: this.reply_image.length ? this.reply_image : [],
        createdOn:new Date()
      },
      modifiedOn: new Date(),
      modifiedBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    };
    this.departmentsService.sendRepay(payload).subscribe(res => {
      if (res) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'Reply sent successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      }
    })
  }

}
