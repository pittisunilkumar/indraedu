import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {  RoleInterface, UserInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.less']
})
export class RoleListComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'title',
    // 'value',
    'createdOn',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<RoleInterface>;
  @Input() roles: RoleInterface[];
  @Output() delete = new EventEmitter<RoleInterface>();
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
    if (changes?.roles?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.roles?.currentValue);
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

  edit(role: RoleInterface) {
    return this.router.navigateByUrl(`/manage/roles/${role.uuid}/edit`);
  }

}
