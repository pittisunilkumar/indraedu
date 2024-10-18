import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationInterface, RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { CommandRemoveDialogComponent, HelperService, OrganizationRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';
import { OrgDetailsDialogComponent } from '../../dialogs';

@Component({
  selector: 'application-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.less'],
})
export class OrgListComponent implements OnInit {
  isAddVisible: boolean;
  isDeleteVisible: boolean;
  isEditVisible: boolean;
  organizations: any;

  search: string;
  filteredOrganizations: any;

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
    'mobile',
    'email',
    'status',
    'actions'
  ];
  today = new Date()

  constructor(
    private dialog: MatDialog,
    private helper: HelperService,
    private router: Router,
    private organizationService:OrganizationRepositoryService

  ) {}

  loadData() {
    this.organizationService.getAllOrganizations().subscribe(res => {
      this.organizations = this.filteredOrganizations = res?.response;
      this.filteredOrganizations = new MatTableDataSource(this.filteredOrganizations);
      this.filteredOrganizations.paginator = this.paginator;
      this.filteredOrganizations.sort = this.sort;
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
        this.sub.add(this.organizationService.removeOrganization(data).subscribe(
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


  filterStates(department: Event) {
    const filterValue = (department.target as HTMLInputElement).value.toLowerCase().trim();;
    if (filterValue) {
      this.filteredOrganizations = this.organizations.filter((tag) => {
        return( tag?.title.toLowerCase().includes(filterValue)||
        tag?.email.toLowerCase().includes(filterValue)||
        tag?.mobile.toString().toLowerCase().includes(filterValue)
        )
      });
    } else {
      this.filteredOrganizations = this.organizations;
    }
    this.filteredOrganizations = new MatTableDataSource(this.filteredOrganizations);
    this.filteredOrganizations.paginator = this.paginator;
    this.filteredOrganizations.sort = this.sort;
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.ORGANIZATIONS)
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
}
