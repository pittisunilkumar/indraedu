import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, DepartmentsService, HelperService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.less']
})
export class DepartmentListComponent implements OnInit {
  isAddVisible: boolean;
  isDeleteVisible: boolean;
  isEditVisible: boolean;
  departments: any;
  // @Output() delete = new EventEmitter<TagInterface>();

  search: string;
  // filteredDepartments:  MatTableDataSource<TagInterface>;
  filteredDepartments: any;

  totalLength = [10, 25, 50, 100];
  total: number;
  errors: string[];
  sub = new Subscription();
  // p: number = 1;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  displayedColumns: string[] = [
    'sno',
    'title',
    'hod',
    'status',
    'actions'
  ];
  today = new Date()

  constructor(
    private departmentsService: DepartmentsService,
    private dialog: MatDialog,
    private helper: HelperService,
    private router: Router
  ) {
    // this.today.setDate(this.today.getDate() - 1)
  }

  loadData() {
    this.departmentsService.getAllDepartments().subscribe(res => {
      this.departments = this.filteredDepartments = res?.response;
      this.filteredDepartments = new MatTableDataSource(this.filteredDepartments);
      this.filteredDepartments.paginator = this.paginator;
      this.filteredDepartments.sort = this.sort;
    })
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.loadData();
  }

  delete(data) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: data },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sub.add(this.departmentsService.deleteEventByUuid(data._id).subscribe(
          (res) => {
            this.loadData();
          },
          (err) => {
            this.errors = err.error.error;
          }
        ));
      }
    })
  }


  filterDepartments(department: Event) {
    const filterValue = (department.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.filteredDepartments = this.departments.filter((tag) => {
        return tag.title.toLowerCase().includes(filterValue)
      });
    } else {
      this.filteredDepartments = this.departments;
    }
    this.filteredDepartments = new MatTableDataSource(this.filteredDepartments);
    this.filteredDepartments.paginator = this.paginator;
    this.filteredDepartments.sort = this.sort;
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.DEPARTMENT)
          res.subModules.map(e => {
            if (e.title == subM.type.ADD) {
              this.isAddVisible = true;
            }
            else if (e.title == subM.type.DELETE) {
              this.isDeleteVisible = true;
            }
            else if (e.title == subM.type.EDIT) {
              this.isEditVisible = true;
            }
          })
      })
      // })
    }
  }


  

  // addStudentsToEvents(department) {
  //   this.router.navigate([`manage/departments/${department.uuid}/add/students`], {
  //     queryParams: { eventTitle: department.title, event_id: department._id, course_id: department.course._id }
  //   })
  // }
  // editStudentsToEvents(department) {
  //   this.router.navigate([`manage/departments/${department.uuid}/edit/students`], {
  //     queryParams: { eventTitle: department.title, event_id: department._id, course_id: department.course._id }
  //   })
  // }



}
