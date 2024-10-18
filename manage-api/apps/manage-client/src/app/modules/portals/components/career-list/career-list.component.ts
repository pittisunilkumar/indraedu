import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CareerInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-career-list',
  templateUrl: './career-list.component.html',
  styleUrls: ['./career-list.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CareerListComponent implements OnInit, OnChanges {

  displayedColumns: string[] = [
    'title',
    'code',
    'designation',
    'department',
    'qualifications',
  ];
  dataSource: MatTableDataSource<CareerInterface>;
  expandedElement: CareerInterface | null;

  @Input() careers: CareerInterface[];
  @Output() delete = new EventEmitter<CareerInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public helper: HelperService, private router: Router) {}

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
   }


  ngOnChanges(changes: SimpleChanges) {
    if (changes?.careers?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.careers?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  edit(career: CareerInterface) {
    this.router.navigateByUrl(`/portal/careers/${career.uuid}/edit`);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
