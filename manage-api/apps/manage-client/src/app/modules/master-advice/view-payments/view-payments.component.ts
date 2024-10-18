import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserTransactionsService } from '@application/ui';

@Component({
  selector: 'application-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.less']
})
export class ViewPaymentsComponent implements OnInit {

  paymentUuid: string;
  transactions?: any;

  constructor(
    private route: ActivatedRoute,
    private userTransactionsService: UserTransactionsService,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    this.paymentUuid = this.route.snapshot.paramMap.get('uuid');
    this.userTransactionsService.getTransactionByUuid(this.paymentUuid).subscribe(res => {
      this.transactions = res.response;
    })
    let currentYear = new Date().getFullYear();
    let year = currentYear.toString().split('');
    currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

  }
  backToPaymentsList() {
    this._location.back();
  }

  // checkPaymentStatus(orderId) {
  //   this.userTransactionsService.checkPaymentStatus({ razorpayOrderId: orderId }).subscribe(data => {
  //     if (data) {
  //       this._location.back();
  //     }
  //   })
  // }

}
