import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CourseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import { CommandRemoveDialogComponent } from '@application/ui';
import * as _differenceBy from 'lodash.differenceby';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CourseRepositoryService } from '../../../../repositories/course-repository.service';
import { SyllabusRepositoryService } from '../../../../repositories/syllabus-repository.service';
import { AssignSyllabusComponent } from '../../components/assign-syllabus/assign-syllabus.component';

@Component({
  selector: 'application-course-list-container',
  templateUrl: './course-list-container.component.html',
  styleUrls: ['./course-list-container.component.less'],
})
export class CourseListContainerComponent implements OnInit {

  courses: CourseInterface[];
  syllabus: SyllabusInterface[];
  public sub = new Subscription();
  length:number;
  errors: string[];
  createEnable:string;

  constructor(
    private courseRepository: CourseRepositoryService,
    public dialog: MatDialog,
    private syllabusRepository: SyllabusRepositoryService,
    
  ) {}

  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
    this.sub.add(this.bindSyllabus());
    this.sub.add(this.loadData());

  }

  loadData() {

    this.courseRepository.getAllCourses().subscribe(
      (res) => {
        this.courses = res?.response;
        this.length =  res?.response.length
      },
      (err) => {
        console.error(err);

      }
    );

  }

  bindSyllabus() {
    this.syllabusRepository
      .getAllSyllabus()
      .subscribe((syllabus) => (this.syllabus = syllabus?.response));
  }

  delete(course: CourseInterface) {
    const dialogRef = this.dialog.open(CommandRemoveDialogComponent, {
      data: { payload: course },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.courseRepository.deleteCourseByUuid(course.uuid).subscribe(
          (res) => {
            console.log({ res });
            this.loadData();
          },
          (err) => {
            console.log({ err });
            this.errors = err.error.error;
          }
        );
      }
    })
  }

  assignSyllabus(course: CourseInterface) {
    this.sub.add(this.bindSyllabus());
    this.dialog.open(AssignSyllabusComponent, {
      data: {
        course: course,
        syllabus: _differenceBy(this.syllabus, course.syllabus, 'uuid'),
      },
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.sub.add(this.loadData());
    });
  }
}
