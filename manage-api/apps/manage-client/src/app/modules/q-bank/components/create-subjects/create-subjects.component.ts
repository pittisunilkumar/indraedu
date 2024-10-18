import { stringify } from '@angular/compiler/src/util';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CourseInterface, QBankSubjectInterface, SyllabusInterface } from '@application/api-interfaces';
import { AlertDialogComponent, HelperService, QBankRepositoryService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-subjects',
  templateUrl: './create-subjects.component.html',
  styleUrls: ['./create-subjects.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSubjectsComponent implements OnInit, OnChanges {
  // @Input() syllabus: SyllabusInterface;
  // @Input() chaptersBySubject: SyllabusInterface;
  @Input() qbankSubjectList: QBankSubjectInterface[]
  @Input() courses: CourseInterface[];
  @Input() qBankSubject: QBankSubjectInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<QBankSubjectInterface>();

  form: FormGroup;
  subjects: any;
  course: any;
  chapter: any = [];
  chaptersBySubject: any;
  chapterEnabed: boolean[] = [];
  editable: boolean;
  isEnable:boolean;

  constructor(
    private fb: FormBuilder,
    public helper: HelperService,
    private qbankRepo: QBankRepositoryService,
    private dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.qBankSubject?.currentValue) {
      this.qBankSubject = changes?.qBankSubject?.currentValue;
      this.form = this.buildForm();
      console.log('changes detected', changes);
      this.addChapters();
      if (this.mode === 'edit') {
        this.editable = true
        this.subjects = changes?.qBankSubject?.currentValue.courses.syllabus;
        this.qbankRepo.getChapterBySubjectId({ syllabusId: this.qBankSubject?.syllabus._id }).subscribe(res => {
          this.chaptersBySubject = res.response;
          // this.chaptersBySubject?.map((res, i) => {
          //   this.chapterEnabed[i] = true
          // })
        });
        // this.chaptersBySubject = changes?.qBankSubject?.currentValue.syllabus.children
        // this.chaptersBySubject = changes?.qBankSubject?.currentValue.chapters
        // this.chaptersBySubject.map((res, i) => {
        //   this.chapterEnabed[i] = true
        // })
        // console.log(this.chaptersBySubject);
      }
    }
  }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.addChapters();
  }
  getSubjects(course) {
    const inputBody = { courseId: course._id };
    this.qbankRepo.getSubjectsByCourseId(inputBody).subscribe(data => {
      console.log('getsubjects', data);
      this.course = data.response[0]
      this.subjects = data.response[0].syllabus;
      // this.syllabus = data.response[0].syllabus;
     
      
    });
  }
  getChapters(subject) {
    const inputBody = { syllabusId: subject._id };
    this.qbankRepo.getChapterBySubjectId(inputBody).subscribe(data => {
      console.log('getchapters', data);
      this.chaptersBySubject = data.response;
    });
    this.qbankSubjectList.map(res => {
      if (res.courses._id === this.course._id && res.syllabus._id === this.form.value.subjects._id) {
        // this.isEnable = true
        //  console.log('Already Exists');
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          data: { payload: { course: this.course.title, subject: this.form.value.subjects.title }, type: 'qbankSubject' },
        });
      }
    })
  }

  // chapterEdit(index) {
  // if (this.mode === 'edit') {
  //   this.chapterEnabed[index] = false
  //   this.chaptersBySubject = this.qBankSubject.syllabus.children
  // }
  // }

  buildForm() {
    console.log(this.qBankSubject);
    // this.chaptersBySubject = this.qBankSubject?.chapters
    this.qBankSubject?.chapters.map((res, i) => {
      this.chapterEnabed[i] = true
    })
    let createQSubjectForm = this.fb.group({
      // title: [this.qBankSubject ? this.qBankSubject.title : '', Validators.required],
      // imgUrl: [this.qBankSubject ? this.qBankSubject.imgUrl : '', Validators.required],
      imgUrl: this.fb.group({
        imgUrl:[ this.qBankSubject ? this.qBankSubject.imgUrl : '',Validators.required],
        upload: this.qBankSubject?.imgUrl ? false : true,
      }),
      order: [this.qBankSubject ? this.qBankSubject.order : null, Validators.required],
      courses: [this.qBankSubject ? this.qBankSubject.courses : null, Validators.required],
      subjects: [this.qBankSubject ? this.qBankSubject.syllabus : null, Validators.required],
      flags: this.fb.group({
        active: this.qBankSubject ? this.qBankSubject.flags.active : true,
        suggested: this.qBankSubject ? this.qBankSubject.flags.suggested : true,
      }),
      chapters: this.fb.array([]),
    });
    return createQSubjectForm;
  }

  get chapters(): FormArray {
    return this.form?.get('chapters') as FormArray;
  }

  newChapter(data?: { title: string; order: number; topics: any, uuid: string, _id: string }): FormGroup {
    return this.fb.group({
      title: data?.title ? data?.title : null,
      order: data?.order ? data?.order : null,
      uuid: data?.uuid ? data?.uuid : null,
      _id: data?._id ? data?._id : null,
      topics: data?.topics ? [data?.topics] : [[]],
    });
  }

  addChapters() {
    console.log('chapters add start ');
    if (this.mode === 'add') {
      this.chapters?.push(this.newChapter());
    }
    if (this.mode === 'edit' && this.qBankSubject) {
      console.log('edit start ', this.qBankSubject?.chapters);
      this.chapter = this.qBankSubject?.chapters?.map(it => this.chapters?.push(this.newChapter(it)));
    }
  }

  addNewChapter() {
    return this.chapters?.push(this.newChapter());
  }

  removeChapter(i) {
    // if(this.mode == 'edit'){
    //   // this.chaptersBySubject = this.chaptersBySubject.filter((e,index)=>{
    //   //    return index != i
    //   // })
    //   this.qBankSubject.chapters = this.qBankSubject?.chapters.filter((e,index)=>{
    //     return index != i
    //  })
    // }
    return this.chapters.removeAt(i)
  }

  getImgUrl(data: { fileUrl: string; upload: boolean }) {
    this.form.get('imgUrl').patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }



  submit() {
    const value = this.form.value;
    let array = []
    value.chapters.map(e => {
      if (this.mode == 'add') {
        let chapter = {
          _id: e.title._id,
          order: parseInt(e.order),
          uuid: e.title.uuid,
          topics: e.topics
        }
        this.chapter.push(chapter)
      }
      else if (this.mode == 'edit') {
        if (e.title.uuid) {
          let chapter = {
            _id: e.title._id,
            order: parseInt(e.order),
            uuid: e.title.uuid,
            topics: e.topics
          }
          array.push(chapter)
        }
        else {
          let chapter;
          // console.log('this.qBankSubject?.chapters',this.qBankSubject?.chapters);
          array = this.qBankSubject?.chapters
          // this.qBankSubject?.chapters.map((res, i) => {
          //   chapter = {
          //     _id: e._id,
          //     order: parseInt(e.order),
          //     uuid: e.uuid,
          //     topics: res.topics
          //   }
          //   // array = this.qBankSubject?.chapters;
          // })
          // array.push(chapter)

        }
      }
    })
    console.log('array', array);
    // console.log('this.chapter', this.chapter);

    if (this.mode === 'add') {

      const payload: QBankSubjectInterface = {
        uuid: uuid.v4(),
        // title: value.courses.title,
        imgUrl: value.imgUrl?.imgUrl,
        // courses: value.courses.map(it => it._id),
        courses: this.course._id,
        syllabus: value.subjects._id,
        chapters: this.chapter?this.chapter:[],
        count: 0,
        order: Number(value.order),
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
          suggested: value.flags.suggested,
        }
      };
      console.log(payload);

      this.commit.emit(payload);

    } else {
      const payload: QBankSubjectInterface = {
        uuid: this.qBankSubject.uuid,
        // title: value.title,
        imgUrl: value.imgUrl?.imgUrl,
        // courses: value.courses.map(it => it._id),
        courses: value.courses._id,
        syllabus: value.subjects._id,
        chapters: array,
        count: this.qBankSubject?.count,
        order: Number(value.order),
        createdOn: value.createdOn,
        createdBy: value.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: new Date(),
        flags: {
          active: value.flags.active,
          suggested: value.flags.suggested,
        }
      };
      console.log(payload);
      this.commit.emit(payload);

    }

  }

}
