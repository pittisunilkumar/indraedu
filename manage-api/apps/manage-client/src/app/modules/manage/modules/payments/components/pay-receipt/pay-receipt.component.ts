import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserTransactionsService } from '@application/ui';
import { Location } from '@angular/common';
@Component({
  selector: 'application-pay-receipt',
  templateUrl: './pay-receipt.component.html',
  styleUrls: ['./pay-receipt.component.less']
})
export class PayReceiptComponent implements OnInit {
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
  }
  backToPaymentsList() {
    this._location.back();
  }

  printComponent(cmpName) {
    let printContents = document.getElementById(cmpName).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

}
