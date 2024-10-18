import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SyllabusInterface, VdoCipherVideoInterface, VdoCipherVideoListInterface } from '@application/api-interfaces';
import { CourseRepositoryService, HelperService, VideoCipherRepositoryService } from '@application/ui';

@Component({
  selector: 'application-videos-list-container',
  templateUrl: './videos-list-container.component.html',
  styleUrls: ['./videos-list-container.component.less']
})
export class VideosListContainerComponent implements OnInit {

  response: VdoCipherVideoListInterface;
  list: VdoCipherVideoInterface[] = [];
  filteredList: VdoCipherVideoInterface[] = [];
  tags: any;
  pageOptions: { page: number; limit: number; tags: string[]; };
  videoCourses$ = this.courseRepo.getAllVideoCourses();
  videoSubjectsByCourseId: SyllabusInterface[];
  chapters: SyllabusInterface[];

  form: FormGroup;

  constructor(
    private videoCipher: VideoCipherRepositoryService,
    private courseRepo: CourseRepositoryService,
    private formBuilder: FormBuilder,
    private helper: HelperService,
  ) { }

  ngOnInit(): void {

    this.pageOptions = { page: 1, limit: 39, tags: [] };
    this.loadData();
    this.form = this.buildForm();
    this.applyFormChanges();

  }

  buildForm(): FormGroup {

    return this.formBuilder.group({
      course: null,
      subject: null,
      chapter: null,
    });

  }

  applyFormChanges() {

    this.form.get('course').valueChanges.subscribe(val => {
      if(val) {
        this.form.get('subject').patchValue(null);
        this.form.get('chapter').patchValue(null);
        this.videoSubjectsByCourseId = val.syllabus?.filter(it => it.type === 'SUBJECT');
      }
    });


    this.form.get('subject').valueChanges.subscribe(val => {
      this.form.get('chapter').patchValue(null);
      if(val) {
        this.chapters = val.children;
      }
    });

  }

  loadData() {

    this.list = [];

    return this.videoCipher.getAllVideos(this.pageOptions).subscribe(result => {
      this.response = result.response;
      this.filteredList = this.list = this.list.concat(result.response.rows);
    });

  }

  loadDataByParams(obj) {

    this.pageOptions.limit = obj.pageSize;
    this.pageOptions.page = obj.pageIndex + 1;
    this.loadData();

  }

  reset() {

    this.form.reset();
    this.pageOptions = { page: 1, limit: 39, tags: [] };
    this.loadData();

  }

  applyFilters() {

    this.pageOptions.tags = [];
    const value = this.form.value;

    if(value?.course) {
      this.pageOptions.tags.push(this.helper.stringSanitizer(value?.course?.title));
    }
    if(value?.subject) {
      this.pageOptions.tags.push(this.helper.stringSanitizer(value?.subject?.title));
    }
    if(value?.chapter) {
      this.pageOptions.tags.push(this.helper.stringSanitizer(value?.chapter?.title));
    }

    this.loadData();

  }

}
