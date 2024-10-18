import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-courses-list-container',
  templateUrl: './courses-list-container.component.html',
  styleUrls: ['./courses-list-container.component.less']
})
export class CoursesListContainerComponent implements OnInit {

  courses: any;
  _sub = new Subscription();
  errors: string[];
  subscriptionName:string;
  subscriptionUuid:string;
  constructor(
    private subRepo: SubscriptionsRepositoryService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.subscriptionName = window.sessionStorage.getItem('subscriptionName');
    this.subscriptionUuid = window.sessionStorage.getItem('subscriptionUuid');
    // this._sub.add(this.loadData());

  }

  // loadData() {

  //   return this.subRepo.getSubscriptionByUuid(this.subscriptionUuid).subscribe(
  //     (res) => {
  //       this.courses = res.response;
  //     }
  //   );

  // }



  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  backToSubscriotions(){
    this.router.navigate(['/manage/subscriptions/list']);
  }

}
