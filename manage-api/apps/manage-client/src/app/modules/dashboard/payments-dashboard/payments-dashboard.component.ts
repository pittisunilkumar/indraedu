import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UserTransactonsInterface } from '@application/api-interfaces';
import { NotificationService, NotificationType, UserTransactionsService } from '@application/ui';
import moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'application-payments-dashboard',
  templateUrl: './payments-dashboard.component.html',
  styleUrls: ['./payments-dashboard.component.less'],
  host: { 
    "(window:resize)": "onWindowResize($event)"
  }
})
export class PaymentsDashboardComponent implements OnInit {

  public userTransactions: any;
  totalAmount: number;
  months = [3, 6, 9, 12];
  payments: any


  type = 'ColumnChart';
  data = [['', 0]];
  weeklyData = [['', 0]];
  columnNames = ['', 'Income'];
  columnOptions:any;
  isMobile: boolean = false;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  mobileWidth: number = 760;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userTransactionsService: UserTransactionsService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    let value = 3
    this.userTransactionsService.yearwiseTransactions({ months: value }).subscribe(res => {
      this.data = res.response
    })
    this.userTransactionsService.weeklyPayments().subscribe(res => {
      this.weeklyData = res.response
    })
    this.userTransactionsService.paymentsReports().subscribe(res => {
      this.payments = res.response
    })
    this.windowSize();
  }
  selectMonths(value) {
    this.userTransactionsService.yearwiseTransactions({ months: value }).subscribe(res => {
      this.windowSize();
      this.data = res.response;
      this.notification.showNotification({
        type: NotificationType.SUCCESS,
        payload: {
          message: 'User Payments Fetched Successfully',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });
    })
  }

  windowSize() {
    if (this.width < 760) {
      this.columnOptions = {
        is3D: true,
        responsive: true,
        width: 350,
        height: 300,
        // colors: ['#40C4FF', '#1E88E5', 'red'],
        legend: { position: 'top', maxLines: 2 },
        bar: { groupWidth: '50%' },
        isStacked: false,
        animation: {
          duration: 2000,
          easing: 'out',
        },
      };
    }
    else {
      this.columnOptions = {
        is3D: true,
        responsive: true,
        width: 600,
        height: 350,
        // colors: ['#40C4FF', '#1E88E5', 'red'],
        legend: { position: 'top', maxLines: 2 },
        bar: { groupWidth: '50%' },
        isStacked: false,
        animation: {
          duration: 2000,
          easing: 'out',
        },
      };
    }
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
    this.windowSize();
  }


}
