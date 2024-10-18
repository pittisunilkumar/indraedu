import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { RoleInterface, RoleModulesEnum, RoleValueInterface } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.less']
})
export class CreateRoleComponent implements OnInit {
  @Input() role?: RoleInterface;
  @Input() roleValues?: RoleValueInterface[];
  @Input() mode: string;
  @Output() commit = new EventEmitter<RoleInterface>();
  // modules:any
  list: any;
  roleList: any;
  itemsPerPage: number = 5;
  p: number = 1;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  color: string
  // color = '#ABEBC6'
  allSelected = [];
  allIndeterminate = [];
  allChildSelected = []
  allComplete: boolean = false;
  Indeterminate = false;
  selectedList: any = [];
  values: any = {};
  checkedColor: any;
  createRoleForm: FormGroup;
  indexNumber = 0
  array = []
  // createRoleForm =new FormGroup({
  //   title:new FormControl(''),
  //   flags:new FormControl('')
  // })
  checkedList: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private roleService: RolesService,

  ) { }



  ngOnChanges(changes: SimpleChanges) {
    this.list = this.roleValues;
    // console.log('this.roleValues',this.roleValues);
    if (this.mode === 'edit' && changes?.role?.currentValue) {
      this.role = changes?.role?.currentValue;
      this.role.rolePermissions.map(res => {
        let selectedroleValues = {
          uuid: res.module[0].uuid,
          module: res.module[0]._id,
          subModules: res.subModules.map(res => res._id)
        }
        this.selectedList?.push(selectedroleValues);
      })
      // console.log('this.selectedListthis.selectedList',this.selectedList);
      this.roleChecked();
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    // this.modules = this.helper.enumtoArray(RoleModulesEnum)
    // console.log('modulesmodules',this.modules);
  }

  roleChecked() {
    this.roleService.getAllActiveRolesValues().subscribe(data => {
      this.roleList = data.response;
      // console.log('selectedList.rolePermissions', this.selectedList);
      this.roleList.map((res, index) => {
        this.selectedList.map(e => {
          if (res._id == e.module) {
            if (res.subModules.length == e.subModules.length) {
              this.allSelected[index] = true;
              this.allIndeterminate[index] = false;
            }
            else if (res.subModules.length != e.subModules.length) {
              this.allIndeterminate[index] = true;
              this.allSelected[index] = true;
            }
            else if (e.subModules.length == 0) {
              this.allIndeterminate[index] = false;
              this.allSelected[index] = false;
            }
            res.subModules.map((mod, i) => {
              e.subModules.map(eSub => {
                if (mod._id === eSub) {
                  this.checkedList[e.module] = this.checkedList[e.module] ? this.checkedList[e.module] : [];
                  this.checkedList[e.module].push(eSub);
                }
              })
            })
            this.checkBoxChecked();
          }
        })
      })
      console.log('this.checkedList', this.checkedList);
    })
  }

  buildForm() {
    this.createRoleForm = this.formBuilder.group({
      title: [this.role ? this.role?.title : '', Validators.required],
      flags: this.formBuilder.group({
        active: this.role ? this.role?.flags.active : true,
      }),
    });
  }

  filterList(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.roleValues = this.list.filter((role) => {
        return (
          role.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.roleValues = this.list;
    }
  }


  toggleRoleValues(completed: boolean, i, val) {
    const Quuid = val.uuid;
    let index: number;
    if (completed == true) {
      this.checkedColor = 'red';
      this.allSelected[i] = true
      this.checkedList[val._id] = val.subModules.map(res => res._id)
      this.allChildSelected[i] = true;
      let selectedroleValues = {
        uuid: val.uuid,
        module: val._id,
        subModules: val.subModules.map(res => res._id)
      }
      const arr = this.selectedList?.filter(it => it.uuid === selectedroleValues.uuid);
      if (!arr?.length) {
        this.selectedList?.push(selectedroleValues);
      }
    }
    else {
      this.selectedList?.filter((it, ind) => {
        if (it.uuid === Quuid) {
          index = ind;
        }
      });
      this.selectedList?.splice(index, 1);
      this.checkedList[val._id] = []
      this.allChildSelected[i] = false
    }
    console.log('toggle selectedList', this.selectedList);
    this.checkBoxChecked();
  }

  toggleEditRolePermissions(completed, i, j, val, data) {
    this.checkedList[data._id] = this.checkedList[data._id] ? this.checkedList[data._id] : [];
    let index: number;
    if (completed == true) {
      this.Indeterminate = true;
      // this.allSelected[i] = true
      this.checkedList[data._id].push(val._id);
      let selectedroleValues = {
        uuid: data.uuid,
        module: data._id,
        subModules: this.checkedList[data._id]
      }
      this.selectedList = this.selectedList.filter(it => {
        return it.uuid != data.uuid
      });
      this.selectedList?.push(selectedroleValues);
    }
    else {
      this.checkedList[data._id].filter((e, ind) => {
        console.log(e, val._id);
        if (e === val._id) {
          index = ind;
          this.checkedList[data._id].splice(index, 1);
        }
      })
      this.selectedList = this.selectedList?.filter((it, ind) => {
        if (it.uuid == data.uuid) {
          it.subModules.filter((res, i) => {
            if (res === val._id) {
              index = i;
            }
          });
          it.subModules?.splice(index, 1);
        }
        return it.subModules.length > 0
      });
    }
    this.selectedList.map(res => {
      console.log('this.checkedList[data._id].length', this.checkedList[data._id].length);
      if (data.subModules.length == this.checkedList[data._id].length) {
        this.allSelected[i] = true;
        this.allIndeterminate[i] = false;
      }
      else if (data.subModules.length != this.checkedList[data._id].length) {
        this.allSelected[i] = false;
        this.allIndeterminate[i] = true;
      }
      else if (this.checkedList[data._id].length == 0) {
        this.allSelected[0] = false;
        this.allIndeterminate[0] = false;
      }
    })
    console.log('toggle child selectedList', this.selectedList);
  }


  toggleRolePermissions(completed, i, j, val, data) {
    this.values[data.uuid] = this.values[data.uuid] ? this.values[data.uuid] : [];
    // this.checkedList[data._id] = this.values[data.uuid]
    let index: number;
    if (completed == true) {
      this.Indeterminate = true;
      this.values[data.uuid].push(val._id);
      let selectedroleValues = {
        uuid: data.uuid,
        module: data._id,
        subModules: this.values[data.uuid]
      }
      // console.log('selectedroleValuesselectedroleValues',selectedroleValues);

      this.selectedList = this.selectedList.filter(it => {
        return it.uuid != data.uuid
      });
      this.selectedList?.push(selectedroleValues);
    }
    else {
      this.selectedList = this.selectedList?.filter((it, ind) => {
        if (it.uuid == data.uuid) {
          it.subModules.filter((res, i) => {
            if (res === val._id) {
              index = i;
            }
          });
          it.subModules?.splice(index, 1);
        }
        // it.subModules = it.subModules.filter(res => {
        //   return res != val.title
        // })
        return it.subModules.length > 0
      });

    }

    this.selectedList.map(res => {
      if (data.subModules.length == res.subModules.length) {
        this.allSelected[i] = true;
        this.allIndeterminate[i] = false;
      }
      else if (data.subModules.length != res.subModules.length) {
        this.allSelected[i] = false;
        this.allIndeterminate[i] = true;
      }
      else if (res.subModules.length == 0) {
        this.allSelected[i] = false;
        this.allIndeterminate[i] = false;
      }
    })


    console.log('toggle child selectedList', this.selectedList);
  }


  setAll(completed: boolean) {

    if (completed == true) {
      this.list.map((res, i) => {
        this.checkedList[res._id] = this.checkedList[res._id] ? this.checkedList[res._id] : [];
        this.checkedList[res._id] = res.subModules.map(res => res._id)
        this.allSelected[i] = true;
        this.allChildSelected[i] = true;
        this.allIndeterminate[i] = false;
        let selectedroleValues = {
          uuid: res.uuid,
          module: res._id,
          subModules: res.subModules.map(res => res._id)
        }
        const arr = this.selectedList?.filter(it => it.uuid === selectedroleValues.uuid);
        if (!arr?.length) {
          this.selectedList?.push(selectedroleValues);
        }
      })
    }
    else {
      this.list.map((res, i) => {
        this.allSelected[i] = false
        this.allChildSelected[i] = false
        this.allIndeterminate[i] = false;
        this.checkedList[res._id] = []
      })
      this.selectedList = []
    }
    console.log('selectedList', this.selectedList);
    this.checkBoxChecked();
  }

  checkBoxChecked() {
    if (this.roleValues.length == this.selectedList.length) {
      this.Indeterminate = false;
      this.allComplete = true;
    }
    else {
      if (this.selectedList.length == 0) {
        this.Indeterminate = false;
        this.allComplete = false;
      }
      else if (this.selectedList.length > 0) {
        this.Indeterminate = true;
      }
    }
  }

  submit() {
    let value = this.createRoleForm.value
    if (this.mode === 'add') {
      const payload: RoleInterface = {
        uuid: uuid.v4(),
        title: value.title.split(' ').join('_').toUpperCase(),
        rolePermissions: this.selectedList,
        flags: value.flags,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload', payload);
      this.commit.emit(payload);
    }
    else {
      const payload: RoleInterface = {
        uuid: this.role.uuid,
        title: value.title.split(' ').join('_').toUpperCase(),
        rolePermissions: this.selectedList,
        flags: value.flags,
        createdOn: this.role.createdOn,
        modifiedOn: new Date(),
        createdBy: this.role.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload', payload);

      this.commit.emit(payload);
    }
  }


}

