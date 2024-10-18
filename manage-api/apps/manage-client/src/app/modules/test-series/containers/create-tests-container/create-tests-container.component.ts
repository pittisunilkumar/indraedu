import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseInterface, QuestionInterface, ResponseInterface, SyllabusInterface, TestInterface, TestCategoryInterface, EntityStatusEnum } from '@application/api-interfaces';
import { TestsRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';
import { Location } from '@angular/common';

export interface TestDataInterface {
  categories: TestCategoryInterface[];
  courses: CourseInterface[];
  questions: QuestionInterface[];
  subjects: SyllabusInterface[];
}

@Component({
  selector: 'application-create-tests-container',
  templateUrl: './create-tests-container.component.html',
  styleUrls: ['./create-tests-container.component.less']
})
export class CreateTestsContainerComponent implements OnInit, OnDestroy {

  test$: Observable<ResponseInterface<TestInterface>>;
  data: TestDataInterface;
  mode = this.route.snapshot.data['mode'];
  _sub = new Subscription();
  errors: string[] = [];
  courseName: string;
  categoryName: string;
  uuid: string

  fileName: any;
  file: File | any = null;
  testList: any;
  isApiCalling = false;



  constructor(
    private testsRepo: TestsRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _location:Location
  ) { }

  ngOnInit(): void {
    // this.courseName = window.sessionStorage.getItem('courseName');
    // this.categoryName = window.sessionStorage.getItem('categoryName');
    // this.uuid = window.sessionStorage.getItem('cUuid')

    this.courseName = window.localStorage.getItem('courseName');
    this.categoryName = window.localStorage.getItem('categoryName');
    this.uuid = window.localStorage.getItem('cUuid')

    this.data = {
      categories: [],
      courses: [],
      questions: [],
      subjects: [],
    };

    // this._sub.add(this.bindTestCategoriesData());
    // this._sub.add(this.bindQuestionsData());
    // this._sub.add(this.bindCoursesData());
    // this._sub.add(this.bindSubjectsData());

    if (this.mode === 'edit') {
      this.test$ = this.getTestByUuid();
      // this.getTestByUuid().subscribe(data=>{
      //   console.log('data',data);

      // })
    }


  }

  getTestByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        console.log(params.get('uuid'));
        return this.testsRepo.getTestsByUuid(this.uuid, params.get('uuid'));
      })
    );
  }

  // bindTestCategoriesData() {

  //   this.categoriesRepo.getAllTSCategories().subscribe(
  //     (res) => {
  //       this.data.categories = res?.response;
  //       console.log('this.data.categories',this.data.categories);

  //     },
  //   )

  // }

  // bindQuestionsData() {

  //   this.questionsRepo.getAllQuestions().subscribe(
  //     (res) => {
  //       this.data.questions = res?.response;
  //     },
  //   )

  // }

  // bindCoursesData() {
  //   this.coursesRepo.getAllCourses().subscribe(
  //     (res) => {
  //       this.data.courses = res?.response;
  //     }
  //   )
  // }

  // bindSubjectsData() {
  //   this.syllabusRepo.getAllSubjects().subscribe(
  //     (res) => this.data.subjects = res
  //   )
  // }

  submit(data: any) {
    this.isApiCalling = true;
    let suggestedTest = {
      uuid: uuid.v4(),
      // categoryId: sessionStorage.getItem('categoryId'),
      // courseId: sessionStorage.getItem('courseId'),
      categoryId: localStorage.getItem('categoryId'),
      courseId: localStorage.getItem('courseId'),
      testUuid: data.tests.uuid,
      status: data.tests.flags.suggested,
      createdOn: new Date().toISOString().toString(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    }

    if (this.mode === 'add') {
      console.log('data', data);

      this.testsRepo.addTests(data).subscribe(
        (res) => {
          this.isApiCalling = false;
          console.log({ res });
          if (res.response) {
            if (suggestedTest?.status) {
              this.testsRepo.suggestedTests(suggestedTest).subscribe(data => { })
            }
          }
          console.log('resultresult', res);
          this._location.back();

          // this.router.navigateByUrl('/test-series/categories/list');
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      )

    } else {
      this.testsRepo.editTestsByUuid(data).subscribe(
        (res) => {
          this.isApiCalling = false;
          if (res.ok) {
            this.testsRepo.suggestedTests(suggestedTest).subscribe(data => { })
          }
          console.log({ res });
          this._location.back();

          // this.router.navigateByUrl('/test-series/categories/list');
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

  backToCategories() {
    this.router.navigate(['/test-series/categories/list']);
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
      this.testList = JSON.parse(fileReader.result);
      this.testList.map(res => {
        let cData = {
          uuid: res.category_uuid,
          tests: {
            uuid: uuid.v4(),
            title: res.title,
            imgUrl: res.image_Url ? res.image_Url : '',
            subjects: res.subject_id,
            que: [],
            count: 0,
            description: res.description,
            time: res.exam_time,
            order: Number(res.order),
            scheduledDate: new Date(),
            expiryDate: null,
            scheduledTime: null,
            expiryTime: null,
            pdf: res.pdf_path ? res.pdf_path : '',
            createdOn: new Date().toISOString().toString(),
            modifiedOn: null,
            positiveMarks: 1,
            negativeMarks: 0,
            status: 0,
            testStatus: 0,
            testType: "permanent",
            createdBy: {
              uuid: localStorage.getItem('currentUserUuid'),
              name: localStorage.getItem('currentUserName'),
            },
            flags: {
              active: true,
              paid: true,
              editable: true,
              suggested: true,
              subscribed: true,
            }
          }
        }
        array.push(cData)

      })

      console.log(array);

      array.map(res => {
        this.testsRepo.addTests(res).subscribe(data => {
          if (data) {
            console.log(data);
          }
        })
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }


}
