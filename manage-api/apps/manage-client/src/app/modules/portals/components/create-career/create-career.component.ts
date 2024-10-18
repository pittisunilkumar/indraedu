import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CareerInterface, DepartmentENum } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-career',
  templateUrl: './create-career.component.html',
  styleUrls: ['./create-career.component.less']
})
export class CreateCareerComponent implements OnInit, OnChanges {

  @Input() career?: CareerInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<CareerInterface>();

  addJobForm: FormGroup;
  departments: { id: string; title: string; }[];
  enumData: any;

  constructor(
    private formBuilder: FormBuilder,
    private helper: HelperService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.career?.currentValue) {
      this.career = changes?.career?.currentValue;
      this.addJobForm = this.buildForm();
    }
  }

  ngOnInit(): void {

    this.buildDataFromEnum();
    this.addJobForm = this.buildForm();

  }

  buildDataFromEnum() {
    this.enumData = {
      departments: this.helper.enumtoArray(DepartmentENum),
    };
  }

  buildForm() {

    return this.formBuilder.group({
      title: [this.career ? this.career?.title : '', Validators.required],
      designation: [this.career ? this.career?.designation :'', Validators.required],
      department: [this.career ? this.career?.department : '', Validators.required],
      code: [this.career ? this.career?.code : '', Validators.required],
      description: [this.career ? this.career?.description : '', Validators.required],
      qualifications: [this.career ? this.career?.qualifications.join(',') : [], Validators.required],
      requirements: [this.career ? this.career?.requirements : '', Validators.required],
      mustHave: [this.career ? this.career?.skills.mustHave.join(',') : '', Validators.required],
      goodToHave: this.career ? this.career?.skills.goodToHave?.join(',') : null,
      flags: this.formBuilder.group({
        active: this.career ? this.career?.flags?.active : true,
        editable: this.career ? this.career?.flags?.editable : true,
      }),
    });

  }

  bindDepartments() {

    return [
      { id: 'EDITING', title: 'Editing' },
      { id: 'DATAENTRY', title: 'Data Entry' },
      { id: 'TELECALLING', title: 'Tele Callers' },
      { id: 'DEVELOPERS', title: 'Developers' },
      { id: 'FINANCE', title: 'Finance' },
      { id: 'ACCOUNTS', title: 'Accounts' },
      { id: 'OPERATIONS', title: 'Operations' },
      { id: 'ADMINISTRATION', title: 'Administration' },
      { id: 'SALESMARKETING', title: 'Sales & Marketing' },
      { id: 'RECRUITMENT', title: 'Recruitment' },
      { id: 'HR', title: 'Human Resources' }
    ];

  }

  submit() {

    const value = this.addJobForm.value;

    if (this.mode === 'add') {

      const career: CareerInterface = {
        uuid: uuid.v4(),
        title: value.title,
        designation: value.designation,
        department: value.department,
        code: value.code,
        description: value.description,
        qualifications: value.qualifications.split(','),
        requirements: value.requirements,
        skills: {
          mustHave: value.mustHave.split(','),
          goodToHave: value.goodToHave?.split(','),
        },
        flags: value.flags,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      this.commit.emit(career);

    } else {

      const career: CareerInterface = {
        uuid: this.career?.uuid,
        title: value.title,
        designation: value.designation,
        department: value.department,
        code: value.code,
        description: value.description,
        qualifications: value.qualifications.split(','),
        requirements: value.requirements,
        skills: {
          mustHave: value.mustHave.split(','),
          goodToHave: value.goodToHave?.split(','),
        },
        flags: value.flags,
        createdOn: this.career?.createdOn,
        createdBy: this.career?.createdBy,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      this.commit.emit(career);

    }

  }

}
