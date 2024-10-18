import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserTransactonsInterface } from '@application/api-interfaces';
import { HelperService, NotificationService, NotificationType, UserTransactionsService } from '@application/ui';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';

import 'jspdf-autotable';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'application-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserPaymentsComponent implements OnInit {
  @Input() userTransactions: UserTransactonsInterface;
  // displayingColumns: string[] = [
  //   // 'sno',
  //   'transactionId',
  //   // 'name',
  //   // 'mobile',
  //   'actualPrice',
  //   // 'coupon',
  //   'discountPrice',
  //   'finalPaidAmount',
  //   'paymentType',
  //   'modeOfPayment',
  //   'dateOfPayment',
  //   'paymentStatus',
  //   // 'actions'
  // ];

  paymentStatusArray = ['ALL', 'SUCCESS', 'PENDING', 'FAILED'];
  modeOfPaymentArray = ['ALL', 'RAZORPAY', 'CASH', 'POSMACHINE', 'UPI', 'OFFLINE', 'CHEQUE'];
  PaymentStatus: string;
  ModeOfPayment: string;


  displayedColumns: string[] = [
    'sno',
    'transactionId',
    // 'name',
    'mobile',
    'actualPrice',
    'coupon',
    'discountPrice',
    'finalPaidAmount',
    'paymentType',
    'modeOfPayment',
    'dateOfPayment',
    'paymentStatus',
    'actions'
  ];
  dataSource: MatTableDataSource<UserTransactonsInterface>;
  @Output() delete = new EventEmitter<UserTransactonsInterface>();
  @Output() resetPassword = new EventEmitter<UserTransactonsInterface>();
  expandedElement: UserTransactonsInterface | null;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filteredList: any;
  list: any;
  totalAmount = 0
  length: number;
  form = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl('')
  })

  constructor(
    public helper: HelperService,
    private router: Router,
    private userTransactionsService: UserTransactionsService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
    this.userTransactionsService.getAllUserTransactions().subscribe(
      (res) => {
        this.filteredList = this.list = res?.response;
        console.log(this.list);
      },
      (err) => { }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.userTransactions?.currentValue) {
      this.filteredList = this.list = changes?.userTransactions?.currentValue
      // this.filteredList = changes?.userTransactions?.currentValue
      this.dataSource = new MatTableDataSource(changes?.userTransactions?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalAmount = 0
      this.filteredList.forEach(res => {
        if (res.paymentStatus === 'SUCCESS') {
          this.totalAmount += res.finalPaidAmount;
        }
      })
      console.log('this.totalAmount', this.totalAmount.toFixed(2));
    }
  }

  exportTable() {
    if (this.dataSource.filteredData.length === 0) {
      alert("No data available for ExportData");
    }
    else {
      const dataToExport = this.dataSource.filteredData
        .map(x => ({
          transactionId: x?.transactionId,
          Name: x?.userId?.name ? x?.userId?.name : '---',
          Mobile: x?.userId?.mobile ? x?.userId?.mobile : '---',
          actualPrice: x?.actualPrice,
          Coupon: x?.couponId?.code ? x?.couponId?.code : '---',
          discountPrice: x?.discountPrice,
          finalPaidAmount: x?.finalPaidAmount,
          paymentType: x?.paymentType,
          modeOfPayment: x?.modeOfPayment,
          paymentStatus: x?.paymentStatus,
          expiryDate: x?.expiryDate,
          dateOfPayment: x?.dateOfPayment,
          mode_transactionNumber: x?.mode_transactionNumber,
          referenceNumber: x?.referenceNumber,
          paymentMessage: x?.paymentMessage,
          subscriptionId: x?.subscriptionId?.title,
          billNumber: x?.billNumber,
          chequeNumber: x?.chequeNumber,
          chequeDate: x?.chequeDate,
          bankName: x?.bankName,
          creditORdebitCard: x?.creditORdebitCard,
          cardType: x?.cardType,
          upiId: x?.upiId,
          razorPayPaymentId: x?.razorPayPaymentId,
          razoraySignature: x?.razoraySignature,
          razorpayOrderId: x?.razorpayOrderId,
          createdBy: x?.createdBy.name
        }));

      let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
      let workBook: XLSX.WorkBook = XLSX.utils.book_new();

      // Adjust column width
      var wscols = [
        { wch: 15 }
      ];

      workSheet["!cols"] = wscols;
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
      XLSX.writeFile(workBook, `UserPayments.xlsx`);
    }
  }

  // downloadPDF() {
  //   if (this.dataSource.filteredData.length === 0) {
  //     alert("No data available for ExportData");
  //   }
  //   else {
  //     var prepare = [];
  //     this.filteredList.forEach((e) => {
  //       var tempObj = [];
  //       tempObj.push(e?.transactionId);
  //       tempObj.push(e?.userId?.name);
  //       tempObj.push(e?.userId?.mobile);
  //       tempObj.push(e?.subscriptionId?.title);
  //       tempObj.push(e?.actualPrice);
  //       tempObj.push(e?.discountPrice);
  //       tempObj.push(e?.finalPaidAmount);
  //       tempObj.push(e?.couponId?.code);
  //       tempObj.push(e?.paymentType);
  //       tempObj.push(e?.modeOfPayment);
  //       tempObj.push(e?.paymentStatus);
  //       tempObj.push(e?.dateOfPayment);
  //       tempObj.push(e?.createdBy.name);
  //       // tempObj.push(e?.billNumber);
  //       // tempObj.push(e?.chequeNumber);
  //       // tempObj.push(e?.chequeDate);
  //       // tempObj.push(e?.bankName);
  //       // tempObj.push(e?.referenceNumber);
  //       // tempObj.push(e?.creditORdebitCard);
  //       // tempObj.push(e?.cardType);
  //       // tempObj.push(e?.upiId);
  //       // tempObj.push(e?.mode_transactionNumber);
  //       // tempObj.push(e?.razorPayPaymentId);
  //       // tempObj.push(e?.razoraySignature);
  //       // tempObj.push(e?.razorpayOrderId);
  //       // tempObj.push(e?.expiryDate);


  //       prepare.push(tempObj);
  //     });
  //     const doc = new jsPDF();
  //     (doc as any).autoTable({
  //       head: [
  //         [
  //           'TransactionId',
  //           'UserName',
  //           'Mobile',
  //           'Subscription',
  //           'ActuaPrice',
  //           'DiscountPrice',
  //           'PaidAmount',
  //           'coupon',
  //           'PaymentType',
  //           'ModeOfPayment',
  //           'PaymentStatus',
  //           'DateOfPayment',
  //           'CreatedBy',
  //           // 'BillNumber',
  //           // 'ChequeNumber',
  //           // 'ChequeDate',
  //           // 'ReferenceNumber',
  //           // 'CreditORdebitCard',
  //           // 'CardType',
  //           // 'UpiId',
  //           // 'Mode_transactionNumber',
  //           // 'RazorPayPaymentId',
  //           // 'RazoraySignature',
  //           // 'RazorpayOrderId',
  //           // 'ExpiryDate',
  //         ],
  //       ],
  //       body: prepare,
  //     });
  //     doc.save('UserPayments.pdf');
  //   }
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.list.filter((trans) => {
        return (
          trans.transactionId.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.userId?.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.userId?.mobile.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.couponId?.code.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.paymentType.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.paymentStatus.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.subscriptionId?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.modeOfPayment.toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);

    } else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;
    this.totalAmount = 0
    this.filteredList.forEach(res => {
      if (res.paymentStatus === 'SUCCESS') {
        this.totalAmount += res.finalPaidAmount;
      }
    })
    console.log('this.totalAmountFilter', this.totalAmount.toFixed(2));
  }

  searchPayments() {
    let dates = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate.setDate(this.form.value.toDate.getDate() + 1)
    }
    console.log('dates', dates);

    this.userTransactionsService.searchTransactions(dates).subscribe(data => {
      console.log(data);
      this.filteredList = this.list = data.response

      this.dataSource = new MatTableDataSource(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.filteredData.length
      this.totalAmount = 0
      this.list.forEach(res => {
        if (res.paymentStatus === 'SUCCESS') {
          this.totalAmount += res.finalPaidAmount;
        }
      })
      console.log('this.totalAmountSearch', this.totalAmount.toFixed(2));
      if (this.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'User payments fetched successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
      else {
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: '',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
    })

  }

  selectModeOfPayment(event) {
    this.ModeOfPayment = event
    if (event == 'ALL') {
      if (this.PaymentStatus && this.PaymentStatus != 'ALL') {
        let dataSource;
        dataSource = this.list.filter((payment) => {
          return payment.paymentStatus.toLowerCase().includes(this.PaymentStatus.toLowerCase());
        });
        this.dataSource = new MatTableDataSource(dataSource);
      } else {
        this.dataSource = new MatTableDataSource(this.filteredList);
      }
    }
    else {
      let dataSource;
      if (event) {
        if (this.PaymentStatus && this.PaymentStatus != 'ALL') {
          dataSource = this.list.filter((payment) => {
            return (payment.modeOfPayment.toLowerCase().includes(event.toLowerCase()) &&
              payment.paymentStatus.toLowerCase().includes(this.PaymentStatus.toLowerCase()));
          });
        }
        else if (!this.PaymentStatus || this.PaymentStatus == 'ALL') {
          dataSource = this.list.filter((payment) => {
            return payment.modeOfPayment.toLowerCase().includes(event.toLowerCase())
          });
        }
        this.totalAmount = 0
        dataSource.forEach(res => {
          if (res.paymentStatus === 'SUCCESS') {
            this.totalAmount += res.finalPaidAmount;
          }
        })
        console.log('ModeOfPayment', this.totalAmount.toFixed(2));
      }
      this.dataSource = new MatTableDataSource(dataSource);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selectPaymentStatus(event) {
    this.PaymentStatus = event
    if (event == 'ALL') {
      if (this.ModeOfPayment && this.ModeOfPayment != 'ALL') {
        let dataSource;
        dataSource = this.list.filter((payment) => {
          return payment.modeOfPayment.toLowerCase().includes(this.ModeOfPayment.toLowerCase());
        });
        this.dataSource = new MatTableDataSource(dataSource);
      } else {
        this.dataSource = new MatTableDataSource(this.filteredList);
      }
    }
    else {
      let dataSource;
      if (event) {
        if (this.ModeOfPayment && this.ModeOfPayment != 'ALL') {
          dataSource = this.list.filter((payment) => {
            return (payment.paymentStatus.toLowerCase().includes(event.toLowerCase()) &&
              payment.modeOfPayment.toLowerCase().includes(this.ModeOfPayment.toLowerCase())
            )
          });
        }
        else if (!this.ModeOfPayment || this.ModeOfPayment == 'ALL') {
          dataSource = this.list.filter((payment) => {
            return payment.paymentStatus.toLowerCase().includes(event.toLowerCase())
          });
        }
      }
      this.dataSource = new MatTableDataSource(dataSource);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // viewTransaction(payment){
  //  this.router.navigate([`manage/user/payments/${payment.uuid}/transaction`])
  // }




}
