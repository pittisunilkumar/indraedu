import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeInterface, EmployeeTypeEnum, GenderEnum, OrganizationInterface, ResponseInterface, RoleInterface } from '@application/api-interfaces';
import { HelperService, OrganizationRepositoryService } from '@application/ui';
import * as uuid from 'uuid';


@Component({
  selector: 'application-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.less']
})
export class AddEmployeeComponent implements OnInit {
  @Input() data: { employee: ResponseInterface<EmployeeInterface>; org: OrganizationInterface };
  @Input() mode: string;
  @Input() roles: RoleInterface[];
  profile:string;
  organizationsList:any;



  public employee: EmployeeInterface;

  @Output() commit = new EventEmitter<EmployeeInterface>();

  createEmployeeForm: FormGroup;
  enumData: any;

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private router: Router,
    private _location:Location,
    private organizationService: OrganizationRepositoryService,

  ) { }

  ngOnInit(): void {
    this.profile = sessionStorage.getItem('profile')
    this.buildDataFromEnum();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.data?.currentValue) {
      this.data = changes?.data?.currentValue;
      this.employee = changes?.data?.currentValue?.employee?.response;
    }

    this.buildForm();
    this.getOrganizations();

  }
  getOrganizations(){
    this.organizationService.getActiveOrganizations().subscribe(res=>{
      this.organizationsList = res.response;
    })
  }

  buildDataFromEnum() {
    this.enumData = {
      types: this.helper.enumtoArray(EmployeeTypeEnum),
      genders: this.helper.enumtoArray(GenderEnum),
    };
  }

  buildForm() {

    const employee = this.employee;

    console.log( employee?.flags.isActive );
    this.createEmployeeForm = this.formBuilder.group({
      mobile: [employee?.mobile ? employee.mobile : null, [Validators.required, Validators.maxLength(14)]],
      email: [employee?.email ? employee.email : '', [Validators.required, Validators.email]],
      name: [employee?.name ? employee.name : '', [Validators.required, Validators.maxLength(10)]],
      dob: [employee?.dob ? employee.dob : new Date(), [Validators.required]],
      // type: [employee?.type ? employee.type : 'STUDENT', [Validators.required]],
      role: [employee?.role ? employee?.role : '', [Validators.required]],
      // organizations: [this.course ? this.course?.organizations : [], Validators.required],
      courses: [employee?.courses ? employee.courses : []],
      organizations: [employee?.organizations ? employee.organizations : [], Validators.required],
      college: employee?.college ? employee.college : '',
      address: this.formBuilder.group({
        addressLine1: employee?.address?.addressLine1 ? employee.address.addressLine1 : '',
        addressLine2: employee?.address?.addressLine2 ? employee.address.addressLine2 : '',
        state: employee?.address?.state ? employee.address.state : '',
        town: employee?.address?.town ? employee?.address?.town : '',
        pincode: employee?.address?.pincode ? employee.address.pincode : null,
      }),
      flags: this.formBuilder.group({
        isActive: employee?.flags ? employee.flags.isActive : true,
      }),
      imgUrl: this.formBuilder.group({
        imgUrl: this.employee ? this.employee?.imgUrl : '',
        upload: true,
      }),
      gender: [employee?.gender ? employee.gender : 'MALE', Validators.required],
      password: ['', Validators.required],
    });
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    console.log(data);

    this.createEmployeeForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  onReset() {
    this.createEmployeeForm.reset();
  }

  onSubmit() {

    const value: EmployeeInterface = this.createEmployeeForm.value;
    console.log('value', value);

    let employee: EmployeeInterface;

    if (this.mode === 'add') {

      // const password
      //   = value.mobile?.toString().substr(5, 9) + value.email.split('@')[0];
      const password
      = value.name +'@'+ value.mobile?.toString().substr(0, 4) ;
      console.log('password', password);

      employee = {
        uuid: uuid.v4(),
        mobile: Number(value.mobile),
        email: value.email,
        name: value.name,
        role: value.role._id,
        dob: value.dob,
        courses: value.courses,
        college: value.college,
        organizations: value.organizations.map(it => it._id),
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

      console.log('employee', employee);


    } else {

      employee = {
        uuid: this.employee.uuid,
        mobile: Number(value.mobile),
        email: value.email,
        name: value.name,
        role: value.role._id,
        dob: value.dob,
        courses: value.courses,
        college: value.college,
        organizations: value?.organizations ?  value.organizations.map(it => it._id) : [],
        address: value.address,
        flags: value.flags,
        imgUrl: value.imgUrl.imgUrl,
        createdOn: this.employee.createdOn,
        modifiedOn: new Date(),
        gender: value.gender,
        createdBy: this.employee.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

    }

   this.commit.emit(employee);

  }

  onReview() { }

  cancel() {
    this._location.back()
    // this.router.navigateByUrl('/manage/employee/list');
  }

}
