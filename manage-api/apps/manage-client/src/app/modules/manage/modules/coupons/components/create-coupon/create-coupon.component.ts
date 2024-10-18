import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponInterface, FacultyInterface, ResponseInterface, SubscriptionInterface, UserInterface } from '@application/api-interfaces';
import { FacultyRepositoryService, HelperService, SubscriptionsRepositoryService, UsersRepositoryService } from '@application/ui';
import * as uuid from 'uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'application-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCouponComponent implements OnInit, OnChanges {

  @Input() coupon?: ResponseInterface<CouponInterface>;
  @Input() mode: string;
  @Output() commit = new EventEmitter<CouponInterface>();
  createCouponForm: FormGroup;
  couponByUuid: CouponInterface;
  users: any;
  subscriptions: SubscriptionInterface[];
  agents: FacultyInterface[];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userList = [];
  allUsers: any;
  isDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  // subscriptionAmount:number;
  // agentCommmission:number
  // @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(
    public helper: HelperService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userRepo: UsersRepositoryService,
    private subRepo: SubscriptionsRepositoryService,
    private facultyRepo: FacultyRepositoryService,
  ) { }

  remove(user: string): void {
    const index = this.userList.indexOf(user);
    if (index >= 0) {
      this.userList.splice(index, 1);
    }
  }

  selected(user): void {
    this.userList.push(user.option.value);
  }

  applyFilter(event: any) {
    const filterValue = event;
    let data = {
      page: 1,
      limit: 100,
      search: filterValue
    }
    this.userRepo.getStudentsPerPage(data).subscribe(
      (res: any) => {
        this.users = this.allUsers = res?.response?.data
      },
      (err) => { }
    );
    // const filterValue = (event.target as HTMLInputElement).value;
    // if (filterValue) {
    //   this.users = this.allUsers.filter((user) => {
    //     return user.mobile.toString().includes(filterValue);
    //   });
    // } else {
    //   this.users = this.allUsers
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.coupon?.currentValue) {
      this.coupon = changes?.coupon?.currentValue;
      this.couponByUuid = changes?.coupon?.currentValue?.response;
      this.userList = this.couponByUuid?.users
      this.buildForm();
    }
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate()
    this.minDate = new Date(currentYear - 0, currentMonth - 0, currentDate + 0);
    this.maxDate = new Date(currentYear + 3, currentMonth);

    this.buildForm();
    this.getUsers();
    this.getAgents();
    // this.subRepo.getCouponSubscriptions().subscribe(
    //   (res) => {
    //     this.subscriptions = res?.response;
    //   }
    // );
    this.subRepo.getAllSubscriptions().subscribe(
      (res) => {
        this.subscriptions = res?.response;
      }
    );
   
  }
  // getCouponType(type) {
  //   if (type == 'user') {
  //     this.getUsers();
  //   }
  //   else if (type == 'agent') {
  //     this.getAgents();
  //   }
  // }

  getUsers() {
    // this.userRepo.getAllStudents().subscribe(res => {
    //   this.users = res?.response;
    //   this.allUsers = res?.response;
    // })
    let data = {
      page: 1,
      limit:10,
      search:''
    }
    console.log('data',data);
    
    this.userRepo.getStudentsPerPage(data).subscribe(
      (res) => {
        this.users = res?.response?.data;
        this.allUsers = res?.response?.data;
      },
      (err) => { }
    );
  }
  getAgents() {
    this.facultyRepo.getAllFaculty().subscribe(
      (res) => {
        this.agents = res?.response;
      }
    )
  }

  // getAgentCommmission(event){
  //   this.agentCommmission =event.target.value;
  //   this.agentAmount();
  //   console.log(this.createCouponForm.value.agentCommission);

  // }

  agentCommmissionValue() {
    let val = this.createCouponForm.value.agentCommission
    let subscriptionAmount = this.createCouponForm.value.subscription.actual;
    let Amount = subscriptionAmount * val / 100;
    this.createCouponForm.get('agentAmount').patchValue(Amount);
  }



  buildForm() {
    if (this.mode === 'edit') {
      console.log('this.couponByUuid?.appliedUsersCount',this.couponByUuid?.appliedUsersCount);
      if(this.couponByUuid?.appliedUsersCount > 0){
        this.isDisabled = true
      }
    }
    console.log('this.couponByUuid', this.couponByUuid);
    this.createCouponForm = this.formBuilder.group({
      code: [
        this.couponByUuid ? this.couponByUuid?.code : '',
        [Validators.required, Validators.maxLength(40)],
      ],
      discountType: [this.couponByUuid ? this.couponByUuid?.discountType : null, Validators.required],
      discount: [this.couponByUuid ? this.couponByUuid?.discount : null, Validators.required],
      totalCoupons: [this.couponByUuid ? this.couponByUuid?.totalCoupons : null, Validators.required],
      valiedFrom: [this.couponByUuid ? this.couponByUuid?.valiedFrom : null, Validators.required],
      valiedTo: [this.couponByUuid ? this.couponByUuid?.valiedTo : null, Validators.required],
      subscription: [this.couponByUuid ? this.couponByUuid?.subscription : null, Validators.required],
      couponType: [this.couponByUuid ? this.couponByUuid?.couponType : null, Validators.required],
      users: [this.couponByUuid ? this.couponByUuid?.users : null,],
      agent: [this.couponByUuid ? this.couponByUuid?.agent : null,],
      agentCommission: [this.couponByUuid ? this.couponByUuid?.agentCommission : 0],
      agentAmount: [this.couponByUuid ? this.couponByUuid?.agentAmount : 0],
      flags: this.formBuilder.group({
        active: this.couponByUuid ? this.couponByUuid?.flags?.active : true,
        affiliate: this.couponByUuid ? this.couponByUuid?.flags?.affiliate : false,
      }),
    });

  }

  compareFn(c1: CouponInterface, c2: CouponInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  goToList() {
    if (this.mode === 'add') {
      this.router.navigate(['../', 'list'], { relativeTo: this.route })
    } else {
      this.router.navigate(['../../', 'list'], { relativeTo: this.route })
    }
  }

  resetForm() {
    this.createCouponForm.reset();
  }

  submit() {
    const value = this.createCouponForm.value;
    console.log('this.userList', this.userList);

    if (this.mode === 'add') {
      const payload: CouponInterface = {
        uuid: uuid.v4(),
        code: value.code,
        discountType: value.discountType,
        discount: parseInt(value.discount),
        totalCoupons: parseInt(value.totalCoupons),
        availableCoupons: parseInt(value.totalCoupons),
        valiedFrom: value.valiedFrom,
        valiedTo: value.valiedTo,
        subscription: value.subscription._id,
        couponType: value.couponType,
        users: this.userList.map(res => res._id),
        agent: value.agent ? value.agent._id : null,
        agentCommission: parseInt(value.agentCommission),
        agentAmount: value.agentAmount,
        appliedUsersCount:0,
        agentTotalAmount: 0,
        agentDueAmount: 0,
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedBy: null,
        flags: {
          active: value.flags.active,
          affiliate: value.flags.affiliate,
        },
      };
      console.log('payload', payload);
      this.commit.emit(payload);
    }
    if (this.mode === 'edit') {
      const payload: CouponInterface = {
        uuid: this.couponByUuid.uuid,
        code: value.code,
        discountType: value.discountType,
        discount: parseInt(value.discount),
        totalCoupons: parseInt(value.totalCoupons),
        availableCoupons: this.couponByUuid.availableCoupons,
        valiedFrom: value.valiedFrom,
        valiedTo: value.valiedTo,
        subscription: value.subscription._id,
        couponType: value.couponType,
        users: value.couponType === 'users' ? this.userList.map(res => res._id) : [],
        agent: value.couponType === 'agent' ? value.agent ? value.agent._id : null : null,
        agentCommission: value.couponType === 'agent' ? parseInt(value.agentCommission) : 0,
        agentAmount: value.couponType === 'agent' ? value.agentAmount : 0,
        agentTotalAmount: value.couponType === 'agent' ? this.couponByUuid?.agentTotalAmount : 0,
        agentDueAmount: value.couponType === 'agent' ? this.couponByUuid?.agentDueAmount : 0,
        appliedUsersCount: this.couponByUuid?.appliedUsersCount,
        createdOn: this.couponByUuid.createdOn,
        createdBy: this.couponByUuid.createdBy,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
          affiliate: value.flags.affiliate,
        },
      };
      console.log('payload', payload);
      this.commit.emit(payload);
    }
  }
}
