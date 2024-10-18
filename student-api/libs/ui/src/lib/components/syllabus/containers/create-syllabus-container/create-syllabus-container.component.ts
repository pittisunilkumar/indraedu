import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, SyllabusInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseRepositoryService, SyllabusRepositoryService } from '../../../../repositories';

@Component({
  selector: 'application-create-syllabus-container',
  templateUrl: './create-syllabus-container.component.html',
  styleUrls: ['./create-syllabus-container.component.less'],
})
export class CreateSyllabusContainerComponent implements OnInit {

  syllabus$ = this.syllabusRepository.getAllSyllabus();
  mode = this.route.snapshot.data['mode'];
  syllabusByUuid$: Observable<ResponseInterface<SyllabusInterface>>;
  courseList$ = this.courseRepo.getAllCourses();
  errors: string[];
  syllabusList;
  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private courseRepo: CourseRepositoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.syllabus$.subscribe(data => {
      console.log('data', data);
      this.syllabusList = data.response;
      this.syllabusRepository.syllabusList = data.response;
    })

    if (this.mode === 'edit') {
      this.syllabusByUuid$ = this.getFacultyByUuid();
    }
  }

  getFacultyByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.syllabusRepository.getSyllabusByUuid(params.get('uuid'));
      })
    );
  }

  onSubmit(syllbaus: SyllabusInterface) {
    if (this.mode === 'add') {
      return this.syllabusRepository
        .addSyllabus(syllbaus)
        .pipe()
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/bank/syllabus/list');
          },
          (err) => {
            console.error(err);
            this.errors = err.error.error;
          }
        );
    } else {
      return this.syllabusRepository
        .editSyllabus(syllbaus)
        .pipe()
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/bank/syllabus/list');
          },
          (err) => {
            console.error(err);
            this.errors = err.error?.error;
          }
        );
    }
  }
}
