import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-subscriptions-info',
  templateUrl: './subscriptions-info.component.html',
  styleUrls: ['./subscriptions-info.component.less']
})
export class SubscriptionsInfoComponent implements OnInit {
  payload:any;
  subscriptionData:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any },
    private subRepo: SubscriptionsRepositoryService,
  ) { }

  ngOnInit(): void {
    this.payload = this.data.payload;
    this.subRepo.getSubscriptionByUuid( this.payload.uuid).subscribe(res=>{
      this.subscriptionData = res.response;
      console.log('this.subscriptionData',this.subscriptionData);
      
    })
  }

}
