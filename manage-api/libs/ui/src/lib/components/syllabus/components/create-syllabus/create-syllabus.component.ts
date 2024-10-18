import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CourseInterface,
  SyllabusInterface,
  SyllabusTypeEnum,
} from '@application/api-interfaces';
import * as uuid from 'uuid';
import { AWSS3Service } from '../../../../finders/aws-s3.service';
import { HelperService } from '../../../../helpers/helper-service';
import { SyllabusRepositoryService } from 'libs/ui/src/lib/repositories';

@Component({
  selector: 'application-create-syllabus',
  templateUrl: './create-syllabus.component.html',
  styleUrls: ['./create-syllabus.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSyllabusComponent implements OnInit, OnChanges {
  createSyllabusForm: FormGroup;
  syllabus: SyllabusInterface;
  children: SyllabusInterface[];
  parents: SyllabusInterface[];
  enumData: any;
  syllabus$ = this.syllabusRepository.getAllSyllabus();

  @Input() data: SyllabusInterface[];
  @Input() courseList: CourseInterface[];
  @Input() mode: string;
  @Input() syllabusByUuid: SyllabusInterface;
  @Output() commit = new EventEmitter<SyllabusInterface>();

  constructor(
    private formBuilder: FormBuilder,
    private awsS3: AWSS3Service,
    private changeDetector: ChangeDetectorRef,
    public helper: HelperService,
    private syllabusRepository: SyllabusRepositoryService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildDataFromEnum();
    this.createSyllabusForm.get('type').valueChanges.subscribe((val) => {
      this.buildData(val);
    });
  }

  buildDataFromEnum() {
    this.enumData = {
      types: this.helper.enumtoArray(SyllabusTypeEnum),
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.syllabusByUuid?.currentValue) {
      this.syllabusByUuid = changes?.syllabusByUuid?.currentValue;
      this.buildForm();
      this.buildData(this.syllabusByUuid.type);
    }
  }

  buildData(val: string) {
    console.log(val);
    // if (val == 'CHAPTER') {
      this.syllabusRepository.onlySubjects().subscribe((res) => {
        this.parents = res.response;
        // console.log('this.parents', this.parents);
      });
    // } else if (val == 'SUBJECT') {
      this.syllabusRepository.onlyChapters().subscribe((res) => {
        this.children = res.response;
        // console.log('this.children', this.children);
      });
    // }

    // const array: string[] = this.helper.enumtoArray(SyllabusTypeEnum).data;
    // const index = this.enumData?.types.data.indexOf(val);
    // const length = this.enumData?.types.data.length - 1;
    // array.splice(0, (index + 1));
    // console.log({ array });
    // this.data = this.syllabusRepository.syllabusList;
    // this.syllabus$.subscribe(data => {
    //   console.log('data', data);
    //   this.data = data.response
    //       console.log(' this.data', this.data);
    //    // this.children = this.data?.filter((it) => array.includes(it.type));
    // this.children = this.data?.filter((it) => {
    //   if (it.type === 'CHAPTER') {
    //     return it
    //   }
    // });

    // // this.parents = this.data?.filter((it) => !array.includes(it.type));
    // this.parents = this.data?.filter((it) => {
    //   if (it.type === 'SUBJECT') {
    //     return it
    //   }
    // });
    //   // this.syllabusList = data.response;
    //   // console.log('this.syllabusList',this.syllabusList);

    //   // this.syllabusRepository.syllabusList = data.response;
    // })

    // if (this.syllabusByUuid?.children) {
    //   this.createSyllabusForm.get('children').setValue(this.syllabusByUuid.children)
    // }
    // if (this.syllabusByUuid?.parents) {
    //   this.createSyllabusForm.get('parents').setValue(this.syllabusByUuid.parents)
    // }
  }

  buildForm() {
    console.log('this.syllabusByUuid', this.syllabusByUuid);

    if (this.syllabusByUuid?.children) {
      this.createSyllabusForm
        .get('children')
        .setValue(this.syllabusByUuid.children);
    }
    if (this.syllabusByUuid?.parents) {
      this.createSyllabusForm
        .get('parents')
        .setValue(this.syllabusByUuid.parents);
    }

    this.createSyllabusForm = this.formBuilder.group({
      title: [
        this.syllabusByUuid ? this.syllabusByUuid?.title : '',
        Validators.required,
      ],
      type: [
        this.syllabusByUuid ? this.syllabusByUuid?.type : '',
        Validators.required,
      ],
      shortcut: [
        this.syllabusByUuid ? this.syllabusByUuid?.shortcut : '',
        Validators.required,
      ],
      imgUrlVideos: this.formBuilder.group({
        imgUrl: this.syllabusByUuid ? this.syllabusByUuid?.imgUrlVideos : '',
        upload: true,
      }),
      suggestedBanner: this.formBuilder.group({
        imgUrl: this.syllabusByUuid ? this.syllabusByUuid?.suggestedBanner : '',
        upload: true,
      }),
      imgUrlQBank: this.formBuilder.group({
        imgUrl: this.syllabusByUuid ? this.syllabusByUuid?.imgUrlQBank : '',
        upload: true,
      }),
      order: [
        this.syllabusByUuid ? this.syllabusByUuid?.order : null,
        Validators.required,
      ],
      parents: [this.syllabusByUuid ? this.syllabusByUuid?.parents : []],
      children: [this.syllabusByUuid ? this.syllabusByUuid?.children : []],
      flags: this.formBuilder.group({
        active: this.syllabusByUuid ? this.syllabusByUuid?.flags.active : true,
        editable: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.editable
          : true,
        suggested: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.suggested
          : true,
        testSeries: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.testSeries
          : true,
        videos: this.syllabusByUuid ? this.syllabusByUuid?.flags.videos : true,
        materials: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.materials
          : false,
        flashCards: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.flashCards
          : false,
        questionBank: this.syllabusByUuid
          ? this.syllabusByUuid?.flags.questionBank
          : true,
        mcq: this.syllabusByUuid ? this.syllabusByUuid?.flags.mcq : false,
      }),
    });
  }

  getType(type) {
    console.log('type', type);
    if (type === 'CHAPTER') {
      this.createSyllabusForm.get('parents').setValidators(Validators.required);
    }
  }

  disableAssignField() {
    return this.createSyllabusForm.get('type').value === 'SUBJECT';
  }

  setValidators() {}

  checkFileExists(name: string) {
    const s3Files = this.awsS3.viewAlbum('uploads');
    let check = false;
    s3Files.promise().then((data) => {
      data.Contents.some((file) => {
        console.log('checkFileExists', { file });
        check = file.Key !== name;
      });
    });

    return check;
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }, type: string) {
    switch (type) {
      case 'videos':
        this.createSyllabusForm.controls['imgUrlVideos'].patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;

      case 'suggested':
        this.createSyllabusForm.controls['suggestedBanner'].patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;

      case 'qbank':
        this.createSyllabusForm.controls['imgUrlQBank'].patchValue({
          imgUrl: data.fileUrl,
          upload: data.upload,
        });
        break;
    }
  }

  listAlbums() {
    return this.awsS3.listAlbums();
  }

  compareFn(c1: SyllabusInterface, c2: SyllabusInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  compareCoursesFn(c1: CourseInterface, c2: CourseInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  onReset() {}

  submitPayload() {
    const createForm = this.createSyllabusForm.value;

    console.log('createForm', createForm);

    let parents = [];
    if (createForm.parents?.length) {
      parents = createForm?.parents?.map((it) => it?._id);
    }
    let children = [];
    if (createForm?.children?.length) {
      children = createForm?.children?.map((it) => it?._id);
    }
    let syllabus: SyllabusInterface;

    if (this.mode === 'add') {
      syllabus = {
        uuid: uuid.v4(),
        title: createForm.title,
        type: createForm.type,
        shortcut: createForm.shortcut,
        order: Number(createForm.order),
        parents: parents,
        children: children,
        imgUrlVideos: createForm.imgUrlVideos.imgUrl,
        suggestedBanner: createForm.suggestedBanner.imgUrl,
        imgUrlQBank: createForm.imgUrlQBank.imgUrl,
        flags: {
          active: createForm.flags.active,
          editable: createForm.flags.editable,
          testSeries: createForm.flags.testSeries,
          videos: createForm.flags.videos,
          materials: createForm.flags.materials,
          flashCards: createForm.flags.flashCards,
          questionBank: createForm.flags.questionBank,
          mcq: createForm.flags.mcq,
          suggested: createForm.flags.suggested,
        },
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };
    } else {
      syllabus = {
        uuid: this.syllabusByUuid.uuid,
        title: createForm.title,
        type: createForm.type,
        shortcut: createForm.shortcut,
        order: Number(createForm.order),
        parents: parents,
        children: children,
        imgUrlVideos: createForm.imgUrlVideos.imgUrl,
        suggestedBanner: createForm.suggestedBanner.imgUrl,
        imgUrlQBank: createForm.imgUrlQBank.imgUrl,
        flags: {
          active: createForm.flags.active,
          editable: createForm.flags.editable,
          testSeries: createForm.flags.testSeries,
          videos: createForm.flags.videos,
          materials: createForm.flags.materials,
          flashCards: createForm.flags.flashCards,
          questionBank: createForm.flags.questionBank,
          mcq: createForm.flags.mcq,
          suggested: createForm.flags.suggested,
        },
        createdOn: this.syllabusByUuid.createdOn,
        modifiedOn: new Date(),
        createdBy: this.syllabusByUuid.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };
    }

    return syllabus;
  }

  onSubmit() {
    const createForm = this.createSyllabusForm.value;
    this.commit.emit(this.submitPayload());
  }
}
