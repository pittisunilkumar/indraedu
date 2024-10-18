import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponInterface, ResponseInterface, SubscriptionInterface, UserInterface, UserTransactonsInterface } from '@application/api-interfaces';
import { CouponsRepositoryService, SubscriptionsRepositoryService, UsersRepositoryService, UserTransactionsService } from '@application/ui';
import { Observable } from 'rxjs';

@Component({
  selector: 'application-add-user-payment-container',
  templateUrl: './add-user-payment-container.component.html',
  styleUrls: ['./add-user-payment-container.component.less']
})
export class AddUserPaymentContainerComponent implements OnInit {
  subscription$: Observable<ResponseInterface<SubscriptionInterface>>;
  user$: Observable<ResponseInterface<UserInterface>>

  platoCoupons: CouponInterface[];
  agentCoupons: CouponInterface[];
  errors: string[] = [];
  userName: string;
  subscriptionName: string;
  subUuid: string;
  userId: string;
  subscriptionId: string;
  uuid: string;
  userTransaction: UserTransactonsInterface

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private subRepo: SubscriptionsRepositoryService,
    private couponsRepo: CouponsRepositoryService,
    private userRepo: UsersRepositoryService,
    private userTransactionRepo: UserTransactionsService,

  ) { }

  ngOnInit(): void {
    this.userId = window.sessionStorage.getItem('userId');
    this.subscriptionId = window.sessionStorage.getItem('subscriptionId');
    this.userName = window.sessionStorage.getItem('userName');
    this.subscriptionName = window.sessionStorage.getItem('subscriptionName');
    this.uuid = window.sessionStorage.getItem('userUuid');
    // this.subUuid =  this.route.snapshot.paramMap.get('uuid');
    // this.subscription$ = this.getSubscriptionByUuid();
    this.user$ = this.userRepo.getUserByUuid(this.uuid);
    this.loadData();
  }

  loadData() {
    this.userRepo.getUserCoupons(this.userId, this.subscriptionId).subscribe(
      (res) => {
        if (res?.response?.length) {
          this.platoCoupons = res?.response?.filter((coupon) => !coupon.flags.affiliate);
        } else {
          this.platoCoupons = [];
        }
      }
    );

    this.userRepo.getAgentCoupons( this.subscriptionId).subscribe(
      (res) => {
        if (res?.response?.length) {
          this.agentCoupons = res?.response?.filter((coupon) => !coupon.flags.affiliate);
        } else {
          this.agentCoupons = [];
        }
      }
    );
    // this.couponsRepo.getAllCoupons().subscribe(
    //   (res) => {
    //     if(res?.response?.length) {
    //       this.platoCoupons = res?.response?.filter((coupon) => !coupon.flags.affiliate);
    //     } else {
    //       this.platoCoupons = [];
    //     }
    //   }
    // );

  }


  submit(payload) {
    this.userTransactionRepo.addUserTransactions(payload).subscribe(res => {
      this.userTransaction = res?.response
      if ( this.userTransaction?.paymentStatus === 'SUCCESS') {
        return this.userRepo.assignSubscriptions(this.uuid, payload.user_subscriptions).subscribe(
          (result) => {
            console.log({ result });
            // this.router.navigate(['../'], { relativeTo: this.route });
            this.router.navigate([`/manage/users/${this.uuid}/packages`])
          },
          (err) => {
            this.errors = err.error.error;
          }
        )
      }
    })    
    
  }

  // getSubscriptionByUuid() {
  //   return this.subRepo.getSubscriptionByUuid(this.subUuid);
  // }
  backToUsers() {
    this.router.navigate(['/manage/users/list']);
  }
  backToSubscriptions() {
    this._location.back();
  }

}
