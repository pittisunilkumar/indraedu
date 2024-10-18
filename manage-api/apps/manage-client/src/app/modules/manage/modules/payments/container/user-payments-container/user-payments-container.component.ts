import { Component, OnInit } from '@angular/core';
import { UserTransactonsInterface } from '@application/api-interfaces';
import { UserTransactionsService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-user-payments-container',
  templateUrl: './user-payments-container.component.html',
  styleUrls: ['./user-payments-container.component.less']
})
export class UserPaymentsContainerComponent implements OnInit {
  public userTransactions: UserTransactonsInterface[];
  public _sub = new Subscription();
  errors: string[];
  constructor(private userTransactionsService:UserTransactionsService) { }

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    // this._sub.add(this.userTransactionsService.getAllUserTransactions().subscribe(
    //   (res) => {
    //     this.userTransactions = res?.response;
    //     console.log(this.userTransactions);
    //   },
    //   (err) => { }
    // ));
    let dates = {
      fromDate: new Date(),
      toDate: new Date()
    }
    console.log('dates',dates);

    this.userTransactionsService.searchTransactions(dates).subscribe(data => {
      console.log(data);
      this.userTransactions = data.response
    })
  }
}
