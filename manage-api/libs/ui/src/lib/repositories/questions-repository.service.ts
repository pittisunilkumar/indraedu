import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { QuestionInterface, ResponseInterface,QbankQuestionInterface, QBankSubjectInterface, TestSeriesQuestionInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionsRepositoryService {

  baseUrl = '';
  private headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('access_token') });


  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

 

  getAllQBankSubjects(): Observable<ResponseInterface<QBankSubjectInterface[]>> {
    return this.http.get<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects`);
  }

  getAllQuestions(): Observable<ResponseInterface<QuestionInterface[]>> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'questions');
  }
  getAllQuestionsBySubjectId(id): Observable<any> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'questions/bySyllabusId/' + id);
  }
  
  getAllQuestionsByCourseId(id): Observable<any> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'courses/' + id);
  }
  getAllQuestionsBySyllabusId(syllabusId: string): Observable<ResponseInterface<QuestionInterface[]>> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + `questions/bySyllabusId/${syllabusId}`);
  }

  findOne(uuid: string): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.get<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/${uuid}`);
  }

  addQuestion(payload: any): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions', payload);
  }

  addManyQuestions(payload: any): Observable<ResponseInterface<QuestionInterface>> {
    console.log('payload',payload);
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions/insertMany/questions', payload);
  }

  updateShortTitle(payload: any): Observable<ResponseInterface<QuestionInterface>> {
    console.log('payload',payload);
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions/updateShortTitle', payload);
  }

  editQuestion(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.put<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/${payload.uuid}`, payload);
  }

  editQuestionByJsonFile(payload: any): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.put<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/bulk/${payload.uuid}`, payload);
  }

  removeQuestion(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.delete<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/${payload.uuid}`);
  }

  // assignToPeral(payload: any): Observable<ResponseInterface<any>> {
  //   return this.http.put<ResponseInterface<any>>(this.baseUrl + `questions/assignPeral/${payload.peralId}`, payload);
  // }

  //new

  qbankAddQuestion(payload: QbankQuestionInterface): Observable<ResponseInterface<QbankQuestionInterface>> {
    return this.http.post<ResponseInterface<QbankQuestionInterface>>(this.baseUrl + 'questions/qbankAddQuestions', payload);
  }
  qbankBulkQuestion(payload: QbankQuestionInterface): Observable<ResponseInterface<QbankQuestionInterface>> {
    return this.http.post<ResponseInterface<QbankQuestionInterface>>(this.baseUrl + 'questions/bulk/qbankQuestions', payload);
  }
  testSeriesAddQuestion(payload: TestSeriesQuestionInterface): Observable<ResponseInterface<TestSeriesQuestionInterface>> {
    return this.http.post<ResponseInterface<TestSeriesQuestionInterface>>(this.baseUrl + 'questions/testSeriesAddQuestions', payload);
  }

  testBulkQuestion(payload: TestSeriesQuestionInterface): Observable<ResponseInterface<TestSeriesQuestionInterface>> {
    return this.http.post<ResponseInterface<TestSeriesQuestionInterface>>(this.baseUrl + 'questions/bulk/testQuestions', payload);
  }


  CheckQuestionBeforeAdd(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions/checkQuestionBeforeAdd', payload);
  }

  getAllQuestionsByMultipleSubjectId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'test-series/questions' , inputBody);
  }

  paginatedQuestionsBySubject(data): Observable<any> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + `test-series/paginate?page=${data.page}&limit=${data.limit}&search=${data.search}${data.subjectIds}`);
  }
  // getStudentsPerPage(data): Observable<ResponseInterface<any>> {
  //   return this.http.get<ResponseInterface<any>>(this.baseUrl + `users/paginate?page=${data.page}&limit=${data.limit}&search=${data.search}`);
  // }


  mcqOfTheDay(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'mcqoftheday' , inputBody);
  }

  viewMcqOfTheDay(): Observable<any> {
    return this.http.get<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'mcqoftheday' );
  }
  updateMcqStatus(id,status): Observable<any> {
    return this.http.put(this.baseUrl + `mcqoftheday/status/${id}`,status);
  }


  searchQuestion(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'questions/questionSearch' , inputBody);
  }

  brachIOQuestion(inputBody) {
    return this.http.post(this.baseUrl + 'users/generateBranchIoLink' , inputBody);
  }
}
