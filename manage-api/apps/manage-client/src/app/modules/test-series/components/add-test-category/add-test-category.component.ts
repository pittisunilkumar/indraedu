import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseInterface, TestCategoryInterface } from '@application/api-interfaces';
import { AWSS3Service, HelperService } from '@application/ui';
import * as uuid from 'uuid';

@Component({
  selector: 'application-add-test-category',
  templateUrl: './add-test-category.component.html',
  styleUrls: ['./add-test-category.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTestCategoryComponent implements OnInit, OnChanges {

  @Input() category?: TestCategoryInterface;
  @Input() courses?: CourseInterface[];
  @Input() mode: string;
  @Output() commit = new EventEmitter<TestCategoryInterface>();

  addTestSeriesCategoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private awsS3: AWSS3Service,
    public helper: HelperService,
  ) { }

  ngOnInit(): void {
    this.addTestSeriesCategoryForm = this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.category?.currentValue) {
      this.category = changes?.category?.currentValue;
      this.addTestSeriesCategoryForm = this.buildForm();
    }

  }

  // async uploadSchedulePdf(event) {

  //   await this.awsS3.uploadFile(event).then((result) => {
  //     console.log({result});
  //     this.addTestSeriesCategoryForm.controls['schedulePdf'].patchValue(result[0]?.Location);
  //   });

  // }

  buildForm() {
    console.log('this.category', this.category);

    return this.formBuilder.group({
      title: [
        this.category ? this.category?.categories.title : '',Validators.required
      ],
      schedulePdf: this.formBuilder.group({
        fileUrl: this.category ? this.category?.categories.schedulePdf : '',
        upload: this.category?.categories.schedulePdf ? true : false,
      }),
      order: [this.category ? this.category?.categories.order : null, Validators.required],
      count: [this.category ? this.category?.categories?.count : 0],
      freeTests: [this.category ? this.category?.categories?.freeTests : 0],
      courses: [this.category ? this.category?.courses : [], Validators.required],
      scheduledDate: [this.category ? this.category?.scheduledDate : '' ],
      flags: this.formBuilder.group({
        active: this.category ? this.category?.flags.active : true,
      }),
    });

  }

  compareFn(c1: CourseInterface, c2: CourseInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  getFileUrl(data: { fileUrl: string; upload: boolean }) {

    this.addTestSeriesCategoryForm.controls['schedulePdf'].patchValue({
      fileUrl: data.fileUrl,
      upload: data.upload,
    });

  }

  submit() {

    const value = this.addTestSeriesCategoryForm.value;

    if (this.mode === 'add') {
      const payload: any = {
        uuid: uuid.v4(),
        categories: {
          uuid: uuid.v4(),
          title: value.title,
          order: Number(value.order),
          freeTests:parseInt(value.freeTests),
          count:parseInt(value.count),
          schedulePdf: value.schedulePdf.fileUrl,
          tests: []
        },
        courses: value.courses._id,
        scheduledDate:value.scheduledDate,
        createdOn: new Date().toISOString().toString(),
        flags: {
          active: value.flags.active,
        },
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        modifiedOn: null,
      };
      console.log('payload', payload);


      this.commit.emit(payload);
    }

    if (this.mode === 'edit') {
      console.log(this.category.categories);
      
      const payload: any = {
        uuid: this.category?.uuid,
        categories: {
          uuid: this.category.categories.uuid,
          title: value.title,
          order: Number(value.order),
          freeTests:parseInt(value.freeTests),
          count:parseInt(value.count),
          schedulePdf: value.schedulePdf.fileUrl,
          tests: this.category.categories.tests
        },
        courses: value.courses._id,
        scheduledDate:value.scheduledDate,
        createdOn: this.category?.createdOn,
        createdBy: this.category?.createdBy,
        modifiedOn: new Date().toISOString().toString(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: value.flags.active,
        },
      };

      console.log('payload', payload);
      this.commit.emit(payload);
    }


  }

}
