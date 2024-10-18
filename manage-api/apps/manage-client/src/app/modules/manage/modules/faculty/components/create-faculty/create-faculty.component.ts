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
  FacultyInterface,
  GenderEnum,
  SyllabusInterface,
  UserInterface,
} from '@application/api-interfaces';
import { HelperService, QBankRepositoryService, SyllabusRepositoryService } from '@application/ui';
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-faculty',
  templateUrl: './create-faculty.component.html',
  styleUrls: ['./create-faculty.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFacultyComponent implements OnInit, OnChanges {

  @Input() user: UserInterface;
  @Input() courses: CourseInterface;
  @Input() syllabus: SyllabusInterface;
  @Input() faculty?: FacultyInterface;
  @Input() mode: string;

  @Output() commit = new EventEmitter<FacultyInterface>();
  // subjects: SyllabusInterface[] = []
  // syllabus: any;
  course: any;
  createFacultyForm: FormGroup;
  enumData: any;


  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private changeDetector: ChangeDetectorRef,
    private syllabusRepository: SyllabusRepositoryService,
    private qbankRepo: QBankRepositoryService,

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mode === 'edit' && changes?.faculty?.currentValue) {
      this.faculty = changes?.faculty?.currentValue;
      this.buildForm();
    }
  }

  ngOnInit(): void {
    this.buildDataFromEnum();
    this.buildForm();
  }

  getSubjects(course) {
    const inputBody = { courseId: course._id };
    this.qbankRepo.getSubjectsByCourseId(inputBody).subscribe(data => {
      console.log('getsubjects', data);
      this.course = data.response[0];
      this.syllabus = data.response[0].syllabus;
    });
    this.mode = 'add'
  }
  getSyllabus() {
    if (this.mode === 'edit') {
      this.syllabus = this.faculty?.courses.syllabus
    }
  }

  buildDataFromEnum() {

    this.enumData = {
      genders: this.helper.enumtoArray(GenderEnum),
    };
  }

  buildForm() {
    console.log(this.faculty);

    this.createFacultyForm = this.formBuilder.group({
      name: [
        this.faculty ? this.faculty?.name : '',Validators.required
      ],
      specialization: [
        this.faculty ? this.faculty?.specialization : '',Validators.required
      ],
      mobile: [
        this.faculty ? this.faculty?.mobile : '',Validators.required
      ],
    //   discountPercentage: [
    //     this.faculty ? this.faculty?.discountPercentage : '',
    //  ],
      designation: [
        this.faculty ? this.faculty?.designation : '',
        [Validators.required, Validators.maxLength(10)],
      ],
      courses: [this.faculty ? this.faculty?.courses : [],],
      syllabus: [
        this.faculty ? this.faculty?.syllabus : [],
      ],
      bank: this.formBuilder.group({
        accountNumber: this.faculty ? this.faculty?.bank.accountNumber : '',
        branch: this.faculty ? this.faculty?.bank.branch : '',
        ifsc: this.faculty ? this.faculty?.bank.ifsc : null,
      }),
      flags: this.formBuilder.group({
        isActive: this.faculty ? this.faculty?.flags.isActive : true,
      }),
      image: this.formBuilder.group({
        imgUrl: this.faculty ? this.faculty?.imgUrl : '',
        upload: true,
      }),
      gender: [
        this.faculty ? this.faculty?.gender : '',
        Validators.required,
      ],
    });

    this.changeDetector.detectChanges();
  }

  // getSpecilization(specialization){
  //  console.log('specialization',specialization.value);
   
  // }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.createFacultyForm.controls['image'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  genderData(val: string) {
    const arr = [
      {
        name: 'COMMON.MALE',
        value: GenderEnum.MALE,
      },
      {
        name: 'COMMON.FEMALE',
        value: GenderEnum.FEMALE,
      },
      // {
      //   name: 'COMMON.OTHER',
      //   value: GenderEnum.OTHER,
      // },
    ];
  }

  onReset() {
    this.createFacultyForm.reset();
   }

  onSubmit() {
    const value = this.createFacultyForm.value;
    if (this.mode === 'add') {
      const password
      = value.name +'@'+ value.mobile?.toString().substr(0, 4) ;
      console.log('password', password);
      const faculty: FacultyInterface = {
        uuid: uuid.v4(),
        name: value.name,
        designation: value.designation,
        specialization:value.specialization,
        mobile:parseInt(value.mobile),
        password:password,
        // discountPercentage:parseInt(value.discountPercentage),
        bank: value.bank,
        courses:this.course ? this.course._id:null,
        syllabus:value.syllabus? value.syllabus._id:null,
        flags: value.flags,
        imgUrl: value.image.imgUrl,
        createdOn: new Date(),
        modifiedOn: null,
        gender: value.gender,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };
      console.log(faculty);

      this.commit.emit(faculty);
    } else {
      const faculty: FacultyInterface = {
        uuid: this.faculty.uuid,
        name: value.name,
        specialization:value.specialization,
        mobile:parseInt(value.mobile),
        password:this.faculty?.password,
        // discountPercentage:value.discountPercentage,
        designation: value.designation,
        bank: value.bank,
        courses:value.courses ? value.courses._id:null,
        syllabus:value.syllabus? value.syllabus._id:null,
        // courses: value.courses._id,
        // syllabus: value.syllabus._id,
        flags: value.flags,
        imgUrl: value.image.imgUrl,
        createdOn: this.faculty.createdOn,
        modifiedOn: new Date(),
        gender: value.gender,
        createdBy: this.faculty.createdBy,
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      };
      console.log(faculty);

      this.commit.emit(faculty);
    }
  }
  onReview() { }
}
