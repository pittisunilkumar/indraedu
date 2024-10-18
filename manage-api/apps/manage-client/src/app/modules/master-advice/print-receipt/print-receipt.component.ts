import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserTransactionsService } from '@application/ui';

@Component({
  selector: 'application-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.less']
})
export class PrintReceiptComponent implements OnInit {

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
