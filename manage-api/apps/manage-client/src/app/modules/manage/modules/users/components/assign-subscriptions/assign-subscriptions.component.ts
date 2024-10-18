import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SubscriptionInterface, UserInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import { SubscriptionsInfoComponent } from '../../../subscriptions/components';

@Component({
  selector: 'application-assign-subscriptions',
  templateUrl: './assign-subscriptions.component.html',
  styleUrls: ['./assign-subscriptions.component.less']
})
export class AssignSubscriptionsComponent implements OnInit {

  displayedColumns: string[] = [
    'sno',
    'subscription',
    'course',
    'order',
    // 'createdOn',
    'validTo',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<SubscriptionInterface>;

  @Input() subscriptions: SubscriptionInterface[];
  @Input() user: UserInterface;
  @Output() commit = new EventEmitter<UserInterface>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allSelected = false;
  allComplete: boolean = false;
  Indeterminate = false;
  isBtnEnabled: boolean;
  selectedSubscriptionCount: number;
  filteredList: SubscriptionInterface[];
  canSelect?= false;
  assignSubscription = [];
  selectedSubscriptions: any;
  date =new Date()

  subAssigned=[];

  constructor(
    public helper: HelperService,
    private router: Router,
    private dialog: MatDialog,

    // private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.filteredList = this.subscriptions;
    this.dataSource = new MatTableDataSource(this.subscriptions);
    this.dataSource.paginator = this.paginator;
    this.selectedSubscriptions = this.user?.subscriptions;
    // console.log('this.subscription_id ',this.selectedSubscriptions );
    console.log('this.dataSource ',this.dataSource );

    this.subscriptions?.map((res,i)=>{
      this.selectedSubscriptions?.map((e,j)=>{
        if(res._id === e?.subscription_id){
          if(e.expiry_date > this.date.toISOString().toString()){
            this.subAssigned[i] = true
          }
        }
      })
    })

    
    // this.selectedSubscriptions?.map(sub=>{
    //   this.assignSubscription.push(sub.uuid)
    //   this.checkBoxChecked();
    // })
  }
 
  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.subscriptions = this.filteredList.filter((question) => {
        return question.title.toLowerCase().includes(filterValue);
      });
    } else {
      this.subscriptions = this.filteredList
    }
    this.dataSource = new MatTableDataSource(this.subscriptions);
    this.dataSource.paginator = this.paginator;
  }
  addPayment(sub){
    console.log('sub',sub);
    
   window.sessionStorage.setItem('subscriptionName',sub.title);
   window.sessionStorage.setItem('subscriptionId',sub._id);
   window.sessionStorage.setItem('period',sub.period);
   window.sessionStorage.setItem('periodType',sub.periodType);
  }

  viewSubList(sub){
    const dialogRef = this.dialog.open(SubscriptionsInfoComponent, {
      data: { payload: sub},
      height: 'auto',
      width:'80%'
    });
  }

   // submit() {
  //   this.user.subscriptions = []
  //   this.selectedSubscriptions.map(it => {
  //     const arr = this.user.subscriptions.filter(sub => sub._id === it._id);
  //     if (!arr?.length) {                
  //       this.user.subscriptions.push(it._id);
  //     }
  //   });
  //   console.log(this.user.subscriptions);
  //   return this.commit.emit(this.user);
  // }

  

  // cancel() {
  //   return this.router.navigate(['../'], { relativeTo: this.route });
  // }

  
  // toggleQuestion(event, sub) {
  //   const Quuid = sub.uuid;
  //   let index: number;
  //   if (event.checked) {
  //     this.selectedSubscriptions = [...this.selectedSubscriptions, sub];
  //   }
  //   else {
  //     this.selectedSubscriptions?.filter((it, ind) => {
  //       if (it.uuid === Quuid) {
  //         index = ind;
  //       }
  //     });
  //     this.selectedSubscriptions?.splice(index, 1);
  //   }
  //   this.checkBoxChecked();
  //   this.selectedSubscriptionCount = this.selectedSubscriptions.length;

  //   console.log(this.selectedSubscriptions);
  // }

  // setAll(completed: boolean) {
  //   if (completed == true) {
  //     // this.allSelected = true;
  //     this.subscriptions.map(res => {
  //       this.assignSubscription.push(res.uuid)
  //       const arr = this.selectedSubscriptions?.filter(it => it.uuid === res.uuid);
  //       if (!arr?.length) {
  //         this.selectedSubscriptions?.push(res);
  //       }
  //     })
  //   }
  //   else {
  //     this.assignSubscription = [];
  //     this.user.subscriptions = []
  //     // this.allSelected = false
  //     this.selectedSubscriptions = []
  //   }
  //   this.checkBoxChecked();
  //   this.selectedSubscriptionCount = this.selectedSubscriptions.length;
  //   console.log(this.selectedSubscriptions);
  // }

  // checkBoxChecked() {
  //   if (this.subscriptions.length == this.selectedSubscriptions.length) {
  //     this.Indeterminate = false
  //     this.allComplete = true
  //     this.isBtnEnabled = true
  //   }
  //   else {
  //     if (this.selectedSubscriptions.length == 0) {
  //       this.Indeterminate = false;
  //       this.allComplete = false;
  //       this.isBtnEnabled = false;
  //     }
  //     else if (this.selectedSubscriptions.length > 0) {
  //       this.Indeterminate = true;
  //       this.isBtnEnabled = true
  //     }
  //   }
  // }

  // select(subscription: SubscriptionInterface) {
  //   this.selectedSubscriptions.push(subscription);
  // }

}
