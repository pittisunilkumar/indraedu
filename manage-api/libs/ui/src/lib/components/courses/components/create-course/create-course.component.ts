import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CourseInterface, SyllabusInterface } from '@application/api-interfaces';
import { OrganizationRepositoryService, SyllabusRepositoryService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCourseComponent implements OnInit, OnChanges {

  @Input() course?: CourseInterface;
  // @Input() syllabus: SyllabusInterface[];
  @Input() mode: string;
  @Output() commit = new EventEmitter<CourseInterface>();
  subjects: any;
  subjactsList: any;
  syllabus: SyllabusInterface[];
  organizationsList:any;


  createCourseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private syllabusRepository: SyllabusRepositoryService,
    private organizationService: OrganizationRepositoryService,

    ) { }

  ngOnInit(): void {
    this.createCourseForm = this.buildForm();
    
    // this.syllabusRepository.getACtiveSubjects().subscribe(data => {
    //   this.subjects = data
    //   this.subjactsList = new MatTableDataSource(this.subjects)
    // })

    this.syllabusRepository.getOnlySubjects().subscribe(data => {
      this.subjects = data.response
      this.subjactsList = new MatTableDataSource(this.subjects)
    })
    this.getOrganizations();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this.mode === 'edit' && changes?.course?.currentValue) {
      this.course = changes?.course?.currentValue;
      this.createCourseForm = this.buildForm();
    }

  }

  getOrganizations(){
    this.organizationService.getActiveOrganizations().subscribe(res=>{
      this.organizationsList = res.response;
    })
  }

  // syllabusFilter(event: any) {
  //   this.subjactsList.filter = event.target.value.trim().toLowerCase();
  //   this.subjects = this.subjactsList.filteredData;
  //   console.log(' this.subjects', this.subjects);
    
  // }

  buildForm() {
    console.log('course data', this.course);

    return this.formBuilder.group({
      title: [
        this.course ? this.course?.title : '',
        [Validators.required, Validators.maxLength(40)],
      ],
      image: this.formBuilder.group({
        imgUrl: this.course ? this.course?.imgUrl : '',
        upload: true,
      }),
      order: [this.course ? this.course?.order : null, Validators.required],
      syllabus: [this.course ? this.course?.syllabus : [], Validators.required],
      organizations: [this.course ? this.course?.organizations : [], Validators.required],
      flags: this.formBuilder.group({
        active: this.course ? this.course?.flags.active : true,
        paid: this.course ? this.course?.flags.paid : false,
        qBank: this.course ? this.course?.flags.qBank : false,
        testSeries: this.course ? this.course?.flags.testSeries : true,
        videos: this.course ? this.course?.flags.videos : true,
      }),
    });

  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {

    this.createCourseForm.controls['image'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  // getImageUrl(data: { imgUrl: string; upload: boolean }) {
  //   console.log('data getimgurl', data);

  //   this.createCourseForm.controls['image'].patchValue({
  //     imgUrl: data.imgUrl,
  //     upload: data.upload,
  //   });
  // }

  compareFn(c1: CourseInterface, c2: CourseInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  resetForm() {
    this.createCourseForm.reset();
  }

  submit() {

    const value = this.createCourseForm.value;
    console.log('img val', value.image);

    if (this.mode === 'add') {

      const payload: CourseInterface = {
        uuid: uuid.v4(),
        title: value.title,
        imgUrl: value.image.imgUrl,
        order: Number(value.order),
        syllabus: value.syllabus.map(it => it._id),
        organizations: value.organizations.map(it => it._id),
        createdOn: new Date(),
        flags: {
          active: value.flags.active,
          paid: value.flags.paid,
          qBank: value.flags.qBank,
          testSeries: value.flags.testSeries,
          videos: value.flags.videos,
        },
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };

      this.commit.emit(payload);

    } else {

      const payload: CourseInterface = {
        uuid: this.course?.uuid,
        title: value.title,
        imgUrl: value.image.imgUrl,
        order: Number(value.order),
        syllabus: value.syllabus.map(it => it._id),
        createdBy: this.course?.createdBy,
        createdOn: this.course?.createdOn,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: new Date(),
        flags: {
          active: value.flags.active,
          paid: value.flags.paid,
          qBank: value.flags.qBank,
          testSeries: value.flags.testSeries,
          videos: value.flags.videos,
        },
        organizations: value.organizations.map(it => it._id),
      };

      this.commit.emit(payload);

    }
  }
}
