import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, TestCategoryInterface, TestInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class TestsRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  // addTests(testSeries: TestInterface): Observable<ResponseInterface<TestInterface>> {
  //   return this.http.post<ResponseInterface<TestInterface>>(this.baseUrl + `ts/tests`, testSeries);
  // }

  

  getAllTests(): Observable<ResponseInterface<TestInterface[]>> {
    return this.http.get<ResponseInterface<TestInterface[]>>(this.baseUrl + `ts/tests`);
  }

  // getTestsByUuid(testSeriesUuid: string): Observable<ResponseInterface<TestInterface>> {
  //   return this.http.get<ResponseInterface<TestInterface>>(this.baseUrl + `ts/tests/${testSeriesUuid}`);
  // }

  getTestsByCourseId(courseId: string): Observable<any> {
    return this.http.get(this.baseUrl + `ts/tests/courses/${courseId}`);
  }

  // deleteTestsByUuid(testSeriesUuid: string): Observable<ResponseInterface<TestInterface>> {
  //   return this.http.delete<ResponseInterface<TestInterface>>(this.baseUrl + `ts/tests/${testSeriesUuid}`);
  // }

  // editTestsByUuid(test: TestInterface): Observable<ResponseInterface<TestInterface>> {
  //   return this.http.put<ResponseInterface<TestInterface>>(this.baseUrl + `ts/tests/${test.uuid}`, test);
  // }


  // new apis
  getTSCategoryCourses(inputBody): Observable<any> {
    return this.http.post(this.baseUrl + `ts/categories/getTestSeriesCourses`, inputBody);
  }

  getTSSubjects(inputBody): Observable<any> {
    return this.http.post(this.baseUrl + `courses/getTestSeriessubjects`, inputBody);
  }

  getTSQuestions(inputBody): Observable<any> {
    return this.http.post(this.baseUrl + `test-series/questions`, inputBody);
  }

  getTestsByUuid(uuid: string,testuuid:string): Observable<ResponseInterface<TestInterface>> {
    return this.http.get<ResponseInterface<TestInterface>>(this.baseUrl + `ts/categories/uuid/${uuid}/testuuid/${testuuid}`);
  }

  addTests(testSeries: TestInterface): Observable<ResponseInterface<TestInterface>> {
    return this.http.post<ResponseInterface<TestInterface>>(this.baseUrl + `ts/categories/insertTSTestes`, testSeries);
  }

  editTestsByUuid(test: any): Observable<ResponseInterface<TestInterface>> {
    return this.http.put<ResponseInterface<TestInterface>>(this.baseUrl + `ts/categories/uuid/${test.uuid}/test/${test.tests.uuid}`, test);
  }

  deleteTestsByUuid(uuid:string,testUuid: string): Observable<ResponseInterface<TestInterface>> {
    return this.http.delete<ResponseInterface<TestInterface>>(this.baseUrl + `ts/categories/uuid/${uuid}/test_series/${testUuid}`);
  }

  getQuetionsByTestUuid( uuid: string, testUuid: string): Observable<ResponseInterface<TestInterface>> {
    return this.http.get<ResponseInterface<TestInterface>>(this.baseUrl + `ts/categories/uuid/${uuid}/tsTestuuid/${testUuid}`);
  }


  // getTestssByTSUuid( uuid: string): Observable<ResponseInterface<TestCategoryInterface>> {
  //   return this.http.get<ResponseInterface<TestCategoryInterface>>(this.baseUrl + `ts/categories/tsUuid/${uuid}`);
  // }

  deleteTSQuetionsByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/deleteTSQuestions`, inputBody);
  }
  copyQuestions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/copyTSQuestions`, inputBody);
  }
  copyTests(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/copyTSTests`, inputBody);
  }
  moveQuestions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/moveTSQuestions`, inputBody);
  }
  dragAndDropTSQuestions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/dragAndDropTSQuestions`, inputBody);
  }
  dragAndDropTests(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/dragAndDropTests`, inputBody);
  }
  moveTests(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<TestCategoryInterface[]>>(this.baseUrl + `ts/categories/moveTSTests`, inputBody);
  }

  testAttemptedList(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + `ts/categories/getLeaderBoardUserAnalysis`, inputBody);
  }

  //////////////////// Suggested tests /////////////////////

  suggestedTests(tests: any): Observable<any> {
    return this.http.post(this.baseUrl + `suggestedtests`, tests);
  }

  getAllSuggestedTests(): Observable<any> {
    return this.http.get(this.baseUrl + 'suggestedtests');
  }
  updateSuggestedTestStatus(id,status): Observable<any> {
    return this.http.put(this.baseUrl + `suggestedtests/status/${id}`,status);
  }
  

  // getAllQuestionsByMultipleSubjectId(inputBody): Observable<any> {
  //   return this.http.post<ResponseInterface<TestInterface[]>>(this.baseUrl + 'test-series/questions' , inputBody);
  // }

}
