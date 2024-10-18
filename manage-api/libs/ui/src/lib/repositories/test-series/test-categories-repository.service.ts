
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TestCategoryInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class TestCategoriesRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addTSCategories(testCategory: TestCategoryInterface): Observable<any> {
    return this.http.post(this.baseUrl + `ts/categories`, testCategory);
  }

  getAllTSCategories(): Observable<any> {
    return this.http.get(this.baseUrl + `ts/categories`);
  }

  // subjectsByCourseIds(course: any): Observable<any> {
  //   return this.http.post(this.baseUrl + `ts/categories/subjectsByCourseIds`,course);
  // }

  getTestsByCourseId(courseId: string): Observable<any> {
    return this.http.get(this.baseUrl + `ts/categories/courses/${courseId}`);
  }

  getTSCategoriesByUuid(testCategoryUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `ts/categories/${testCategoryUuid}`);
  }

  getTestsByUuid(testCategoryUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `ts/categories/tests/${testCategoryUuid}`);
  }

  deleteTSCategoriesByUuid(testCategoryUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `ts/categories/${testCategoryUuid}`);
  }

  editTSCategoriesByUuid(
    testCategory: TestCategoryInterface
  ): Observable<any> {
    return this.http.put(this.baseUrl + `ts/categories/${testCategory.uuid}`, testCategory);
  }

  resetAttemptedTests(payload): Observable<any> {
    return this.http.post(this.baseUrl + `ts/categories/reset-test`, payload);
  }
}
