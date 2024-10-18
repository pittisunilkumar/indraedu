import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponInterface, ResponseInterface, SubscriptionInterface, UserInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import { ObjectId } from 'mongoose';
import * as uuid from 'uuid';
@Component({
  selector: 'application-testing-form',
  templateUrl: './testing-form.component.html',
  styleUrls: ['./testing-form.component.scss']
})
export class TestingFormComponent implements OnInit, OnChanges {

  @Input() coupon?: ResponseInterface<CouponInterface>;
  @Input() mode: string;
  @Output() commit = new EventEmitter<CouponInterface>();
  createCouponForm: FormGroup;
  couponByUuid: CouponInterface;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.coupon?.currentValue) {
      this.coupon = changes?.coupon?.currentValue;
      this.couponByUuid = changes?.coupon?.currentValue?.response;
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {

    this.createCouponForm = this.formBuilder.group({
      title: null,
      uuid: null,
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

    // if (this.mode === 'add') {
    //   const payload = {
    //     title: value
    //   };

    this.commit.emit(value);
  }


}
