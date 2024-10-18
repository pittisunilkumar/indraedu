import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseInterface, ResponseInterface } from '@application/api-interfaces';
import { CourseRepositoryService, SyllabusRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create-course-container',
  templateUrl: './create-course-container.component.html',
  styleUrls: ['./create-course-container.component.less'],
})
export class CreateCourseContainerComponent implements OnInit {

  syllabus$ = this.syllabus.getAllSyllabus();
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  course$: Observable<ResponseInterface<CourseInterface>>;

  constructor(
    private courseRepo: CourseRepositoryService,
    private syllabus: SyllabusRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    if (this.mode === 'edit') {
      this.course$ = this.getCourseByUuid$();
    }

  }

  getCourseByUuid$() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.courseRepo.getCourseByUuid(params.get('uuid'));
      })
    );

  }

  submit(course: CourseInterface) {

    if(this.mode === 'add') {
      this.courseRepo.createCourse(course).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
    } else {
      this.courseRepo.editCourseByUuid(course).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
    }

  }

}
