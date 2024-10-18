import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerInterface, CourseInterface, SubscriptionInterface } from '@application/api-interfaces';
import { HelperService, SubscriptionsRepositoryService } from '@application/ui';
import { log } from 'console';
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-banners',
  templateUrl: './create-banners.component.html',
  styleUrls: ['./create-banners.component.less'],
})
export class CreateBannersComponent implements OnInit, OnChanges {

  @Input() courses?: CourseInterface[];
  @Input() banner?: BannerInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<BannerInterface>();
  createBannerForm: FormGroup;
  isSubscriptionsEnable: boolean;
  isYouTubeEnable: boolean;
  subscriptions: SubscriptionInterface;
  type: string;
  isChecked: boolean

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private subRepo: SubscriptionsRepositoryService,
  ) { }

  ngOnInit(): void {
    this.isYouTubeEnable = true
    this.createBannerForm = this.buildForm();
  }

  subscriptionsList(courses) {
    return this.subRepo.getSubscriptionByCourseId(courses._id).subscribe(
      (res) => {
        this.subscriptions = res.response;
        console.log(' this.subscriptions', this.subscriptions);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.mode === 'edit' && changes?.banner?.currentValue) {
      this.banner = changes?.banner?.currentValue;
      this.createBannerForm = this.buildForm();
      this.subRepo.getSubscriptionByCourseId(this.banner?.courses[0]._id).subscribe(
        (res) => {
          this.subscriptions = res.response;
          console.log( this.subscriptions );
        }
      );
    }

  }

  enableYotubeOrSub(event) {
    this.type = event.value
    if (event.value == 'youtubeUrl') {
      this.isYouTubeEnable = true;
      this.isSubscriptionsEnable = false;
    }
    else if (event.value == 'subscriptions') {
      this.isSubscriptionsEnable = true;
      this.isYouTubeEnable = false;
    }
  }

  buildForm() {
    console.log(this.banner);
    let subscriptions = this.banner?.subscriptions ? this.banner?.subscriptions[0] : null
    if (this.mode == 'edit') {
      if (this.banner?.youtubeLink) {
        this.isChecked = true
        this.isYouTubeEnable = true;
        this.isSubscriptionsEnable = false;
      }
      else {
        this.isChecked = false
        this.isSubscriptionsEnable = true;
        this.isYouTubeEnable = false;
      }
    }
    else {
      this.isChecked = true
    }
    return this.formBuilder.group({
      // title: [
      //   this.banner ? this.banner?.title : '',
      //   [Validators.required, Validators.maxLength(40)],
      // ],
      title: [ this.banner ? this.banner?.title : ''],
      image: this.formBuilder.group({
        imgUrl: [this.banner ? this.banner?.imgUrl : '',Validators.required],
        upload: true,
      }),
      link: [this.banner ? this.banner?.link : ''],
      youtubeLink: [this.banner ? this.banner?.youtubeLink : ''],
      order: [this.banner ? this.banner?.order : null, Validators.required],
      courses: [this.banner ? this.banner?.courses[0] : [], Validators.required],
      subscriptions: [this.banner ? subscriptions : []],
      flags: this.formBuilder.group({
        active: this.banner ? this.banner?.flags?.active : true,
        paid: false,
      }),
    });

  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    console.log(data);
    
    this.createBannerForm.controls['image'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
    console.log(this.createBannerForm.value);
  }

  resetForm() {
    this.createBannerForm.reset();
  }

  submit() {
    const value = this.createBannerForm.value;
    console.log('value,value',value);
    

    if (this.type == 'youtubeUrl') {
      value.subscriptions = null
      // value.subscriptions._id = "";
    }
    else if (this.type == 'subscriptions') {
      value.youtubeLink = "";
    }

    if (this.mode === 'add') {
      const payload: BannerInterface = {
        uuid: uuid.v4(),
        title: value.title,
        imgUrl: value.image.imgUrl,
        link: value.link,
        youtubeLink: value.youtubeLink,
        order:parseInt(value.order),
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
        courses: value.courses._id,
        subscriptions: value.subscriptions._id
      };
      console.log(payload)

      this.commit.emit(payload);

    } else {

      console.log(value.youtubeLink);
      

      const payload: BannerInterface = {
        uuid: this.banner?.uuid,
        title: value.title,
        imgUrl: value.image.imgUrl,
        link: value.link,
        youtubeLink: value.youtubeLink?value.youtubeLink:'',
        order: value.order,
        createdBy: this.banner?.createdBy,
        createdOn: this.banner?.createdOn,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
        courses: value.courses,
        subscriptions: value.subscriptions == null?null :value.subscriptions._id
      };
      console.log(payload)

      this.commit.emit(payload);

    }
  }
}
