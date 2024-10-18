import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationInterface } from '@application/api-interfaces';
import { AWSS3Service, HelperService ,OrganizationRepositoryService} from '@application/ui';
import * as uuid from 'uuid';
@Component({
  selector: 'application-create-org',
  templateUrl: './create-org.component.html',
  styleUrls: ['./create-org.component.less'],
})
export class CreateOrgComponent implements OnInit {

  @Output() commit = new EventEmitter<OrganizationInterface>();

  createOrgForm: FormGroup;
  mode = this.route.snapshot.data['mode'];
  organization?: OrganizationInterface;

  constructor(
    private formBuilder: FormBuilder,
     private aws: AWSS3Service,
     public helper: HelperService,
     private route: ActivatedRoute,
     private router: Router,
     private organizationService:OrganizationRepositoryService
     ) {}

  async ngOnInit(): Promise<void> {
    this.createOrgForm = this.buildForm();
    if(this.mode == 'edit'){
      let uuid = this.route.snapshot.paramMap.get('uuid');
      console.log(uuid);
      let org
      org = await this.organizationService.getOrganizationByUuid(uuid).toPromise()
        console.log(org);
        this.organization = org.response;
      // })
      this.createOrgForm = this.buildForm();
    }
  }

  buildForm() {
    return this.formBuilder.group({
      title: [this.organization ? this.organization?.title : '', Validators.required],
      mobile: [this.organization ? this.organization?.mobile : '', Validators.required],
      email: [this.organization ? this.organization?.email : '', Validators.required],
      firebase: [this.organization ? this.organization?.firebase : '', Validators.required],
      address: this.formBuilder.group({
        addressLine1: this.organization ? this.organization?.address?.addressLine1 : '',
        addressLine2: this.organization ? this.organization?.address?.addressLine2 : '',
        state: this.organization ? this.organization?.address?.state : '',
        town: this.organization ? this.organization?.address?.town : '',
        pincode: this.organization ? this.organization?.address?.pincode : '',
      }),
      flags: this.formBuilder.group({
        active: this.organization ? this.organization?.flags?.active : true,
        // onTrail: this.organization ? this.organization?.flags?.onTrail : true,
      }),
    });
    // this.createOrgForm = this.formBuilder.group({
    //   title: '',
    //   type: '',
    //   imgUrl: '',
    //   phone: null,
    //   mobile: null,
    //   email: '',
    //   entitlements: this.formBuilder.group({
    //     videoBank: false,
    //     questionBank: false,
    //     testBank: false,
    //     mcq: false,
    //     spartan: false,
    //     materials: false,
    //     flashCards: false,
    //   }),
    //   subscriptions: [],
    //   address: this.formBuilder.group({
    //     addressLine1: '',
    //     addressLine2: '',
    //     organization: '',
    //     town: '',
    //     pincode: null,
    //   }),
    //   flags: this.formBuilder.group({
    //     onTrail: false,
    //     trialPeriod: 14,
    //     isActive: true,
    //   }),
    // });
  }

  async upload(event) {
    await this.aws.uploadFile(event).then((result) => {
      this.createOrgForm.controls.imgUrl.patchValue(result[0]?.Location);
    });
  }

  onReset() {}
  onSubmit() {
    const value: OrganizationInterface = this.createOrgForm.value;
    console.log(value);

    if (this.mode === 'add') {
      const payload: OrganizationInterface = {
        uuid: uuid.v4(),
        title: value.title,
        mobile: value.mobile,
        email: value.email,
        firebase: value.firebase,
        address: value.address,
        flags: value.flags,
        createdOn: new Date(),
         createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: null,
      };
      console.log('payload',payload);
      this.organizationService.addOrganization(payload).subscribe(res=>{
        if(res){
          this.router.navigate(['/manage/organizations/list'])
        }
      })
      
    }else{
      const payload: OrganizationInterface = {
        uuid: this.organization.uuid,
        title: value.title,
        mobile: value.mobile,
        email: value.email,
        firebase: value.firebase,
        address: value.address,
        flags: value.flags,
        createdOn: new Date(),
         createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: null,
      };
      console.log('payload',payload);
      this.organizationService.updateOrganization(payload).subscribe(res=>{
        if(res){
          this.router.navigate(['/manage/organizations/list'])
        }
      })
    }


   
    // this.commit.emit(organization);
  }
  // onReview() {}
}
