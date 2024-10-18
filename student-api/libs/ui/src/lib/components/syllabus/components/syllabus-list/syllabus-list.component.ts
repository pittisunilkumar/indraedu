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
import { SyllabusInterface } from '@application/api-interfaces';
import { HelperService } from '../../../../helpers/helper-service';

@Component({
  selector: 'application-syllabus-list',
  templateUrl: './syllabus-list.component.html',
  styleUrls: ['./syllabus-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyllabusListComponent implements OnInit, OnChanges {
  @Input() syllabus: SyllabusInterface[];
  @Input() allowEdit = false;
  @Output() delete = new EventEmitter<SyllabusInterface>();
  @Output() edit = new EventEmitter<SyllabusInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'sno',
    'title',
    'type',
    'shortcut',
    'courses',
    'parents',
    'children',
    'createdOn',
    'actions',
  ];
  dataSource: MatTableDataSource<SyllabusInterface>;
  list: SyllabusInterface[];

  constructor(
    public helper: HelperService,
    private router: Router
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.syllabus?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.syllabus?.currentValue);
      this.list = changes?.syllabus?.currentValue
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
  editSyllabus(syllabus) {
    this.router.navigate([`bank/syllabus/${syllabus.uuid}/edit`]);
  }

  selectType(event) {
    if (event.target.value == 'ALL') {
      this.dataSource = new MatTableDataSource(this.list);
    }
    else {
      let dataSource: SyllabusInterface[];
      if (event.target.value) {
        dataSource = this.list.filter((syllabus) => {
          return syllabus.type.toLowerCase().includes(event.target.value.toLowerCase());
        });
      } else {
        dataSource = this.list;
      }
      this.dataSource = new MatTableDataSource(dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
}
