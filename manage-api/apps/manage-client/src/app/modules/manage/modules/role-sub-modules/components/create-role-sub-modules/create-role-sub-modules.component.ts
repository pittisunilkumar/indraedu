import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleSubModuleInterface, RoleValueOptionsInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-role-sub-modules',
  templateUrl: './create-role-sub-modules.component.html',
  styleUrls: ['./create-role-sub-modules.component.less']
})
export class CreateRoleSubModulesComponent implements OnInit {
  @Input() roleSubModules?: RoleSubModuleInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<RoleSubModuleInterface>();
  createRoleSubModuleForm: FormGroup
  optionsCount = 1;
  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.roleSubModules?.currentValue) {
      this.roleSubModules = changes?.roleSubModules?.currentValue;
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    // if (this.mode === 'add') {
    //   this.addOptions(this.optionsCount);
    // }
  }

  buildForm() {
    console.log(this.roleSubModules);
    this.createRoleSubModuleForm = this.formBuilder.group({
      title: [this.roleSubModules ? this.roleSubModules?.title : '',Validators.required],
      flags: this.formBuilder.group({
        active: this.roleSubModules ? this.roleSubModules?.flags.active : true,
      }),
    });
  }
  // get values(): FormArray {
  //   return this.createRoleSubModuleForm?.get('title') as FormArray;
  // }
  // addNewOption() {
  //   ++this.optionsCount;
  //   return this.values?.push(this.newOption(this.optionsCount));
  // }
  // newOption(index: number, option?: RoleValueOptionsInterface): FormGroup {
  //   return this.formBuilder.group({
  //     name: option ? option.name : '',
  //     value: this.optionsCount,
  //   });
  // }
  // addOptions(count: number) {
  //   for (let i = 0; i < count; i++) {
  //     this.values?.push(this.newOption(i));
  //   }
  // }
  // removeOption(i) {
  //   return this.values.removeAt(i)
  // }
  submit() {
    let value = this.createRoleSubModuleForm.value
   
    if (this.mode === 'add') {
      const payload: RoleSubModuleInterface = {
        uuid: uuid.v4(),
        title:value.title.split(' ').join('_').toUpperCase(),
        flags: value.flags,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload',payload);
       this.commit.emit(payload);
    }
    else {
      const payload: RoleSubModuleInterface = {
        uuid: this.roleSubModules.uuid,
        title:value.title.split(' ').join('_').toUpperCase(),
        flags: value.flags,
        createdOn: this.roleSubModules.createdOn,
        modifiedOn: new Date(),
        createdBy: this.roleSubModules.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
       this.commit.emit(payload);
    }
  }

}
