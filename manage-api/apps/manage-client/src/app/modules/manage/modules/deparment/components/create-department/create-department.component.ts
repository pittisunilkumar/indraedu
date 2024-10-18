import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentsService, EmployeeRepositoryService, HelperService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.less']
})
export class CreateDepartmentComponent implements OnInit {

  mode = this.route.snapshot.data['mode'];

  department?: any;
  // mode: string;
  createDepartmentForm: FormGroup;
  testCategory: any;
  testList: any;
  categoryList: any;
  employeeList: any;
  course:any;

  insertDepartmentArray = [];
  deleteDepartmentArray = [];


  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private route: ActivatedRoute,
    private departmentsService: DepartmentsService,
    private router: Router,
    private employeeService: EmployeeRepositoryService,
  ) { }
  async ngOnInit(): Promise<void> {
    this.createDepartmentForm = this.buildForm();
    if (this.mode === 'edit') {
      let departmentsUuid = this.route.snapshot.paramMap.get('uuid');
      let department: any
      department = await this.departmentsService.getDepartmentByUuid(departmentsUuid).toPromise();
      this.department = department.response;
      this.insertDepartmentArray = this.department?.hod.map(hres=>hres?._id)

      // this.department.test = department.response.test[0].tests
      this.createDepartmentForm = this.buildForm();
    }
    this.getEmployees();


  }
  buildForm() {
    return this.formBuilder.group({
      title: [this.department ? this.department?.title : '', Validators.required],
      employee: [this.department ? this.department?.employee : '', Validators.required],
      hod: [this.department ? this.department?.hod : '', Validators.required],
      flags: this.formBuilder.group({
        active: this.department ? this.department?.flags.active : true,
      }),
    });

  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (res) => {
        this.employeeList = res?.response;
      }
    );
  }

  insertAndDeleteArray(event, empId) {
    if (event == true) {
      this.insertDepartmentArray = this.insertDepartmentArray.filter(res=>{
        return res != empId
      })
      this.deleteDepartmentArray = this.deleteDepartmentArray.filter(res=>{
        return res != empId
      })
      this.insertDepartmentArray.push(empId);
    }
    else if (event == false) {
      this.deleteDepartmentArray = this.deleteDepartmentArray.filter(res=>{
        return res != empId
      })
      this.insertDepartmentArray = this.insertDepartmentArray.filter(res=>{
        return res != empId
      })
      this.deleteDepartmentArray.push(empId);
    }
    console.log('deleteDepartmentArray', this.deleteDepartmentArray);
    console.log('insertDepartmentArray', this.insertDepartmentArray);
    // console.log('this.question',this.question.perals.map(res=>res._id));
  }


  submit() {
    const value = this.createDepartmentForm.value;

    if (this.mode === 'add') {
      const payload: any = {
        uuid: uuid.v4(),
        title: value.title,
        employee: value.employee.map(res=>res._id),
        hod: value.hod.map(res=>res._id),
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload);
      this.departmentsService.addDepartment(payload).subscribe(res => {
        if (res) {
          this.router.navigate(['/manage/department/list'])
        }
      })
    } else {
      this.insertDepartmentArray.map(e=>{
        this.department.hod.map(res=>{
          if( res._id == e){
            this.insertDepartmentArray =  this.insertDepartmentArray.filter(d=>{
              return res._id != d
            })
          }
        })
      })
      this.deleteDepartmentArray.map(e=>{
        this.department.hod.map(res=>{
          if( res._id != e){
            this.deleteDepartmentArray =  this.deleteDepartmentArray.filter(d=>{
              return res._id != e
            })
          }
        })
      })
      const payload: any = {
        _id:this.department?._id,
        uuid: this.department?.uuid,
        title: value.title,
        employee: value.employee,
        hod: value.hod,
        insertDepartmentArray:this.insertDepartmentArray,
        deleteDepartmentArray:this.deleteDepartmentArray,
        createdBy: this.department?.createdBy,
        createdOn: this.department?.createdOn,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };
      console.log(payload)
      this.departmentsService.editDepartmentByUuid(payload).subscribe(res => {
        if (res) {
          this.router.navigate(['/manage/department/list'])
        }
      })

    }
  }
  resetForm() {
    this.createDepartmentForm.reset();
  }

}
