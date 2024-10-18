import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.less']
})
export class UserSubscriptionsComponent implements OnInit {

  @Input() subscriptions: SubscriptionInterface[];
  filteredList: SubscriptionInterface[];
  todayDate = new Date()


  constructor(
    public helper: HelperService,
    private router: Router,
  ) { }
  // this.todayDate.setDate(this.todayDate.getDate() - 1)
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.subscriptions;
    console.log(' this.filteredList', this.filteredList);
    
  }


  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

  }

}
