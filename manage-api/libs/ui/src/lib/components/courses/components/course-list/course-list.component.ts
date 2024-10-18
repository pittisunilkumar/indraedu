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
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseInterface } from '@application/api-interfaces';
import { CourseRepositoryService } from 'libs/ui/src/lib/repositories';
import { HelperService } from '../../../../helpers/helper-service';
import { CourseSubjectListComponent } from '../course-subject-list/course-subject-list.component';

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
    // 'state',
    // 'center',
    // 'stream',
    // 'imgUrl',
    // 'syllabus',
    'order',
    'organization',
    'createdOn',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<CourseInterface>;
  coursesList:any;
  list:any;

  @Input() courses: CourseInterface[];
  @Output() delete = new EventEmitter<CourseInterface>();
  @Output() assignSyllabus = new EventEmitter<CourseInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private courseRepository: CourseRepositoryService,
  ) {}

  deleteEnabled:string;
  editEnabled:string
  ngOnInit() {
    this.deleteEnabled = localStorage.getItem('deleteAccess');
    this.editEnabled = localStorage.getItem('editAccess');
   }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.courses?.currentValue) {
      this.list =this.coursesList =changes?.courses?.currentValue
      this.dataSource = new MatTableDataSource(changes?.courses?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  edit(course: CourseInterface) {

    return this.router.navigate(['../', course.uuid, 'edit'], { relativeTo: this.route });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();

    if (filterValue) {
      this.list = this.coursesList.filter((cou) => {
        return (
          cou.title.toLowerCase().includes(filterValue) ||
          cou?.state?.title.toLowerCase().includes(filterValue) ||
          cou?.organization?.title.toLowerCase().includes(filterValue)||
          cou?.center?.title.toLowerCase().includes(filterValue)||
          cou?.stream?.title.toLowerCase().includes(filterValue)
        )
      });
    } else {
      this.list = this.coursesList;
    }
    this.dataSource = new MatTableDataSource(this.list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  subjectList(course){
    const dialogRef = this.dialog.open(CourseSubjectListComponent, {
      data: { payload: course },
      height: 'auto',
      width: '80%'
    });
  }

  // getBatchData(){
  //       this.coursesList.map((cou,i)=>{
  //         cou.organizations = ['641079c651477113b4d6410c']
  //           console.log(cou);
  //           this.courseRepository.editCourseByUuid(cou).subscribe(c=>{})
  //     })
  // }
}
