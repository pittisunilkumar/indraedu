import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CouponInterface, SubscriptionInterface, UserInterface, UserTransactonsInterface } from '@application/api-interfaces';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionsRepositoryService } from '@application/ui';
import { ActivatedRoute } from '@angular/router';
import * as uuid from 'uuid';

@Component({
  selector: 'application-add-user-payment',
  templateUrl: './add-user-payment.component.html',
  styleUrls: ['./add-user-payment.component.less']
})
export class AddUserPaymentComponent implements OnInit {
  @Input() user: UserInterface;
  subscription: SubscriptionInterface;
  @Input() coupons: CouponInterface;
  @Input() agentCoupons:CouponInterface[];
  filteredList:CouponInterface[]
  discountAmount = 0;
  totalAmount: number;
  subscriptionAmount: number;
  paymentMode: string;
  today = new Date();
  expiryDate = new Date();
  period: number;
  periodType: string;
  data: SubscriptionInterface;
  imgUrl: string;
  paymentsForm: FormGroup;
  subUuid: string;
  qbanks = [];
  videos = [];
  tests = [];
  userId:string;
  couponCode:CouponInterface;
  appliedEnable:boolean;
  appliedSuccess:boolean;
  specialCouSuccess:boolean;


  specialCouponEnable:boolean;
  agentCouponEnabled:boolean;


  @Output() commit = new EventEmitter<UserInterface>();
  // @Output() userTransactions = new EventEmitter<UserTransactonsInterface>();



  constructor(
    private _location: Location,
    private formBuilder: FormBuilder,
    private subRepo: SubscriptionsRepositoryService,
    private route: ActivatedRoute
  ) {
  }

  applyCoupons(data){
    if(data == 'agentCoupon'){
      this.specialCouponEnable = true;
      this.agentCouponEnabled = false;
    }
    else if(data == 'coupon'){
      this.specialCouponEnable = false;
      this.agentCouponEnabled = true;
    }
  }

  ngOnChanges() {
    this.filteredList = this.agentCoupons
    console.log("this.user", this.user);
    //  this.subscription?.qbanks.map(res => {
    //     this.user.qbanks = this.user?.qbanks.filter(e=>{
    //       return e.subject_id != res._id
    //     })
    //   })
    //   this.subscription?.videos.map(res => {
    //     this.user.videos = this.user?.videos.filter(e=>{
    //       return e.subject_id != res._id
    //     })
    //   })
    //   this.subscription?.tests.map(res => {
    //     this.user.tests = this.user?.tests.filter(e=>{
    //       return e.category_id != res._id
    //     })
    //   })

    // this.subscriptionAmount = this.subscription?.actual;
    // this.totalAmount = this.subscriptionAmount;
  }

  

  ngOnInit(): void {
    this.userId = window.sessionStorage.getItem('userId');
    this.subUuid = this.route.snapshot.paramMap.get('uuid');
    this.periodType = window.sessionStorage.getItem('periodType');
    this.period = parseInt(window.sessionStorage.getItem('period'));
    if(this.periodType == 'MONTHS'){
    this.expiryDate.setMonth(this.expiryDate.getMonth() + this.period);
    }else{
    this.expiryDate.setDate(this.expiryDate.getDate() + this.period);
    // this.todayDate.setDate(this.todayDate.getDate() - 1)
    }
    console.log('this.expiryDate',this.expiryDate);
    
    this.buildForm();
    this.subRepo.getSubscriptionByUuid(this.subUuid).subscribe(data => {
      this.subscription = data.response[0];
      this.subscriptionAmount = this.subscription?.actual;
      this.totalAmount = this.subscriptionAmount;

    })
  }

  buildForm() {
    this.paymentsForm = this.formBuilder.group({
      // couponCode: [''],
      modeOfPayment: ['', Validators.required],
      expiryDate:[this.expiryDate],
      today:[this.today],
      // paymentType:['',Validators.required],
      billNumber: [''],
      chequeNumber: [''],
      chequeDate: [''],
      bankName: [''],
      transactionNumber: [''],
      upiTransactionNumber: [''],
      referanceNumber: [''],
      card: [''],
      cardType: [''],
      upiId: [''],
      imgUrl: this.formBuilder.group({
        imgUrl: '',
        upload: true,
      }),
    })
  }

  getPaymentMode(mode) {
    this.paymentMode = mode.value
    console.log('this.paymentMode', this.paymentMode);
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.paymentsForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  applyFilter(event: any) {
    // console.log(this.agentCoupons);
    if(this.agentCoupons.length > 0){
      this.agentCoupons.find((res,i)=>{
        if(res.code == event){
          if(res){
            this.calculateTotalAMount(res);
            this.appliedEnable = false;
            this.appliedSuccess= true;
            this.specialCouSuccess = false;
          }
          return true
        }
        else{
            this.appliedEnable = true;
            this.appliedSuccess= false;
            this.specialCouSuccess = false;
  
            this.totalAmount = this.subscriptionAmount
            this.discountAmount =0
        }
       
        
      })
    }
    else{
      this.appliedEnable = true;
    }
    
   
  }

  calculateTotalAMount(coupon) {
    this.appliedEnable = false;
    this.appliedSuccess= false;
    this.specialCouSuccess = true;
    if (coupon.discountType === 'percentage') {
      this.discountAmount = this.subscriptionAmount * coupon.discount / 100;
    }
    else if (coupon.discountType === 'flat') {
      this.discountAmount = coupon.discount
    }
    this.totalAmount = this.subscriptionAmount - this.discountAmount
    this.couponCode = coupon
  }

  submit() {
    const value = this.paymentsForm.value;
    console.log('value',value);
    this.expiryDate =value.expiryDate
    this.today =value.today

    
    let expirydate
    console.log(this.user);
    
    this.user.subscriptions = this.user.subscriptions.filter(sub => {
      return sub.subscription_id != this.subscription._id
    });
    let subscription = {
      'subscription_id': this.subscription._id,
      'expiry_date': this.expiryDate,
      'createdOn': this.today
    }
    this.user.subscriptions.push(subscription);
    this.subscription.qbanks.map(res => {
      this.user.qbanks = this.user?.qbanks.filter(e => {
        expirydate = e.expiry_date
        return e.subject_id != res._id
      })
      if (expirydate > this.expiryDate.toISOString().toString()) {
        expirydate = expirydate
      }
      else {
        expirydate = this.expiryDate
      }
      this.user.qbanks.push({ 'subject_id': res._id, 'expiry_date': expirydate });
    })
    this.subscription.videos.map(res => {
      this.user.videos = this.user?.videos.filter(e => {
        expirydate = e.expiry_date
        return e.subject_id != res._id
      })
      if (expirydate > this.expiryDate.toISOString().toString()) {
        expirydate = expirydate
      }
      else {
        expirydate = this.expiryDate
      }
      this.user.videos.push({ 'subject_id': res._id, 'expiry_date': expirydate });
    })
    this.subscription.tests.map(res => {
      this.user.tests = this.user?.tests.filter(e => {
        expirydate = e.expiry_date
        return e.category_id != res._id
      })
      if (expirydate > this.expiryDate.toISOString().toString()) {
        expirydate = expirydate
      }
      else {
        expirydate = this.expiryDate
      }
      this.user.tests.push({ 'category_id': res._id, 'expiry_date': expirydate });
    })

    let payload: any = {
      uuid: uuid.v4(),
      userId:this.userId,
      subscriptionId: this.subscription._id,
      dateOfPayment: this.today,
      expiryDate: this.expiryDate,
      actualPrice:this.subscription.actual,
      discountPrice:this.discountAmount,
      finalPaidAmount:this.totalAmount,
      couponId: this.couponCode?this.couponCode._id:null,
      paymentType:'OFFLINE', 
      // paymentType:value.paymentType,
      modeOfPayment: value.modeOfPayment,
      paymentStatus:'SUCCESS',
      fileUrl: value.imgUrl.imgUrl,
      billNumber: value.billNumber,
      chequeNumber: value.chequeNumber,
      chequeDate: value.chequeDate,
      bankName: value.bankName,
      referenceNumber: value.referanceNumber,
      creditORdebitCard: value.card,
      cardType: value.cardType,
      upiId: value.upiId,
      mode_transactionNumber: value.modeOfPayment ==='online'? value.transactionNumber:value.upiTransactionNumber,
      paymentCreatedOn:new Date(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
      createdOn:new Date(),
      user_subscriptions:this.user,
    }

    console.log('payload', payload);
    return this.commit.emit(payload)

  }

  backToSubscriptions() {
    this._location.back();
  }

}
