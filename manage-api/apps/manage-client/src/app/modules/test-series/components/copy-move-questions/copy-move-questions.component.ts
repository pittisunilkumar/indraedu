import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as uuid from 'uuid';
import { Location } from '@angular/common';
import { TestCategoriesRepositoryService, TestsRepositoryService } from '@application/ui';
import { TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'application-copy-move-questions',
  templateUrl: './copy-move-questions.component.html',
  styleUrls: ['./copy-move-questions.component.less']
})
export class CopyMoveQuestionsComponent implements OnInit {
  payload: any;
  mode: string;
  type: string;
  errors: string[];
  testUuid: string;
  uuid: string;

  categoryList: any;
  categories: TestCategoryInterface[];
  toCategory: TestCategoryInterface;
  testList: TestInterface[];
  selectedListTests: any = [];
  selectedListQuetions: any = [];
  questionsData: any = [];

  form = new FormGroup({
    toCategory: new FormControl(''),
    toTest: new FormControl(''),
  })


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, copyMode: string, type: string },
    private _location: Location,
    private testsRepo: TestsRepositoryService,
    private testCategoriesRepo: TestCategoriesRepositoryService,
  ) { }

  ngOnInit(): void {
    // this.uuid = window.sessionStorage.getItem('cUuid');
    // this.testUuid = window.sessionStorage.getItem('testUuid');
    this.uuid = window.localStorage.getItem('cUuid');
    this.testUuid = window.localStorage.getItem('testUuid');
    this.payload = this.data.payload;
    this.mode = this.data.copyMode;
    this.type = this.data.type;

    this.testCategoriesRepo.getAllTSCategories().subscribe(
      (res) => {
        this.categoryList = res.response;
        this.categories = res.response;
      }
    );
  }

  categoryFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.categories = this.categoryList.filter((cat) => {
        return (
          cat.categories.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          cat.courses.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.categories = this.categoryList;
    }
  }

  getTests(tests) {
    this.toCategory = tests;
    // this.toCategory.uuid
    this.testCategoriesRepo.getTestsByUuid(this.toCategory.uuid).subscribe(res => {
      this.testList = res.response[0].categories.tests;
      this.payload.map(res => {
        const arr = this.testList.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedListTests?.push(res);
        }
      })
    })
    // this.testList = tests.categories.tests;

    // this.payload.map(res => {
    //   const arr = this.testList.filter(it => it.uuid === res.uuid);
    //   if (!arr?.length) {
    //     this.selectedListTests?.push(res);
    //   }
    // })
    // this.testList = this.testList.filter((res) => {
    //   return res.uuid != this.testUuid
    // })
    console.log('this.selectedListTests', this.selectedListTests);
  }

  getQuestions(quetions) {
    this.payload.map(res => {
      const arr = quetions.que.filter(it => it.uuid === res.uuid);
      if (!arr?.length) {
        this.selectedListQuetions?.push(res);
      }
    })
    console.log(this.selectedListQuetions);
  }

  submit() {
    let value = this.form.value;
    this.selectedListQuetions.map(res => {
      let que = {
        uuid: res.uuid,
        order: res.order,
        positive: res.positive,
        negative: res.negative,
      }
      this.questionsData.push(que)
    })
    let testData= []
    this.selectedListTests.map(res=>{
      let data = {
        uuid: uuid.v4(),
        count:res.count,
        expiryDate:res.expiryDate,
        expiryTime:res.expiryTime,
        title: res.title,
        description: res.description,
        order: res.order,
        scheduledDate: res.scheduledDate,
        scheduledTime:res.scheduledTime,
        pdf: res.pdf,
        imgUrl: res.imgUrl,
        flags: res.flags,
        que: res.que,
        negativeMarks:res.negativeMarks,
        positiveMarks:res.positiveMarks,
        subjects:res.subjects,
        suggestedBanner:res.suggestedBanner,
        status:res.status,
        testStatus:res.testStatus,
        testType:res.testType,
        time:res.time,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      testData.push(data)
    })


    if (this.type == 'copy') {
      if (this.mode == 'questions') {
        let questionsPayload = {
          uuid: this.toCategory.uuid,
          to_test: value.toTest.uuid,
          que: this.questionsData
        }
        console.log('questionsPayload', questionsPayload);
        this.testsRepo.copyQuestions(questionsPayload).subscribe(data => { })
      }
      else if (this.mode == 'tests') {
        let testPayload = {
          uuid: this.toCategory.uuid,
          tests: testData
        }
        console.log('testPayload', testPayload);
        this.testsRepo.copyTests(testPayload).subscribe(data => { })
      }
    }
    else if (this.type == 'move') {
      if (this.mode == 'questions') {
        let fromQue: string[] = [];
        this.payload.map((res, i) => {
          fromQue.push(res.uuid)
        })
        let questionsPayload = {
          uuid: this.uuid,
          from_test: this.testUuid,
          from_que: fromQue,
          to_uuid: this.toCategory.uuid,
          to_test: value.toTest.uuid,
          que: this.questionsData
        }
        console.log('questionsPayload', questionsPayload);
        this.testsRepo.moveQuestions(questionsPayload).subscribe(data => { })
      }
      else if (this.mode == 'tests') {
        let fromTest: string[] = [];
        this.payload.map((res, i) => {
          fromTest.push(res.uuid)
        })
        let testPayload = {
          uuid: this.uuid,
          from_test: fromTest,
          to_uuid: this.toCategory.uuid,
          tests: testData
        }
        console.log('testPayload', testPayload);
        this.testsRepo.moveTests(testPayload).subscribe(data => { })
      }
    }
    window.location.reload();
  }

}
