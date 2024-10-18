import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeInterface, ResponseInterface, RoleInterface } from '@application/api-interfaces';
import { EmployeeRepositoryService, RolesService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap ,take} from 'rxjs/operators';

@Component({
  selector: 'application-add-employee-container',
  templateUrl: './add-employee-container.component.html',
  styleUrls: ['./add-employee-container.component.less']
})
export class AddEmployeeContainerComponent implements OnInit {
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  roles:RoleInterface[];
  employee$: Observable<ResponseInterface<EmployeeInterface>>;
  profile:string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeRepo: EmployeeRepositoryService,
    private roleRepo: RolesService,
    private _location:Location

  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.profile = sessionStorage.getItem('profile')
      this.employee$ = this.getEmployeeByUuid();
    }
    this.loadRoles();
  }

  loadRoles(){
    this.roleRepo.getAllActiveRoles().subscribe(data=>{
       this.roles =data.response
    })
  }

  getEmployeeByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.employeeRepo.getEditEmployeeByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: EmployeeInterface) {

    if (this.mode === 'add') {
      this.employeeRepo
        .addEmployee(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/employee/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.employeeRepo
        .editEmployee(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log({ result });
            if(sessionStorage.getItem('profile')){
              localStorage.setItem('currentUserName', event.name);
              localStorage.setItem('currentEmpImg', event.imgUrl);
            }
            this._location.back();
            sessionStorage.removeItem('profile')
            
            // this.router.navigateByUrl('/manage/employee/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
  }

}
