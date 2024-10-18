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
import { Router, ActivatedRoute } from '@angular/router';
import { CourseInterface } from '@application/api-interfaces';
import { HelperService } from '../../../../helpers/helper-service';

@Component({
  selector: 'application-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit, OnChanges {

  displayedColumns: string[] = [
    'sno',
    'title',
    'imgUrl',
    'syllabus',
    'createdOn',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<CourseInterface>;

  @Input() courses: CourseInterface[];
  @Output() delete = new EventEmitter<CourseInterface>();
  @Output() assignSyllabus = new EventEmitter<CourseInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.courses?.currentValue) {
      this.dataSource = new MatTableDataSource(changes?.courses?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  edit(course: CourseInterface) {

    return this.router.navigate(['../', course.uuid, 'edit'], { relativeTo: this.route });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
