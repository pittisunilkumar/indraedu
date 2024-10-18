import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentTransactonsInterface } from '@application/api-interfaces';
import { AgentTansactionsService, HelperService, NotificationService, NotificationType } from '@application/ui';

@Component({
  selector: 'application-agent-payments-list',
  templateUrl: './agent-payments-list.component.html',
  styleUrls: ['./agent-payments-list.component.less']
})
export class AgentPaymentsListComponent implements OnInit {
  agentId: string;
  agentTransations: any;
  coupon: string;
  displayedColumns: string[] = [
    'sno',
    'transactionId',
    'name',
    'coupon',
    'agentTotalAmount',
    'agentDueAmount',
    'finalPaidAmount',
    'modeOfPayment',
    'dateOfPayment',
    'paymentStatus',
    // 'actions'
  ];
  dataSource: MatTableDataSource<AgentTransactonsInterface>;
  @Output() delete = new EventEmitter<AgentTransactonsInterface>();
  @Output() resetPassword = new EventEmitter<AgentTransactonsInterface>();
  expandedElement: AgentTransactonsInterface | null;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filteredList: any;
  list: any;
  length: number;
  form = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl('')
  })

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agentTansactionsService: AgentTansactionsService,
    public helper: HelperService,
    private notification: NotificationService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id');
    this.coupon = window.sessionStorage.getItem('couponId')
    this.agentTansactionsService.getTransactionById(this.agentId).subscribe(res => {
      this.agentTransations = res.response;
      this.filteredList = this.agentTransations
      if (this.coupon) {
        let agentTrans = []
        this.agentTransations.map(e => {
          if (e.couponId._id == this.coupon) {
            agentTrans.push(e)
            this.dataSource = new MatTableDataSource(agentTrans);
          }
        })
      }
      else {
        this.dataSource = new MatTableDataSource(this.agentTransations);
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.agentTransations.filter((trans) => {
        return (
          trans.transactionId.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.agent?.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.couponId?.code.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.paymentStatus.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          trans.modeOfPayment.toLowerCase().includes(filterValue.toLocaleLowerCase())
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);

    } else {
      this.dataSource = new MatTableDataSource(this.agentTransations);
    }
    this.dataSource.paginator = this.paginator;
  }

  searchPayments() {
    let dates = {
      fromDate: this.form.value.fromDate,
      toDate: this.form.value.toDate.setDate(this.form.value.toDate.getDate() + 1)
    }
    this.agentTansactionsService.searchTransactions(dates).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.filteredData.length
      if (this.length) {
        this.notification.showNotification({
          type: NotificationType.SUCCESS,
          payload: {
            message: 'Agent payments fetched successfully',
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

  back() {
    this._location.back()
  }


}
