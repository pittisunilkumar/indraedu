import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { QuestionInterface, ResponseInterface,QbankQuestionInterface, QBankSubjectInterface, TestSeriesQuestionInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionsRepositoryService {

  baseUrl = '';

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

  addQuestion(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions', payload);
  }

  editQuestion(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.put<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/${payload.uuid}`, payload);
  }

  removeQuestion(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.delete<ResponseInterface<QuestionInterface>>(this.baseUrl + `questions/${payload.uuid}`);
  }

  //new

  qbankAddQuestion(payload: QbankQuestionInterface): Observable<ResponseInterface<QbankQuestionInterface>> {
    return this.http.post<ResponseInterface<QbankQuestionInterface>>(this.baseUrl + 'questions/qbankAddQuestions', payload);
  }
  testSeriesAddQuestion(payload: TestSeriesQuestionInterface): Observable<ResponseInterface<TestSeriesQuestionInterface>> {
    return this.http.post<ResponseInterface<TestSeriesQuestionInterface>>(this.baseUrl + 'questions/testSeriesAddQuestions', payload);
  }


  CheckQuestionBeforeAdd(payload: QuestionInterface): Observable<ResponseInterface<QuestionInterface>> {
    return this.http.post<ResponseInterface<QuestionInterface>>(this.baseUrl + 'questions/checkQuestionBeforeAdd', payload);
  }

  getAllQuestionsByMultipleSubjectId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QuestionInterface[]>>(this.baseUrl + 'test-series/questions' , inputBody);
  }

}
