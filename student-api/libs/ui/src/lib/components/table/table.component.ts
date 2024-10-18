import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HelperService } from '../../helpers/helper-service';

export interface TableRowInterface {
  column: string;
  th: string;
  td: any;
  type: TypeEnum;
}

export enum TypeEnum {
  ARRAY = 'array',
  DATE = 'Date',
  STRING = 'string',
  NUMBER = 'number',
  IMAGE = 'image',
}

@Component({
  selector: 'application-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() list: TableRowInterface[];
  dataSource: MatTableDataSource<any>;

  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() assignSyllabus = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public helper: HelperService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.courses?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.list?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
