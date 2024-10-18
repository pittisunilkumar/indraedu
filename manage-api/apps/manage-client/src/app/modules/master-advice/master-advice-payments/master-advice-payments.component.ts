import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { UserTransactonsInterface } from '@application/api-interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import {
  HelperService,
  NotificationService,
  NotificationType,
  UserTransactionsService,
} from '@application/ui';
import { Router } from '@angular/router';
@Component({
  selector: 'application-master-advice-payments',
  templateUrl: './master-advice-payments.component.html',
  styleUrls: ['./master-advice-payments.component.less'],
})
export class MasterAdvicePaymentsComponent implements OnInit {
  @Input() userTransactions: UserTransactonsInterface;

  paymentStatusArray = ['ALL', 'SUCCESS', 'PENDING', 'FAILED'];
  modeOfPaymentArray = [
    'ALL',
    'RAZORPAY',
    'CASH',
    'POSMACHINE',
    'UPI',
    'OFFLINE',
    'CHEQUE',
  ];
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
    'actions',
  ];
  dataSource: MatTableDataSource<UserTransactonsInterface>;
  @Output() delete = new EventEmitter<UserTransactonsInterface>();
  @Output() resetPassword = new EventEmitter<UserTransactonsInterface>();
  expandedElement: UserTransactonsInterface | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('fromDate') fromDate:ElementRef;
  @ViewChild('toDate') toDate:ElementRef;

  filteredList: any;
  list: any;
  totalAmount = 0;
  length: number;
  form = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });

  constructor(
    public helper: HelperService,
    private router: Router,
    private userTransactionsService: UserTransactionsService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    // let dates = {
    //   fromDate: new Date(),
    //   toDate: new Date(),
    // };
    this.userTransactionsService.getMasterAdviceTransactions().subscribe((data) => {
      console.log('data,',data);
      this.filteredList = this.list = data.response;
      this.dataSource = new MatTableDataSource(this.filteredList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalAmount = 0;
      this.filteredList.forEach((res) => {
        if (res.paymentStatus === 'SUCCESS') {
          this.totalAmount += res.finalPaidAmount;
        }
      });
      console.log('this.totalAmount', this.totalAmount.toFixed(2));
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // Assign the data to the data source for the table to render
  //   if (changes?.userTransactions?.currentValue) {
  //     this.filteredList = this.list = changes?.userTransactions?.currentValue
  //     // this.filteredList = changes?.userTransactions?.currentValue
  //     this.dataSource = new MatTableDataSource(changes?.userTransactions?.currentValue);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.totalAmount = 0
  //     this.filteredList.forEach(res => {
  //       if (res.paymentStatus === 'SUCCESS') {
  //         this.totalAmount += res.finalPaidAmount;
  //       }
  //     })
  //     console.log('this.totalAmount', this.totalAmount.toFixed(2));
  //   }
  // }

  exportTable() {
    if (this.dataSource.filteredData.length === 0) {
      alert('No data available for ExportData');
    } else {
      const dataToExport = this.dataSource.filteredData.map((x) => ({
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
        createdBy: x?.createdBy.name,
      }));

      let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <
        XLSX.Table2SheetOpts
      >{ sheet: 'Sheet 1' });
      let workBook: XLSX.WorkBook = XLSX.utils.book_new();

      // Adjust column width
      var wscols = [{ wch: 15 }];

      workSheet['!cols'] = wscols;
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
      XLSX.writeFile(workBook, `MasterAdvicePayments.xlsx`);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.list.filter((trans) => {
        return (
          trans.transactionId
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.userId?.name
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.userId?.mobile
            .toString()
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.couponId?.code
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.paymentType
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.paymentStatus
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.subscriptionId?.title
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase()) ||
          trans.modeOfPayment
            .toLowerCase()
            .includes(filterValue.toLocaleLowerCase())
        );
      });
      this.dataSource = new MatTableDataSource(this.filteredList);
    } else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;
    this.totalAmount = 0;
    this.filteredList.forEach((res) => {
      if (res.paymentStatus === 'SUCCESS') {
        this.totalAmount += res.finalPaidAmount;
      }
    });
    console.log('this.totalAmountFilter', this.totalAmount.toFixed(2));
  }

  searchPayments() {
   let toDate= new Date(this.toDate.nativeElement.value).setDate(
        new Date(this.toDate.nativeElement.value).getDate() + 1
      )
    let dates = {
      fromDate: new Date(this.fromDate.nativeElement.value),
      toDate:new Date(toDate)
    };
    console.log('dates', dates);

    this.userTransactionsService.getmasterAdviceDateFilter(dates).subscribe((data) => {
      console.log(data);
      this.filteredList = this.list = data.response;

      this.dataSource = new MatTableDataSource(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.filteredData.length;
      this.totalAmount = 0;
      this.list.forEach((res) => {
        if (res.paymentStatus === 'SUCCESS') {
          this.totalAmount += res.finalPaidAmount;
        }
      });
      console.log('this.totalAmountSearch', this.totalAmount.toFixed(2));
      if (this.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'User payments fetched successfully',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      } else {
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: '',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201,
          },
        });
      }
    });
  }

  // selectModeOfPayment(event) {
  //   this.ModeOfPayment = event;
  //   if (event == 'ALL') {
  //     if (this.PaymentStatus && this.PaymentStatus != 'ALL') {
  //       let dataSource;
  //       dataSource = this.list.filter((payment) => {
  //         return payment.paymentStatus
  //           .toLowerCase()
  //           .includes(this.PaymentStatus.toLowerCase());
  //       });
  //       this.dataSource = new MatTableDataSource(dataSource);
  //     } else {
  //       this.dataSource = new MatTableDataSource(this.filteredList);
  //     }
  //   } else {
  //     let dataSource;
  //     if (event) {
  //       if (this.PaymentStatus && this.PaymentStatus != 'ALL') {
  //         dataSource = this.list.filter((payment) => {
  //           return (
  //             payment.modeOfPayment
  //               .toLowerCase()
  //               .includes(event.toLowerCase()) &&
  //             payment.paymentStatus
  //               .toLowerCase()
  //               .includes(this.PaymentStatus.toLowerCase())
  //           );
  //         });
  //       } else if (!this.PaymentStatus || this.PaymentStatus == 'ALL') {
  //         dataSource = this.list.filter((payment) => {
  //           return payment.modeOfPayment
  //             .toLowerCase()
  //             .includes(event.toLowerCase());
  //         });
  //       }
  //       this.totalAmount = 0;
  //       dataSource.forEach((res) => {
  //         if (res.paymentStatus === 'SUCCESS') {
  //           this.totalAmount += res.finalPaidAmount;
  //         }
  //       });
  //       console.log('ModeOfPayment', this.totalAmount.toFixed(2));
  //     }
  //     this.dataSource = new MatTableDataSource(dataSource);
  //   }
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  // selectPaymentStatus(event) {
  //   this.PaymentStatus = event;
  //   if (event == 'ALL') {
  //     if (this.ModeOfPayment && this.ModeOfPayment != 'ALL') {
  //       let dataSource;
  //       dataSource = this.list.filter((payment) => {
  //         return payment.modeOfPayment
  //           .toLowerCase()
  //           .includes(this.ModeOfPayment.toLowerCase());
  //       });
  //       this.dataSource = new MatTableDataSource(dataSource);
  //     } else {
  //       this.dataSource = new MatTableDataSource(this.filteredList);
  //     }
  //   } else {
  //     let dataSource;
  //     if (event) {
  //       if (this.ModeOfPayment && this.ModeOfPayment != 'ALL') {
  //         dataSource = this.list.filter((payment) => {
  //           return (
  //             payment.paymentStatus
  //               .toLowerCase()
  //               .includes(event.toLowerCase()) &&
  //             payment.modeOfPayment
  //               .toLowerCase()
  //               .includes(this.ModeOfPayment.toLowerCase())
  //           );
  //         });
  //       } else if (!this.ModeOfPayment || this.ModeOfPayment == 'ALL') {
  //         dataSource = this.list.filter((payment) => {
  //           return payment.paymentStatus
  //             .toLowerCase()
  //             .includes(event.toLowerCase());
  //         });
  //       }
  //     }
  //     this.dataSource = new MatTableDataSource(dataSource);
  //   }
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  // viewTransaction(payment){
  //  this.router.navigate([`manage/user/payments/${payment.uuid}/transaction`])
  // }
}
