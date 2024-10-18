import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankSubjectInterface, ResponseInterface } from '@application/api-interfaces';
import { CourseRepositoryService, QBankRepositoryService ,SyllabusRepositoryService} from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-subjects-container',
  templateUrl: './create-subjects-container.component.html',
  styleUrls: ['./create-subjects-container.component.less']
})
export class CreateSubjectsContainerComponent implements OnInit, OnDestroy {

  mode = this.router.url.includes('edit') ? 'edit' : 'add';
  qBankCourses$ = this.courseRepo.getAllQBankCourses();
  // chaptersBySubject$  = this.syllabusRepository.getAllSyllabus();
  qBankSubject$: Observable<ResponseInterface<QBankSubjectInterface>>
  errors: string[];
  _sub = new Subscription();
  subjects;

  list: QBankSubjectInterface[];

  fileName: any;
  file: File | any = null;
  qBankSubjects:any;
 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseRepo: CourseRepositoryService,
    private qbankRepo: QBankRepositoryService,
    private syllabusRepository: SyllabusRepositoryService,

  ) { }

  getQBankSubjectByUuid() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.qbankRepo.getQBankSubjectsByUuid(params.get('uuid'));
      })
    );

  }





  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.qBankSubject$ = this.getQBankSubjectByUuid();
    }
    this._sub.add(this.loadData());
  }
  loadData() {

    return this.qbankRepo.getAllQBankSubjects().subscribe(
      (res) => {
        this.list = res.response;
      }
    );

  }

  submit(data: QBankSubjectInterface) {

    if (this.mode === 'add') {

      this.qbankRepo.addQBankSubjects(data).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigateByUrl('/q-bank/subjects/list');
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      )

    } else {

      this.qbankRepo.editQBankSubjectsByUuid(data).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigateByUrl('/q-bank/subjects/list');
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );

    }
  }

  ngOnDestroy(): void {

    this._sub.unsubscribe();

  }


  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  FileSubmited() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.qBankSubjects = JSON.parse(fileReader.result);
      this.qBankSubjects.map(res => {
        let cData = {
        uuid: uuid.v4(),
        imgUrl: res.image_file,
        courses: res.course_id,
        syllabus: res.subject_id,
        chapters: JSON.parse(res.chapter_id),
        count: 0,
        order: Number(res.order),
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: true,
          suggested: true,
          paid:true
        }
      }
        array.push(cData)
        
      })

      console.log(array);
      
      // array.map(res => {
      //    this.qbankRepo.addQBankSubjects(res).subscribe(data => {
      //     if (data) {
      //       console.log(data);
      //     }
      //   })
      // })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
    
  }

}
