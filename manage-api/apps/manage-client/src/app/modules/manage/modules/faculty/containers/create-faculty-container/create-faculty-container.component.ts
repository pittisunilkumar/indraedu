import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyInterface, ResponseInterface } from '@application/api-interfaces';
import {
  CourseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import {
  CourseRepositoryService,
  FacultyRepositoryService,
  QBankRepositoryService,
  SyllabusRepositoryService,
} from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'application-create-faculty-container',
  templateUrl: './create-faculty-container.component.html',
  styleUrls: ['./create-faculty-container.component.less'],
})
export class CreateFacultyContainerComponent implements OnInit {
  
  courses$ = this.courseRepo.getAllCourses();
  syllabus$ = this.syllabusRepository.getAllSyllabus();

  faculty$: Observable<ResponseInterface<FacultyInterface>>;
  mode = this.route.snapshot.data['mode'];
  errors: string[];

  constructor(
    private facultyRepo: FacultyRepositoryService,
    private courseRepo: CourseRepositoryService,
    private syllabusRepository: SyllabusRepositoryService,
    private router: Router,
    private qbankRepo: QBankRepositoryService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.faculty$ = this.getFacultyByUuid();
    }
  }

  getFacultyByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.facultyRepo.getFacultyByUuid(params.get('uuid'));
      })
    );
  }

  submit(event) {
    if (this.mode === 'add') {
      this.facultyRepo
        .addFaculty(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigate(['/manage/faculty/list'], { relativeTo: this.route });
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.facultyRepo
        .editFacultyByUuid(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
          console.log({ result });
          this.router.navigate(['/manage/faculty/list'], { relativeTo: this.route });
        },
        (err) => {
          this.errors = err.error.error;
        }
        );
    }
  }
}
