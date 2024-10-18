import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponInterface, CourseInterface } from '@application/api-interfaces';
import { CouponsRepositoryService, SyllabusRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create1-coupon-container',
  templateUrl: './create1-coupon-container.component.html',
  styleUrls: ['./create1-coupon-container.component.less'],
})
export class Create1CouponContainerComponent implements OnInit {

  coupon$: Observable<CouponInterface>;
  mode = this.route.snapshot.data['mode'];
  errors: string[] = [];

  constructor(
    private couponsRepo: CouponsRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.coupon$ = this.getCouponByUuid();
    }
  }

  getCouponByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.couponsRepo.getCouponsByUuid(params.get('uuid'));
      })
    );
  }

  submit(coupon) {
    console.log('inputbody', coupon);

    this.couponsRepo.addTitle(coupon).subscribe(
      (res) => {
        console.log('res', { res });
        // this.router.navigate(['../', 'list'], { relativeTo: this.route });
      },
      (err) => {
        console.log({ err });
        this.errors = err.error.error;
      }
    );

  }
}
