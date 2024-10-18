import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseInterface, VideoSubjectChapterInterface, VideoSubjectInterface } from '@application/api-interfaces';
import { HelperService, QBankRepositoryService, VideosRepositoryService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-video-subjects',
  templateUrl: './create-subjects.component.html',
  styleUrls: ['./create-subjects.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSubjectsComponent implements OnInit, OnChanges {

  @Input() courses: CourseInterface[];
  @Input() videoSubject: VideoSubjectInterface;
  @Input() mode: string;
  @Output() commit = new EventEmitter<VideoSubjectInterface>();

  form: FormGroup;
  subjects: any;
  course: any;
  chapter: any = [];
  chaptersBySubject: any;
  chapterEnabed: boolean[] = [];
  editable: boolean;

  constructor(
    private fb: FormBuilder,
    public helper: HelperService,
    private qbankRepo: QBankRepositoryService,
    private videosRepo: VideosRepositoryService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.videoSubject?.currentValue) {
      this.videoSubject = changes?.videoSubject?.currentValue;
      this.form = this.buildForm();
      console.log('changes detected', changes);
      this.addChapters();
      this.editable = true
      this.subjects = changes?.videoSubject?.currentValue?.courses?.syllabus;
      this.qbankRepo.getVideoChapterBySubjectId({ syllabusId: this.videoSubject?.syllabus?._id }).subscribe(res => {
        this.chaptersBySubject = res.response;
      });
    }
  }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.addChapters();
    console.log('videoSubject', this.videoSubject);
  }

  buildForm() {
   console.log(this.videoSubject);
   this.videoSubject?.chapters?.map((res, i) => {
    this.chapterEnabed[i] = true
  })
   
    return this.fb.group({
      // title: [this.videoSubject ? this.videoSubject.title : '', Validators.required],
      // imgUrl: [this.videoSubject ? this.videoSubject.imgUrl : '', Validators.required],
      imgUrl: this.fb.group({
        imgUrl: [this.videoSubject ? this.videoSubject?.imgUrl : '',Validators.required],
        upload: this.videoSubject?.imgUrl ? false : true,
      }),
      order: [this.videoSubject ? this.videoSubject?.order : null, Validators.required],
      courses: [this.videoSubject ? this.videoSubject?.courses : null, Validators.required],
      subjects: [this.videoSubject ? this.videoSubject?.syllabus : null, Validators.required],
      flags: this.fb.group({
        active: this.videoSubject ? this.videoSubject?.flags?.active : true,
        suggested: this.videoSubject ? this.videoSubject?.flags?.suggested : true,
      }),
      chapters: this.fb.array([]),
    });

  }

  get chapters(): FormArray {
    return this.form?.get('chapters') as FormArray;
  }

  newChapter(data?: VideoSubjectChapterInterface): FormGroup {
    return this.fb.group({
      title: data?.title ? data?.title : null,
      order: data?.order ? data?.order : null,
      uuid: data?.uuid ? data?.uuid : uuid.v4(),
      _id: data?._id ? data?._id : null,
      videos: new FormControl(data?.videos ? data?.videos : []),
    });
  }

  addChapters() {
    if (this.mode === 'add') {
      this.chapters?.push(this.newChapter());
    }
    if (this.mode === 'edit' && this.videoSubject) {
      this.videoSubject?.chapters?.map(it => this.chapters?.push(this.newChapter(it)));
    }
  }

  addNewChapter() {
    return this.chapters?.push(this.newChapter());
  }

  removeChapter(i) {
    return this.chapters.removeAt(i)
  }

  getImgUrl(data: { fileUrl: string; upload: boolean }) {    
    this.form.get('imgUrl').patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  getSubjects(course) {
    const inputBody = { courseId: course._id };
    this.qbankRepo.getVideoSubjectsByCourseId(inputBody).subscribe(data => {
      console.log('getsubjects', data);
      this.course = data.response[0]
      this.subjects = data.response[0].syllabus;
    });
  }

  getChapters(subject) {
    const inputBody = { syllabusId: subject._id };
    console.log('chapterss -- subject', subject);
    this.qbankRepo.getVideoChapterBySubjectId(inputBody).subscribe(data => {
      console.log('getchapters', data);
      this.chaptersBySubject = data.response;
    });
  }

  submit() {
    const value = this.form.value;
    console.log(value);
    
    let array = []
    value?.chapters.map(e => {
      if (this.mode == 'add') {
        let chapter = {
          _id: e.title._id,
          order: parseInt(e.order),
          uuid: e.title.uuid,
          videos: e.videos
        }
        this.chapter.push(chapter)
      }
      else if (this.mode == 'edit') {
        if (e.title.uuid) {
          let chapter = {
            _id: e.title._id,
            order: parseInt(e.order),
            uuid: e.title.uuid,
            videos: e.videos
          }
          array.push(chapter)
        }
        else {
          let chapter;
          array = this.videoSubject?.chapters
          // this.videoSubject?.chapters.map((res,i)=>{
          //    chapter = {
          //     _id: e._id,
          //     order: parseInt(e.order),
          //     uuid: e.uuid,
          //     videos: res.videos
          //   }
          //   // array = this.qBankSubject?.chapters;
          // })
          // array.push(chapter)
        }
      }
    })
    console.log('array', array);
    console.log('this.chapter', this.chapter);
  
    if (this.mode === 'add') {
      const payload: VideoSubjectInterface = {
        uuid: uuid.v4(),
        // title: value.courses.title,
        imgUrl: value.imgUrl?.imgUrl,
        // courses: value.courses.map(it => it._id),
        courses: this.course._id,
        syllabus: value.subjects._id,
        chapters: this.chapter,
        count: 0,
        order: Number(value.order),
        createdOn: new Date().toISOString().toString(),
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
      const payload: VideoSubjectInterface = {
        uuid: this.videoSubject.uuid,
        // title: value.courses.title,
        imgUrl: value.imgUrl?.imgUrl,
        // courses: value.courses.map(it => it._id),
        courses: value.courses._id,
        syllabus: value.subjects._id,
        chapters: array,
        count: this.videoSubject.count,
        order: Number(value.order),
        createdOn: this.videoSubject.createdOn,
        createdBy: this.videoSubject.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: new Date().toISOString().toString(),
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
