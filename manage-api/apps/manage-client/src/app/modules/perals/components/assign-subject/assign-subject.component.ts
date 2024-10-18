import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PearlsInputInterface, PeralSubjectChapterInterface, QBankSubjectInterface, ResponseInterface } from '@application/api-interfaces';
import { HelperService, PeralsService, QBankRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';


@Component({
  selector: 'application-assign-subject',
  templateUrl: './assign-subject.component.html',
  styleUrls: ['./assign-subject.component.less']
})
export class AssignSubjectComponent implements OnInit {
  assignSubjectForm: FormGroup
  mode = this.route.snapshot.data['mode'];
  perals$: any;
  deleteArray = [];
  deleteRepetePerals = [];

  qSubject: QBankSubjectInterface[];


  @Input() perals?: any;
  // @Input() mode: string;
  @Output() commit = new EventEmitter<any>();
  optionsCount = 1;
  constructor(
    private formBuilder: FormBuilder,
    public helper: HelperService,
    private route: ActivatedRoute,
    private peralService: PeralsService,
    private qbankRepo: QBankRepositoryService,
    private router: Router
  ) { }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (this.mode === 'add') {
  //     this.addOptions(this.optionsCount);
  //   }
  //   this.buildForm();
  // }
  async ngOnInit(): Promise<void> {
    if (this.mode === 'add') {
      this.addOptions(this.optionsCount);
    }
    this.buildForm();
    this.loadData();
    this.getPeralByUuid().subscribe(async data => {
      this.perals$ = data.response;
      if (this.mode == 'edit') {
        let response = {
          pearlId: this.perals$._id
        }
        this.perals = await this.peralService.editAssignSubject(response).toPromise();
        this.perals = this.perals?.response;
        // this.perals.map(res=>{
        //   res.subject.map(sub=>{
        //     this.deleteArray.push({  subjectId: sub.syllabus._id,chapterId: sub.chapters[0]._id,pearlId:this.perals$._id})
        //   })
        // })        
        this.buildForm();
      }
    })

    console.log(' this.perals', this.perals);

  }
  loadData() {
    this.qbankRepo.getPeralQBankSubjects().subscribe(
      (res) => {
        this.qSubject = res.response;
      }
    );
  }

  getPeralByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.peralService.getPeralByUuid(params.get('uuid'));
      })
    );
  }

  async buildForm() {
    console.log(this.perals);
    this.assignSubjectForm = this.formBuilder.group({
      subjects: this.formBuilder.array(
        this.perals ?
          this.perals?.map((option, index) => this.newOption(index, option)) : []),
    });
  }
  get values(): FormArray {
    return this.assignSubjectForm?.get('subjects') as FormArray;
  }
  addNewOption() {
    ++this.optionsCount;
    return this.values?.push(this.newOption(this.optionsCount));
  }
  newOption(index: number, option?: PeralSubjectChapterInterface): FormGroup {
    return this.formBuilder.group({
      subject: option ? option.subject[0] : '',
      chapter: option ? option.subject[0].chapters : '',
    });
  }
  addOptions(count: number) {
    for (let i = 0; i < count; i++) {
      this.values?.push(this.newOption(i));
    }
  }
  removeOption(i) {
    if (this.mode == 'edit') {
      this.values.value.map((res, index) => {
        if (i == index) {
          this.deleteArray.push({ subjectId: res.subject.syllabus._id, chapterId: res.chapter._id, pearlId: this.perals$._id })
        }
      })
    }
    return this.values.removeAt(i)
  }
  submit() {
    let value = this.assignSubjectForm.value
    console.log('value', value);
    let insertArray = []
    value.subjects.map(res => {
      let obj = {
        subjectId: res.subject.syllabus._id,
        qUuid: res.subject.uuid,
        chapterId: res.chapter._id,
        pearlId: this.perals$._id
      }
      insertArray.push(obj)
    })

    if (this.mode === 'add') {
      const payload: any = {
        uuid: uuid.v4(),
        subject: insertArray,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload', payload);
      this.peralService.assignSubject(payload).subscribe(data => {
        if (data) {
          this.router.navigate(['/perals/list'])
        }
      })
    }
    else {
      const payload: any = {
        uuid: this.perals.uuid?this.perals.uuid:uuid.v4(),
        subject: insertArray,
        deleteArray: this.deleteArray,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      console.log('payload', payload);
      this.peralService.updateAssignSubject(payload).subscribe(data => {
        if (data) {
          this.router.navigate(['/perals/list'])
        }
      })

    }
  }

}
