import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CouponInterface, CourseInterface, EntityInterface, SubscriptionInterface, TestInterface, VideoInterface } from '@application/api-interfaces';
import { HelperService, QBankRepositoryService, TestCategoriesRepositoryService, VideosRepositoryService } from '@application/ui';
import { map } from 'rxjs/operators';
import * as uuid from 'uuid';

export interface EntitlementsCoursesInterface {
  videos: { id: string; uuid: string; title: string }[];
  testSeries: { id: string; uuid: string; title: string }[];
  qbanks: { id: string; uuid: string; title: string }[];
}

@Component({
  selector: 'application-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.less'],
})
export class CreateSubscriptionComponent implements OnInit, OnChanges {

  @Input() courses: CourseInterface[];
  // @Input() videos: EntityInterface[];
  // @Input() tests: EntityInterface[];
  // @Input() qbanks: EntityInterface[];
  @Input() coupons: CouponInterface[];
  @Input() mode: string;
  @Input() subscription: SubscriptionInterface;
  @Output() commit = new EventEmitter<SubscriptionInterface>();
  isDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  // @Output() selectedCourses = new EventEmitter<EntitlementsCoursesInterface>();



  @ViewChild(MatSelectionList) courseSelections: MatSelectionList;
  @ViewChild(MatSelectionList) videoSelections: MatSelectionList;
  @ViewChild(MatSelectionList) testSelections: MatSelectionList;
  @ViewChild(MatSelectionList) qbankSelections: MatSelectionList;

  qbanks: EntityInterface[];
  videos: EntityInterface[];
  tests: EntityInterface[];

  form: FormGroup;
  videosByCoursesList: VideoInterface[];
  testsByCoursesList: TestInterface[];
  months: { name: string; value: number }[];

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private qbankRepo: QBankRepositoryService,
    private videosRepo: VideosRepositoryService,
    private testCategoriesRepo: TestCategoriesRepositoryService,
  ) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate()
    this.minDate = new Date(currentYear - 0, currentMonth - 0, currentDate + 0);
    this.maxDate = new Date(currentYear + 3, currentMonth);

    this.buildForm();
    this.months = this.helper.generateMonths();
    this.coupons = this.coupons?.filter(cou => {
      return cou.flags.affiliate === false && cou.flags.active === true;
    });



  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.subscription?.currentValue) {
      this.subscription = changes?.subscription?.currentValue;
      this.buildForm();
      this.getCourses(this.subscription.courses)
      if (this.subscription?.courses?.length > 0) {
        // this.getData();
      }
    }

    // if (changes?.videosList?.currentValue) {
    //   this.videos = changes?.videos?.currentValue;
    // }
    // if (changes?.tests?.currentValue) {
    //   this.tests = changes?.tests?.currentValue;
    // }
    // if (changes?.qbanks?.currentValue) {
    //   this.qbanks = changes?.qbanks?.currentValue;
    // }

  }

  buildForm() {
    console.log('this.subscription', this.subscription);
    // if (this.mode == 'edit') {
    //   if (this.subscription?.periodType == "MONTHS") {
    //     this.months = this.helper.generateMonths();
    //   } else {
    //     this.months = this.helper.generateDays();
    //   }
    // }
    this.months = this.subscription?.periodType == "MONTHS" ?
      [{ name: this.subscription?.period + ' month(s)', value: this.subscription?.period }] :
      [{ name: this.subscription?.period + ' days(s)', value: this.subscription?.period }];
      
    this.form = this.formBuilder.group({
      title: [this.subscription ? this.subscription.title : '', Validators.required],
      order: [this.subscription ? this.subscription.order : null, Validators.required],
      courses: [this.subscription ? this.subscription.courses : null, Validators.required],
      videos: [this.subscription ? this.subscription.videos : null],
      tests: [this.subscription ? this.subscription.tests : null],
      qbanks: [this.subscription ? this.subscription.qbanks : null],
      description: [this.subscription ? this.subscription.description : null],
      periodType: [this.subscription ? this.subscription?.periodType : ''],
      period: [this.subscription ? this.months : null],
      actual: [this.subscription ? this.subscription.actual : null, Validators.required],
      originalPrice: [this.subscription ? this.subscription.originalPrice : null, Validators.required],
      // discounted: [this.subscription ? this.subscription.discounted : null],
      // coupons: [this.subscription ? this.subscription.coupons : null],
      validFrom: [this.subscription ? this.subscription.validFrom : ''],
      validTo: [this.subscription ? this.subscription.validTo : ''],
      flags: this.formBuilder.group({
        active: this.subscription ? this.subscription.flags.active : true,
      }),
    });

  }
  // compareFn(c1: any, c2: any): boolean {
  //   return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  // }

  getmonths(type) {
    console.log('this.mode,', this.mode);

    if (type == "MONTHS") {
      this.months = this.helper.generateMonths();
    } else {
      this.months = this.helper.generateDays();
    }

  }

  getCourses(course) {
    this.qbankRepo.getQBankTestsByCourseId(course._id).subscribe(data => {
      this.qbanks = data.response;
      // if (this.mode === 'edit') {
      //   this.qbanks.map(e => {
      //     this.form.value.qbanks.map((res, i) => {
      //       console.log('e._id === res._id',e._id === res._id);
      //       if (e._id === res._id) {
      //         this.isDisabled = true
      //       }
      //     })
      //   })
      // }
    })
    this.videosRepo.getVideosByCourseId(course._id).subscribe(data => {
      this.videos = data.response
    })
    this.testCategoriesRepo.getTestsByCourseId(course._id).subscribe(data => {
      this.tests = data.response
    })

  }

  // discountAmount(coupon){
  //   console.log(coupon);

  //   let amount = this.form.value.actual;
  //   console.log('amount',amount);
  //    let discountedAmount = amount * coupon.discount /100;
  //   console.log('discountedAmount',discountedAmount);
  //   console.log('netAmount',amount-discountedAmount);

  //   // this.form.controls('discounted').se
  //   this.form.get('discounted').patchValue(discountedAmount);
  // }




  toggleSelection(type: string, selection: string) {
    switch (type) {
      case 'courses': {
        if (selection === 'all') {
          this.form.get('courses').patchValue(
            [...this.courses.map(item => item)]
          );
        } else {
          this.form.get('courses').patchValue([]);
          this.videos = [];
          this.tests = [];
          this.qbanks = [];
          this.form.get('videos').patchValue([]);
          this.form.get('tests').patchValue([]);
          this.form.get('qbanks').patchValue([]);
        }
        break;
      }
      case 'videos': {
        if (selection === 'all') {
          this.form.get('videos').patchValue(
            [...this.videos.map(item => item)]
          );
        } else {
          this.form.get('videos').patchValue([]);
        }
        break;
      }

      case 'tests': {
        if (selection === 'all') {
          this.form.get('tests').patchValue(
            [...this.tests.map(item => item)]
          );
        } else {

          this.form.get('tests').patchValue([]);
        }
        break;
      }
      case 'qbanks': {
        if (selection === 'all') {
          this.form.get('qbanks').patchValue(
            [...this.qbanks.map(item => item)]
          );
        } else {
          this.form.get('qbanks').patchValue([]);
        }
        break;
      }

    }

  }

  onSubmit() {
    const form = this.form.value;

    // if (form.videos?.length > 1) {
    //   form.videos?.pop();
    // }
    // if (form.tests?.length > 1) {
    //   form.tests?.pop();
    // }
    // if (form.tests?.length > 1) {
    //   form.qbanks?.pop();
    // }

    if (this.mode === 'add') {
      const subscription: SubscriptionInterface = {
        uuid: uuid.v4(),
        title: form.title,
        description: form.description,
        order: Number(form.order),
        periodType: form.periodType,
        period: Number(form.period.value),
        actual: Number(form.actual),
        originalPrice: Number(form.originalPrice),
        // discounted: Number(form.discounted),
        courses: this.form.value.courses._id,
        videos: form.videos ? form.videos?.map(it => it._id) : [],
        tests: form.tests ? form.tests?.map(it => it._id) : [],
        qbanks: form.qbanks ? form.qbanks?.map(it => it._id) : [],
        // coupons: form.coupons ? form.coupons._id : null,
        validFrom: form.validFrom,
        validTo: form.validTo,
        count: 0,
        flags: {
          active: form.flags.active,
        },
        createdOn: new Date().toISOString().toString(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };
      console.log(subscription);
      this.commit.emit(subscription);
    } else {
      let qbankArray = this.subscription.qbanks.map(res => res._id)
      let videosArray = this.subscription.videos.map(res => res._id)
      let testArray = this.subscription.tests.map(res => res._id)
      let QBANK = form.qbanks.filter(arr1Item => !qbankArray.includes(arr1Item._id));
      let VIDEOS = form.videos.filter(arr1Item => !videosArray.includes(arr1Item._id));
      let TESTS = form.tests.filter(arr1Item => !testArray.includes(arr1Item._id));

      const subscription = {
        uuid: this.subscription.uuid,
        title: form.title,
        description: form.description,
        order: Number(form.order),
        periodType: form.periodType,
        period: form.period.value ? Number(form.period.value) : form.period[0].value,
        actual: Number(form.actual),
        originalPrice: Number(form.originalPrice),
        // discounted: Number(form.discounted),
        courses: this.form.value.courses._id,
        videos: form.videos ? form.videos?.map(it => it._id) : [],
        tests: form.tests ? form.tests?.map(it => it._id) : [],
        qbanks: form.qbanks ? form.qbanks.map(it => it._id) : [],

        newVideos: VIDEOS ? VIDEOS?.map(it => it._id) : [],
        newTests: TESTS ? TESTS?.map(it => it._id) : [],
        newQbanks: QBANK ? QBANK.map(it => it._id) : [],
        // coupons: form.coupons ? form.coupons._id : null,
        validFrom: form.validFrom,
        validTo: form.validTo,
        count: this.subscription.count,
        flags: {
          active: form.flags.active,
        },
        createdOn: this.subscription.createdOn,
        createdBy: this.subscription.createdBy,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },

      };
      console.log('subscription', subscription);
      this.commit.emit(subscription);
    }
  }

  onReset() {
    this.form.reset();

  }



  // getData() {
  //   console.log('this.form.value.courses',this.form.value.courses);


  //   if(this.form.value.courses.length > 1) {
  //     this.form.value.courses?.pop();
  //   }
  //   if(this.form.value.videos?.length > 1) {
  //     this.form.value.videos?.pop();
  //   }
  //   if(this.form.value.qbanks?.length > 1) {
  //     this.form.value.qbanks?.pop();
  //   }
  //   if(this.form.value.tests?.length > 1) {
  //     this.form.value.tests?.pop();
  //   }

  //   const videoCourses = this.form.value.courses?.map(cou => {
  //     if(cou?.flags?.videos){
  //       return { id: cou._id, uuid: cou.uuid, title: cou.title }
  //     }
  //   });
  //   const testCourses = this.form.value.courses?.map(cou => {
  //     if(cou?.flags?.testSeries){
  //       return { id: cou._id, uuid: cou.uuid, title: cou.title }
  //     }
  //   });
  //   const qBankCourses = this.form.value.courses?.map(cou => {
  //     if(cou?.flags?.qBank){
  //       return { id: cou._id, uuid: cou.uuid, title: cou.title }
  //     }
  //   });
  //   console.log('qBankCourses',qBankCourses);


  //   return this.selectedCourses.emit({ videos: videoCourses, testSeries: testCourses, qbanks: qBankCourses });

  // }


  // toggleSelection(type: string, selection: string) {
  //   let _value = []
  //   let response
  //   this.courses.map(res => {
  //     _value.push(res)
  //   })
  //   response = { _value }
  //   switch (type) {
  //     case 'courses': {
  //       if (selection === 'all') {
  //         this.getCourses(response)
  //         this.form.get('courses').patchValue(
  //           [...this.courses.map(item => item)]
  //         );
  //       } else {
  //         this.form.get('courses').patchValue([]);
  //         this.videos = [];
  //         this.tests = [];
  //         this.qbanks = [];
  //         this.form.get('videos').patchValue([]);
  //         this.form.get('tests').patchValue([]);
  //         this.form.get('qbanks').patchValue([]);
  //       }
  //       break;
  //     }

  //     case 'videos': {

  //       if (selection === 'all') {
  //         this.videos.map(res => {
  //           let data = { _selected: true }
  //           this.getVideoSubject(res, data)
  //         })
  //         this.form.get('videos').patchValue(
  //           [...this.videos.map(item => item)]
  //         );

  //       } else {
  //         this.videos.map(res => {
  //           let data = { _selected: false }
  //           this.getVideoSubject(res, data)
  //         })
  //         this.form.get('videos').patchValue([]);
  //       }

  //       break;

  //     }

  //     case 'tests': {

  //       if (selection === 'all') {
  //         this.tests.map(res => {
  //           let data = { _selected: true }
  //           this.getTestCategory(res, data)
  //         })

  //         this.form.get('tests').patchValue(
  //           [...this.tests.map(item => item)]
  //         );
  //       } else {
  //         this.tests.map(res => {
  //           let data = { _selected: false }
  //           this.getTestCategory(res, data)
  //         })

  //         this.form.get('tests').patchValue([]);
  //       }

  //       break;

  //     }

  //     case 'qbanks': {

  //       if (selection === 'all') {
  //         this.qbanks.map(res => {
  //           let data = { _selected: true }
  //           this.getQbankSubject(res, data)
  //         })
  //         this.form.get('qbanks').patchValue(
  //           [...this.qbanks.map(item => item)]
  //         );
  //       } else {
  //         this.qbanks.map(res => {
  //           let data = { _selected: false }
  //           this.getQbankSubject(res, data)
  //         })
  //         this.form.get('qbanks').patchValue([]);
  //       }

  //       break;

  //     }

  //   }

  // }


  // getQbankSubject(subject, event) {
  //   console.log(event._selected);
  //   this.form.value.courses.map((res, i) => {
  //     if (subject.course_id === res._id) {
  //       if (event._selected == true) {
  //         res.qbanks.push(subject._id)
  //       }
  //       else {
  //         res.qbanks = res.qbanks.filter(val => {
  //           return val != subject._id
  //         })
  //       }
  //     }
  //   })
  //   console.log('this.form.value.courses', this.form.value.courses);
  // }
  // getVideoSubject(subject, event) {
  //   console.log(event._selected);
  //   this.form.value.courses.map((res, i) => {
  //     if (subject.course_id === res._id) {
  //       if (event._selected == true) {
  //         res.videos.push(subject._id)
  //       }
  //       else {
  //         res.videos = res.videos.filter(val => {
  //           return val != subject._id
  //         })
  //       }
  //     }
  //   })
  //   console.log('video this.form.value.courses', this.form.value.courses);
  // }
  // getTestCategory(category, event) {
  //   console.log(event._selected);
  //   this.form.value.courses.map((res, i) => {
  //     if (category.course_id === res._id) {
  //       if (event._selected == true) {
  //         res.tests.push(category._id)
  //       }
  //       else {
  //         res.tests = res.tests.filter(val => {
  //           return val != category._id
  //         })
  //       }
  //     }
  //   })
  //   console.log('this.form.value.courses', this.form.value.courses);
  // }




}
