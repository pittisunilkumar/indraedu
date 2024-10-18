import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersRepositoryService } from '@application/ui';

@Component({
  selector: 'application-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.less']
})
export class ViewNotificationComponent implements OnInit {

  notificationData: any;
  constructor(
    private userRepo: UsersRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let notificationId = this.route.snapshot.paramMap.get('id');
    this.userRepo.getNotificationById(notificationId).subscribe((res) => {
      this.notificationData = res.response;
      console.log('notificationData', this.notificationData);
    });
  }

  back(){
    this.router.navigate(['/portal/notifications/list'])
  }

}
