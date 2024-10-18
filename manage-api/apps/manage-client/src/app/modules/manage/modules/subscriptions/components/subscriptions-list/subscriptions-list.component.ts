import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SubscriptionInterface } from '@application/api-interfaces';
import { HelperService, NotificationService, NotificationType, SubscriptionsRepositoryService, UserTransactionsService } from '@application/ui';
import { SubscriptionsInfoComponent } from '..';
import * as XLSX from 'xlsx';


@Component({
  selector: 'application-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  styleUrls: ['./subscriptions-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsListComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'subscription',
    'course',
    'order',
    'createdOn',
    'validTo',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<SubscriptionInterface>;

  @Input() list: SubscriptionInterface[];
  @Input() actionsVisible = true;
  @Output() delete = new EventEmitter<SubscriptionInterface>();
  @Output() edit = new EventEmitter<SubscriptionInterface>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  filteredList: SubscriptionInterface[];
  todayDate = new Date()

  constructor(
    public helper: HelperService,
    private subRepo: SubscriptionsRepositoryService,
    private router: Router,
    private dialog: MatDialog,
    private userTransactionsService:UserTransactionsService,
    private notification: NotificationService,

  ) { this.todayDate.setDate(this.todayDate.getDate() - 1) }

  deleteEnabled: string;
  editEnabled: string
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    window.sessionStorage.clear();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.list;
    this.dataSource = new MatTableDataSource(this.filteredList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filteredList?.map(res => {
      // console.log(res.validTo);
    })
    //  console.log('date',this.todayDate)
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.list.filter((sub) => {
        return (sub.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          sub.courses.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          sub?.flags?.active?.toString().toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
    } else {
      this.filteredList = this.list
    }
    this.dataSource = new MatTableDataSource(this.filteredList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSubscriptionsByStatus(status) {
    let date
    date = this.todayDate.toISOString().toString()
    if (status == 'active') {
      this.filteredList = this.list.filter((sub) => {
        return date < sub.validTo
      });
    }
    else if (status == 'expired') {
      this.filteredList = this.list.filter((sub) => {
        return date > sub.validTo
      });
    }

  }

  getCourse(subscription) {
    window.sessionStorage.setItem('subscriptionName', subscription.title)
    window.sessionStorage.setItem('subscriptionUuid', subscription.uuid)
    this.router.navigate([`manage/subscriptions/${subscription.uuid}/courses`])
  }

  viewSubList(sub) {
    const dialogRef = this.dialog.open(SubscriptionsInfoComponent, {
      data: { payload: sub },
      height: 'auto',
      width: '80%'
    });
  }

  async exportUserDetails(sub){
    console.log('sub',sub);
   let data =await this.userTransactionsService.assignedSubscriptions(sub._id).toPromise()
    if (data.response.length === 0) {
      this.notification.showNotification({
        type: NotificationType.ERROR,
        payload: {
          message: 'No data available',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });    }
    else {
    const dataToExport = data.response.map(x => ({
        transactionId: x?.transactionId,
        Name: x?.userId?.name ? x?.userId?.name : '---',
        Mobile: x?.userId?.mobile ? x?.userId?.mobile : '---',
        actualPrice: x?.actualPrice,
        Coupon: x?.couponId?.code ? x?.couponId?.code:'---',
        discountPrice: x?.discountPrice,
        finalPaidAmount : x?.finalPaidAmount,
        paymentType: x?.paymentType,
        modeOfPayment: x?.modeOfPayment,
        paymentStatus : x?.paymentStatus,
        expiryDate : x?.expiryDate,
        dateOfPayment:x?.dateOfPayment,
        mode_transactionNumber : x?.mode_transactionNumber,
        referenceNumber : x?.referenceNumber,
        paymentMessage : x?.paymentMessage,
        subscriptionId:x?.subscriptionId?.title,
        billNumber:x?.billNumber,
        chequeNumber:x?.chequeNumber,
        chequeDate:x?.chequeDate,
        bankName:x?.bankName,
        creditORdebitCard:x?.creditORdebitCard,
        cardType:x?.cardType,
        upiId:x?.upiId,
        razorPayPaymentId : x?.razorPayPaymentId,
        razoraySignature : x?.razoraySignature,
        razorpayOrderId : x?.razorpayOrderId,
        createdBy:x?.createdBy.name
      }));

    let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
    let workBook: XLSX.WorkBook = XLSX.utils.book_new();

    // Adjust column width
    var wscols = [
      { wch: 15}
    ];

    workSheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
    XLSX.writeFile(workBook, `${sub.title}.xlsx`);
    
  }
}

}
