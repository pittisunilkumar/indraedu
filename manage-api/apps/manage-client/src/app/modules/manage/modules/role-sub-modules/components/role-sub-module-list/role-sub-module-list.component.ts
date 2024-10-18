import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoleSubModuleInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-role-sub-module-list',
  templateUrl: './role-sub-module-list.component.html',
  styleUrls: ['./role-sub-module-list.component.less']
})
export class RoleSubModuleListComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'title',
    'createdOn',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<RoleSubModuleInterface>;
  @Input() roleSubModule: RoleSubModuleInterface[];
  @Output() delete = new EventEmitter<RoleSubModuleInterface>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
  ) {}

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
   }
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.roleSubModule?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.roleSubModule?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(role: RoleSubModuleInterface) {
    return this.router.navigateByUrl(`/manage/role-sub-modules/${role.uuid}/edit`);
  }


}
