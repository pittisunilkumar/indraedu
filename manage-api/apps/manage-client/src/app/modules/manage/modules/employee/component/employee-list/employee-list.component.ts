import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmployeeInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.less']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'name',
    'type',
    'mobile',
    'email',
    'organization',
    'department',
    'createdOn',
    'active',
    'actions',
  ];
  isResetVisible:boolean;
  filteredList: any;
  list: any;
  dataSource: MatTableDataSource<EmployeeInterface>;
  @Input() employee: EmployeeInterface[];
  @Output() delete = new EventEmitter<EmployeeInterface>();
  @Output() resetPassword = new EventEmitter<EmployeeInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
    private roleService: RolesService,
  ) {}

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
    this.loadPermissions();
   }

   loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.EMPLOYEE)
            res.subModules.map(e => {
              if (e.title == subM.type.RESET_PASSWORD) {
                this.isResetVisible = true;
              }
            })
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.employee?.currentValue) {
      // const users = changes?.users?.currentValue
      //   .filter(user => user.mobile !== 9108391276)
      this.filteredList = this.list = changes?.employee?.currentValue
      this.dataSource = new MatTableDataSource(changes?.employee?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();  
    if (filterValue) {
      this.filteredList = this.list.filter((emp) => {
        return (
          emp?.name.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.mobile.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.role?.title.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.email.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          emp?.flags?.isActive.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) 
        )
      });
      this.dataSource = new MatTableDataSource(this.filteredList);

    } else {
      this.dataSource = new MatTableDataSource(this.list);
    }
    this.dataSource.paginator = this.paginator;

    // const filterValue = (event.target as HTMLInputElement).value;

    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }

  }

  edit(user: EmployeeInterface) {

    return this.router.navigateByUrl(`/manage/employee/${user.uuid}/edit`);

  }

  // goToSubscriptions(user) {
  //   window.sessionStorage.setItem('userName',user.name)
  //   window.sessionStorage.setItem('userId',user._id);
  //   window.sessionStorage.setItem('userUuid',user.uuid);
  //   return this.router.navigateByUrl(`/manage/users/${user.uuid}/packages`);

  // }

  userAccess() {

    const type = localStorage.getItem('currentUserType');
    return type === 'ADMIN' || type === 'SUPER';

  }

}
