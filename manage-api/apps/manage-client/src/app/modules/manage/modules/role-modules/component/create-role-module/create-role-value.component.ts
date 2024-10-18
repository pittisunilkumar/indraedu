import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleSubModuleInterface, RoleValueInterface } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
import * as uuid from 'uuid';

// export function toTitleCase(str) {
//   return str.replace(
//     /\w\S*/g,
//     function(txt) {
//       return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     }
//   );
// }

@Component({
  selector: 'application-create-role-value',
  templateUrl: './create-role-value.component.html',
  styleUrls: ['./create-role-value.component.less']
})
export class CreateRoleValueComponent implements OnInit {
  @Input() roleValues?: RoleValueInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<RoleValueInterface>();
  createRoleValuesForm: FormGroup
  optionsCount = 1;
  roleSubModules:RoleSubModuleInterface[]
  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private roleService: RolesService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.roleValues?.currentValue) {
      this.roleValues = changes?.roleValues?.currentValue;
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.roleService.getAllActiveRoleSubModule().subscribe(res=>{
     this.roleSubModules = res.response
    })
    // if (this.mode === 'add') {
    //   this.addOptions(this.optionsCount);
    // }
  }

  buildForm() {
    console.log('this.roleValues',this.roleValues);
    // let role_values = []
    // if(this.mode === 'edit'){
    //   this.roleValues?.values.map((res,i)=>{
    //   role_values.push({name:res})
    //   })
    // }
    this.createRoleValuesForm = this.formBuilder.group({
      title: [this.roleValues ? this.roleValues?.title : '',Validators.required],
      subModules: [this.roleValues ? this.roleValues?.subModules : [], Validators.required],
      // values: this.formBuilder.array(
      //   this.roleValues ?
      //   role_values.map((option, index) => this.newOption(index, option)) : []),
      flags: this.formBuilder.group({
        active: this.roleValues ? this.roleValues?.flags.active : true,
      }),
    });
  }

  compareFn(c1: RoleValueInterface, c2: RoleValueInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }
  // get values(): FormArray {
  //   return this.createRoleValuesForm?.get('values') as FormArray;
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
    let value = this.createRoleValuesForm.value
    // let role_values = []
    // this.createRoleValuesForm.value.values.map(res => {
    //   role_values.push(toTitleCase(res.name))
    // })
    if (this.mode === 'add') {
      const payload: RoleValueInterface = {
        uuid: uuid.v4(),
        title:value.title.split(' ').join('_').toUpperCase(),
        subModules: value.subModules.map(res=>res._id),
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
      const payload: RoleValueInterface = {
        uuid: this.roleValues.uuid,
        title:value.title.split(' ').join('_').toUpperCase(),
        subModules: value.subModules,
        flags: value.flags,
        createdOn: this.roleValues.createdOn,
        modifiedOn: new Date(),
        createdBy: this.roleValues.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
       this.commit.emit(payload);
    }
  }

}
