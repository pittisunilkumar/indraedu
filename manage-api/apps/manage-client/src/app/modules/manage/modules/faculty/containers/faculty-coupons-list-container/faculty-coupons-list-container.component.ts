import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CouponInterface } from '@application/api-interfaces';
import { CouponsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-faculty-coupons-list-container',
  templateUrl: './faculty-coupons-list-container.component.html',
  styleUrls: ['./faculty-coupons-list-container.component.less']
})
export class FacultyCouponsListContainerComponent implements OnInit {

  platoCoupons: CouponInterface[];
  affiliateCoupons: CouponInterface[];
  showList = true;
  length:number;
  errors: string[];
  facultyName:string;
  agentId:string

  constructor(
    private couponsRepo: CouponsRepositoryService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.facultyName = window.sessionStorage.getItem('facultyName');
    this.agentId = window.sessionStorage.getItem('agentId');
    this.loadData();
  }

  loadData() {

     this.couponsRepo.getCouponsByAgentId(this.agentId).subscribe(
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
    );

    // this.couponsRepo.getAllCoupons().subscribe(
    //   (res) => {
    //     this.length =  res?.response.length
    //     if(res?.response?.length) {
    //       this.platoCoupons = res?.response?.filter((coupon) => !coupon.flags.affiliate);
    //       this.affiliateCoupons = res?.response?.filter((coupon) => coupon.flags.affiliate);
    //     } else {
    //       this.platoCoupons = [];
    //       this.affiliateCoupons = [];
    //     }
    //   },
    // );

  }
  backToAgents(){
    this.router.navigate(['manage/faculty/list'])
  }


  

}
