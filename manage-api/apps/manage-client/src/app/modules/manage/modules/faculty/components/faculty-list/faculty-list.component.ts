import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacultyInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { HelperService, RolesService } from '@application/ui';

@Component({
  selector: 'application-faculty-list',
  templateUrl: './faculty-list.component.html',
  styleUrls: ['./faculty-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacultyListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'sno',
    'imgUrl',
    'name',
    'mobile',
    'specialization',
    'designation',
    'courses',
    'syllabus',
    'createdOn',
    'actions',
  ];
  dataSource: MatTableDataSource<FacultyInterface>;

  @Input() faculty: FacultyInterface[];
  @Output() delete = new EventEmitter<FacultyInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
    private roleService: RolesService,
  ) { }

  deleteEnabled:string;
  editEnabled:string
  agentCouponEnable:boolean;
  agentTransactions:boolean;
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
          if (res.module[0].title === modules.type.AGENTS)
            res.subModules.map(e => {
              if (e.title == subM.type.AGENT_TRANSACTIONS) {
               this.agentTransactions = true;
              }
              else if (e.title == subM.type.AGENT_COUPONS) {
                this.agentCouponEnable = true;
               }
            })
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.faculty?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.faculty?.currentValue);
      console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  edit(faculty: FacultyInterface) {
    this.router.navigateByUrl(`/faculty/${faculty.uuid}/edit`);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editFaculty(faculty) {
    this.router.navigate([`manage/faculty/${faculty.uuid}/edit`]);
  }
  viewCoupons(faculty){
    window.sessionStorage.setItem('facultyName',faculty.name);
    window.sessionStorage.setItem('agentId',faculty._id);
    this.router.navigate([`manage/faculty/${faculty.uuid}/agentCoupons/list`]);
  }
}
