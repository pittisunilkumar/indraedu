import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityInterface, ResponseInterface, SubscriptionInterface } from '@application/api-interfaces';
import { CouponsRepositoryService, CourseRepositoryService, QBankRepositoryService, SubscriptionsRepositoryService, TestsRepositoryService, VideosRepositoryService } from '@application/ui';
import * as _uniqBy from 'lodash.uniqby';
import {  Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'application-create-subscription-container',
  templateUrl: './create-subscription-container.component.html',
  styleUrls: ['./create-subscription-container.component.less'],
})
export class CreateSubscriptionContainerComponent implements OnInit {

  errors: string[];
  courses$ = this.courseRepo.getAllActiveCourses();
  videos: EntityInterface[]  = [];
  tests: EntityInterface[]  = [];
  qbanks: EntityInterface[]  = [];
  qbanksList = []
  coupons$ = this.couponsRepo.getAllCoupons();
  data: any;
  mode = this.router.url.includes('edit') ? 'edit' : 'add';
  subscription$: Observable<ResponseInterface<SubscriptionInterface>>;

  constructor(
    private courseRepo: CourseRepositoryService,
    private couponsRepo: CouponsRepositoryService,
    private subRepo: SubscriptionsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.subscription$ = this.getSubscriptionByUuid();
    }
  }

  getSubscriptionByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.subRepo.getSubscriptionByUuid(params.get('uuid'));
      })
    );
  }

  // getEntitlements(data: EntitlementsCoursesInterface) {
    // console.log('data',data);
    //  let courseIds = ['612dc2fcecfc8fd1bf3c5ca6','610d1e25a2d826621cc194a2']
    //  let qbankObs = []
    
 
    // const vidObs = data.videos?.map(it => this.videosRepo.getVideosByCourseId(it.id));
    // const testObs = data.testSeries?.map(it => this.testRepo.getTestsByCourseId(it.id));
    // const qbankObs = data.qbanks?.map(it => this.qbankRepo.getQBankTestsByCourseId(it.id));
    // const qbankObs = data.qbanks?.map(it => this.qbankRepo.subjectsByCourseIds(courseIds));

    // courseIds.map(it=>{
    //   // courseIds.push(it.id);
    //   let data =  this.qbankRepo.subjectsByCourseIds(courseIds);
    //   qbankObs.push(data)
    // })

    // this.getData(vidObs, 'vids');
    // this.getData(testObs, 'tests');
    // this.getData(qbankObs, 'qbank');
    

  // }


  // getData(obs: Observable<any>[], type: string) {

  //   let finalList = [];

  //   return combineLatest(obs).pipe(

  //     switchMap(res => {

  //       const list = [];

  //       const arr = res.map(it => it.response);
  //       // console.log({ arr });

  //       arr.map(it => {
  //         it?.map(itt => list.push(itt));
  //       })
  //       // console.log('list',list);
        
  //       return list;
  //     })
  //   ).subscribe(result => {
       
  //     finalList.push(result);
          
  //     finalList = _uniqBy(finalList, (it) => it?._id);
  //     console.log('finalList',finalList);

  //     switch(type) {
  //       case 'vids': {
  //         this.videos = finalList;
  //         break;
  //       }
  //       case 'tests': {
  //         this.tests = finalList;
  //         break;
  //       }
  //       case 'qbank': {
  //         this.qbanks = finalList;
  //         break;
  //       }
  //     }

  //     // console.log(this.videos, this.tests, this.qbanks);


  //   });

  // }

  submit(event) {

    if (this.mode === 'add') {
      this.subRepo.addSubscription(event).subscribe(
        (result) => {
          console.log({ result });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          this.errors = err.error.error;
        }
      );
    } else {
      this.subRepo.editSubscription(event).subscribe(
        (result) => {
          console.log({ result });
          this.router.navigateByUrl('/manage/subscriptions/list');
        },
        (err) => {
          this.errors = err.error.error;
        }
      );
    }

  }

}
