import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AWSS3Service,
  DepartmentsService,
  HelperService,
} from '@application/ui';
import { SendReplyComponent } from '../send-reply/send-reply.component';

@Component({
  selector: 'application-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.less'],
})
export class ViewTicketComponent implements OnInit {
  ticketData: any;
  fileName: any;
  ticketUUid:string;
  reply_image = [];
  @ViewChild('input') message: ElementRef;

  constructor(
    public helperService: HelperService,
    private router: Router,
    private awsS3: AWSS3Service,
    private departmentsService: DepartmentsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // this.ticketData = JSON.parse(localStorage.getItem('ticket'));
    // console.log('this.ticketData', this.ticketData);
    this.getTickeData();
  }
  getTickeData(){
    this.ticketUUid = localStorage.getItem('ticketUUid');
    this.departmentsService.getTicketByUUid(this.ticketUUid).subscribe(res=>{
      this.ticketData = res.response;
    console.log('this.ticketData', this.ticketData);
    })
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
    console.log('event', event);

    await this.awsS3.uploadFile(event, 'uploads').then((result) => {
      console.log('result', result);

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

  updateCloseStatus() {
    let payload = {
      uuid: this.ticketData.uuid,
      status: 4,
      reply_message: this.message.nativeElement.value
        ? this.message.nativeElement.value
        : '',
      reply_image: this.reply_image.length ? this.reply_image : [],
      modifiedOn: new Date(),
      modifiedBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    };
    console.log('payload', payload);

    this.departmentsService.updateTicket(payload).subscribe(res => {
      if (res) {
        // this.getTickets();
        this.router.navigate(['manage/complaints/list']);
      }
    })
  }

  backToTickets() {
    this.router.navigate(['manage/complaints/list']);
  }
  sendReplay(){
    const dialogRef = this.dialog.open(SendReplyComponent, {
      data: { payload: this.ticketData },
      height: '96%',
      width: '80%'
    });
  }
}
