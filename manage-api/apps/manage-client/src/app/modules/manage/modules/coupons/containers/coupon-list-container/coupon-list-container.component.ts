import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CouponInterface,
} from '@application/api-interfaces';
import { CommandRemoveDialogComponent, CouponsRepositoryService, HelperService } from '@application/ui';
import * as _differenceBy from 'lodash.differenceby';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'application-coupon-list-container',
  templateUrl: './coupon-list-container.component.html',
  styleUrls: ['./coupon-list-container.component.less'],
})
export class CouponListContainerComponent implements OnInit {

  platoCoupons: CouponInterface[];
  affiliateCoupons: CouponInterface[];
  showList = true;
  length:number;
  errors: string[];
  

  constructor(
    private couponsRepo: CouponsRepositoryService,
    private dialog: MatDialog,
    public helper: HelperService,
  ) {}
  createEnable:string
  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.loadData();

  }

  loadData() {

    this.couponsRepo.getAllCoupons().subscribe(
      (res) => {
        this.length =  res?.response.length
        if(res?.response?.length) {
          this.platoCoupons = res?.response?.filter((coupon) => !coupon.flags.affiliate);
          this.affiliateCoupons = res?.response?.filter((coupon) => coupon.flags.affiliate);
        } else {
          this.platoCoupons = [];
          this.affiliateCoupons = [];
        }
      },
      (err) => {

      }
    );

  }

  delete(coupon: CouponInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: coupon },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.couponsRepo.deleteCouponsByUuid(coupon.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })

    // return this.couponsRepo
    //   .deleteCouponsByUuid(coupon.uuid)
    //   .pipe(take(1))
    //   .subscribe(
    //     (res) => {
    //       console.log({ res });
    //       this.loadData();
    //     },
    //     (err) => {
    //       console.error({ err });
    //     }
    //   );
  }

  edit(coupon: CouponInterface) {
    return this.couponsRepo
      .editCouponsByUuid(coupon)
      .pipe(take(1))
      .subscribe(
        (res) => {
          console.log({ res });
          this.loadData();
        },
        (err) => {
          console.error({ err });
        }
      );
  }

}
