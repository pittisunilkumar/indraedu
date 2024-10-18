import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GenderEnum,
  OrganizationInterface,
  ResponseInterface,
  UserInterface,
  UserTypeEnum,
} from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.less'],
})
export class CreateUserComponent implements OnInit, OnChanges {

  @Input() data: { user: ResponseInterface<UserInterface>; org: OrganizationInterface };
  @Input() mode: string;

  public user: UserInterface;

  @Output() commit = new EventEmitter<UserInterface>();

  createUserForm: FormGroup;
  enumData: any;

  constructor(
    private formBuilder: FormBuilder,
    private helper: HelperService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildDataFromEnum();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.data?.currentValue) {
      this.data = changes?.data?.currentValue;
      this.user = changes?.data?.currentValue?.user?.response;
    }

    this.buildForm();

  }

  buildDataFromEnum() {
    this.enumData = {
      types: this.helper.enumtoArray(UserTypeEnum),
      genders: this.helper.enumtoArray(GenderEnum),
    };
  }

  buildForm() {

    const user = this.user;

    console.log({ user });


    this.createUserForm = this.formBuilder.group({
      mobile: [user?.mobile ? user.mobile : null,Validators.required],
      email: [user?.email ? user.email : ''],
      name: [user?.name ? user.name : ''],
      dob: [user?.dob ? user.dob : new Date()],
      type: [user?.type ? user.type : 'STUDENT'],
      // courses: [user?.courses ? user.courses[0] : []],
      organizations: [user?.organizations ? user.organizations : []],
      subscriptions: [user?.subscriptions ? user.subscriptions : []],
      qbanks: [user?.qbanks ? user.qbanks : []],
      videos: [user?.videos ? user.videos : []],
      tests: [user?.tests ? user.tests : []],
      college: user?.college ? user.college : '',
      address: this.formBuilder.group({
        addressLine1: user?.address?.addressLine1 ? user.address.addressLine1 : '',
        addressLine2: user?.address?.addressLine2 ? user.address.addressLine2 : '',
        state: user?.address?.state ? user.address.state : '',
        town: user?.address?.town ? user?.address?.town : '',
        pincode: user?.address?.pincode ? user.address.pincode : null,
      }),
      flags: this.formBuilder.group({
        isActive: user?.flags ? user.flags.isActive : true,
      }),
      imgUrl: this.formBuilder.group({
        imgUrl: this.user ? this.user?.imgUrl : '',
        upload: true,
      }),
      gender: [user?.gender ? user.gender : 'MALE'],
      password: [''],
    });
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    console.log(data);

    this.createUserForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  onReset() {
    this.createUserForm.reset();
  }

  onSubmit() {

    const value: UserInterface = this.createUserForm.value;
    console.log('value', value);

    let user: UserInterface;
    let course = []

    if (this.mode === 'add') {

      // const password
      //   = value.mobile?.toString().substr(5, 9) + value.email.split('@')[0];
      const password
      = value.name +'@'+ value.mobile?.toString().substr(0, 4) ;
      console.log('password', password);

      user = {
        uuid: uuid.v4(),
        mobile: Number(value.mobile),
        email: value.email,
        name: value.name,
        type: value.type,
        dob: value.dob,
        courses: course[0],
        college: value.college,
        organizations: value.organizations,
        subscriptions: value.subscriptions,
        qbanks: value.qbanks,
        videos: value.videos,
        tests: value.tests,
        address: value.address,
        flags: value.flags,
        imgUrl: value.imgUrl.imgUrl,
        createdOn: new Date(),
        modifiedOn: null,
        gender: value.gender,
        password: password,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      console.log('user', user);


    } else {

      user = {
        uuid: this.user.uuid,
        mobile: Number(value.mobile),
        email: value.email,
        name: value.name,
        type: value.type,
        dob: value.dob,
        courses: value.courses,
        college: value.college,
        organizations: value.organizations,
        subscriptions: this.user.subscriptions,
        qbanks: this.user.qbanks,
        videos: this.user.videos,
        tests: this.user.tests,
        address: value.address,
        flags: value.flags,
        imgUrl: value.imgUrl.imgUrl,
        createdOn: this.user.createdOn,
        modifiedOn: new Date(),
        gender: value.gender,
        createdBy: this.user.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

    }

   this.commit.emit(user);

  }

  onReview() { }

  cancel() {
    this.router.navigateByUrl('/manage/users/list');
  }
}
