import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QBankSubjectChapterInterface, QBankSubjectInterface, TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { QBankRepositoryService, TestCategoriesRepositoryService, TestsRepositoryService } from '@application/ui';
import * as uuid from 'uuid';
import { Location } from '@angular/common';

@Component({
  selector: 'application-copy-questions',
  templateUrl: './copy-questions.component.html',
  styleUrls: ['./copy-questions.component.less']
})
export class CopyQuestionsComponent implements OnInit {
  payload: any;
  subjectList: any;
  subjects: QBankSubjectInterface[];


  chaptersList: QBankSubjectChapterInterface[];
  topicList: QBankSubjectChapterInterface[];
  mode: string;
  type: string;
  toSubject: QBankSubjectInterface;
  topicsData: any = [];
  questionsData: any = [];

  subjectUuid: string;
  chapterUuid: string;
  topicUuid: string
  selectedListChapters: any = [];
  selectedListTopics: any = [];
  selectedListQuetions: any = [];


  selectedQuetionsToTestSeries: any = [];
  copyPath = "qbank"

  categoryList: any;
  categories: TestCategoryInterface[];
  selectedListTests: any = [];
  questionsDataToTestSeries: any = [];
  toCategory: TestCategoryInterface;
  toTest: TestCategoryInterface;
  testList: TestInterface[];

  form = new FormGroup({
    toSubject: new FormControl(''),
    toChapter: new FormControl(''),
    toTopic: new FormControl(''),
  })
  errors: string[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, copyMode: string, type: string },
    private qbankRepo: QBankRepositoryService,
    private _location: Location,
    private testsRepo: TestsRepositoryService,
    private testCategoriesRepo: TestCategoriesRepositoryService,
  ) { }

  ngOnInit(): void {
    // this.subjectUuid = window.sessionStorage.getItem('subjectUuid');
    // this.chapterUuid = window.sessionStorage.getItem('chapteruuid');
    // this.topicUuid = window.sessionStorage.getItem('topicUuid');

    this.subjectUuid = window.localStorage.getItem('subjectUuid');
    this.chapterUuid = window.localStorage.getItem('chapteruuid');
    this.topicUuid = window.localStorage.getItem('topicUuid');
    this.payload = this.data.payload;
    this.mode = this.data.copyMode;
    this.type = this.data.type;

    this.qbankRepo.getAllQBankSubjects().subscribe(
      (res) => {
        this.subjectList = res.response;
        this.subjects = res.response;
      }
    );
  }

  syllabusFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.subjects = this.subjectList.filter((question) => {
        return (
          question.syllabus.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          question.courses.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.subjects = this.subjectList;
    }
  }

  getChapters(chapter) {
    this.toSubject = chapter;
    this.qbankRepo.getQBankSubjectsByUuid(chapter.uuid).subscribe(res => {
      this.chaptersList = res.response.chapters;
      this.payload.map(res => {
        const arr = this.chaptersList.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedListChapters?.push(res);
        }
      })
    })
    console.log(this.selectedListChapters);
  }
  getTopics(topics) {
    this.topicList = topics.topics;
    this.payload.map(res => {
      const arr = this.topicList.filter(it => it.title === res.title);
      if (!arr?.length) {
        this.selectedListTopics?.push(res);
      }
    })
    console.log(' this.topicUuid ', this.topicUuid);
    this.topicList = this.topicList.filter((res) => {
      return res.uuid != this.topicUuid
    })
    console.log(this.topicList);
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
    let value = this.form.value
    let topicCount = 0;
    this.selectedListTopics.map((res, i) => {
      let data = {
        uuid: uuid.v4(),
        title: res.title,
        description: res.description,
        order: res.order,
        scheduledDate: res.scheduledDate,
        pdf: res.pdf,
        image: res.image,
        icon: res.icon,
        flags: res.flags,
        que: res.que,
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }
      this.topicsData.push(data)
    })

    this.selectedListQuetions.map(res => {
      let que = {
        uuid: res.uuid,
        order: res.order,
      }
      this.questionsData.push(que)
    })

    if (this.type == 'copy') {
      if (this.mode == 'questions') {
        let questionsPayload = {
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          to_topic: value.toTopic.uuid,
          que: this.questionsData
        }
        this.qbankRepo.copyQuetions(questionsPayload).subscribe(data => { })
      }
      else if (this.mode == 'topics') {
        let topicsPayload = {
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          count: this.selectedListTopics.length,
          topics: this.topicsData
        }
        console.log('topicsPayload', topicsPayload);
        this.qbankRepo.copyTopics(topicsPayload).subscribe(data => { })
      }
      else if (this.mode == 'chapters') {
        this.selectedListChapters.map((res, i) => {
          topicCount += res.topics.length
        })
        let chaptersPayload = {
          to_subject: this.toSubject.uuid,
          count: topicCount,
          chapters: this.selectedListChapters
        }
        this.qbankRepo.copyChapters(chaptersPayload).subscribe(data => { })
      }
    }

    else if (this.type == 'move') {
      if (this.mode == 'questions') {
        let fromQue: string[] = [];
        this.payload.map((res, i) => {
          fromQue.push(res.uuid)
        })
        let questionsPayload = {
          from_subject: this.subjectUuid,
          from_chapter: this.chapterUuid,
          from_topic: this.topicUuid,
          from_que: fromQue,
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          to_topic: value.toTopic.uuid,
          que: this.questionsData
        }
        this.qbankRepo.moveQuetions(questionsPayload).subscribe(data => { })
      }
      else if (this.mode == 'topics') {
        let fromTopic: string[] = [];
        this.payload.map((res, i) => {
          fromTopic.push(res.uuid)
        })
        let topicsPayload = {
          from_subject: this.subjectUuid,
          from_chapter: this.chapterUuid,
          from_topic: fromTopic,
          count: this.selectedListTopics.length,
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          topics: this.topicsData
        }
        console.log('topicsPayload', topicsPayload);
        this.qbankRepo.moveTopics(topicsPayload).subscribe(data => { })
      }
      else if (this.mode == 'chapters') {
        this.selectedListChapters.map((res, i) => {
          topicCount += res.topics.length
        })
        let fromChapter: string[] = [];
        this.payload.map((res, i) => {
          fromChapter.push(res.uuid)
        })
        let chaptersPayload = {
          from_subject: this.subjectUuid,
          from_chapter: fromChapter,
          count: topicCount,
          to_subject: this.toSubject.uuid,
          chapters: this.selectedListChapters
        }
        this.qbankRepo.moveChapters(chaptersPayload).subscribe(data => { })
      }
    }
    // this._location.back();
    window.location.reload();
  }

  ///////////////// Test Series //////////////////

  getType(event) {
    this.copyPath = event.value;
    if (this.copyPath == "test_series") {
      this.testCategoriesRepo.getAllTSCategories().subscribe(
        (res) => {
          this.categoryList = res.response;
          this.categories = res.response;
        }
      );
    }
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
    this.testCategoriesRepo.getTestsByUuid(this.toCategory.uuid).subscribe(res => {
      this.testList = res.response[0].categories.tests;
      // this.payload.map(res => {
      //   const arr = this.testList.filter(it => it.uuid === res.uuid);
      //   if (!arr?.length) {
      //     this.selectedListTests?.push(res);
      //   }
      // })
    })
    // this.testList = tests.categories.tests;


    // this.payload.map(res => {
    //   const arr = this.testList.filter(it => it.uuid === res.uuid);
    //   if (!arr?.length) {
    //     this.selectedListTests?.push(res);
    //   }
    // })
    // console.log('this.selectedListTests', this.selectedListTests);
  }

  getTSQuestions(questions) {
    this.toTest = questions
    console.log('quetions', questions);

    this.payload.map(res => {
      const arr = questions.que.filter(it => it.uuid === res.uuid);
      if (!arr?.length) {
        this.selectedQuetionsToTestSeries?.push(res);
      }
    })
    console.log(this.selectedQuetionsToTestSeries);
  }



  submitToTestSeries() {
    this.selectedQuetionsToTestSeries.map(res => {
      let que = {
        uuid: res.uuid,
        order: res.order,
        positive: 1,
        negative: 0
      }
      this.questionsDataToTestSeries.push(que)
    })
    if (this.type == 'copy') {
      let questionsPayload = {
        uuid: this.toCategory.uuid,
        to_test: this.toTest.uuid,
        que: this.questionsDataToTestSeries
      }
      console.log('questionsPayload', questionsPayload);
      this.testsRepo.copyQuestions(questionsPayload).subscribe(data => { })
    }
    window.location.reload();
  }

}
