import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { QBankInterface, QBankSubjectInterface, ResponseInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class QBankRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addQBankSubjects(testSeries: QBankSubjectInterface): Observable<ResponseInterface<QBankSubjectInterface>> {
    return this.http.post<ResponseInterface<QBankSubjectInterface>>(this.baseUrl + `qbank/subjects`, testSeries);
  }

  addQBank(testSeries: any): Observable<ResponseInterface<QBankSubjectInterface>> {
    return this.http.post<ResponseInterface<QBankSubjectInterface>>(this.baseUrl + `qbank`, testSeries);
  }


  getAllQBankSubjects(): Observable<ResponseInterface<QBankSubjectInterface[]>> {
    return this.http.get<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects`);
  }

  getQBankSubjectsByUuid(subjectUuid: string): Observable<ResponseInterface<QBankSubjectInterface>> {
    return this.http.get<ResponseInterface<QBankSubjectInterface>>(this.baseUrl + `qbank/subjects/${subjectUuid}`);
  }

  // new
  getSubjectsByCourseId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `courses/getqbanksubjects`, inputBody);

  }

  getVideoSubjectsByCourseId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `courses/getvideoubjects`, inputBody);

  }




  // new
  getChapterBySubjectId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `Syllabus/fetChapters`, inputBody);

  }

  getQBankSubjectsByCourseId(courseId: string): Observable<ResponseInterface<QBankSubjectInterface[]>> {
    return this.http.get<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/bycourseId/${courseId}`);
  }

  deleteQBankSubjectsByUuid(subjectUuid: string): Observable<ResponseInterface<QBankSubjectInterface>> {
    return this.http.delete<ResponseInterface<QBankSubjectInterface>>(this.baseUrl + `qbank/subjects/${subjectUuid}`);
  }

  editQBankSubjectsByUuid(subject: QBankSubjectInterface): Observable<ResponseInterface<QBankSubjectInterface>> {
    return this.http.put<ResponseInterface<QBankSubjectInterface>>(this.baseUrl + `qbank/subjects/${subject.uuid}`, subject);
  }


  copyQuetions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/copyQBQuestions`, inputBody);
  }
  copyTopics(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/copyQBTopics`, inputBody);
  }
  copyChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/copyQBChapter`, inputBody);
  }

  moveQuetions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/moveQBQuestions`, inputBody);
  }
  moveTopics(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/moveQBTopics`, inputBody);
  }
  moveChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/moveQBChapters`, inputBody);
  }

  deleteQBankChaptersByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/deleteQBChapters`, inputBody);
  }

  deleteQBankQuetionsByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/deleteQBQuestions`, inputBody);
  }
  deleteQBankTopicsByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/deleteQBTopics`, inputBody);
  }

  reorderQBQuestions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/reorderQBQuestions`, inputBody);
  }




  addQBankTests(topic: QBankInterface): Observable<ResponseInterface<QBankInterface>> {
    return this.http.post<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${topic.subject.uuid}/tests`, topic);
  }
  // getQBankTestsByUuid(subjectUuid: string, topicUuid: string): Observable<ResponseInterface<QBankInterface>> {
  //   return this.http.get<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${subjectUuid}/tests/${topicUuid}`);
  // }

  getQBankTestsByUuid(subjectUuid: string, chapterUuid: string, topicUuid: string): Observable<ResponseInterface<QBankInterface>> {
    return this.http.get<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${subjectUuid}/chapter/${chapterUuid}/tests/${topicUuid}`);
  }
  getQBankTopicsByUuid(subjectUuid: string, chapterUuid: string, topicUuid: string): Observable<ResponseInterface<QBankInterface>> {
    return this.http.get<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/qbsubject/${subjectUuid}/chapter/${chapterUuid}/topic/${topicUuid}`);
  }

  deleteTopicQuestion(subjectUuid: string, chapterUuid: string, topicUuid: string, questionUuid: string): Observable<ResponseInterface<QBankInterface>> {
    return this.http.delete<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/qbsubjects/${subjectUuid}/chapters/${chapterUuid}/tests/${topicUuid}/que/${questionUuid}`);
  }


  getQBankTestsByCourseId(courseId: string): Observable<any> {
    return this.http.get(this.baseUrl + `qbank/courses/${courseId}`);
  }

  // subjectsByCourseIds(course: any): Observable<any> {
  //   return this.http.post(this.baseUrl + `qbank/subjectsByCourseIds`,course);
  // }

  deleteQBankTestsByUuid(subjectUuid: string, topicUuid: string): Observable<ResponseInterface<QBankInterface>> {
    return this.http.delete<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/qbanksubjects/${subjectUuid}/tests/${topicUuid}`);
  }


  // editQBankTestsByUuid(test: QBankInterface): Observable<ResponseInterface<QBankInterface>> {
  //   return this.http.put<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${test.subject.uuid}/tests/${test.uuid}`, test);
  // }
  editQBankTestsByUuid(test: QBankInterface): Observable<ResponseInterface<QBankInterface>> {
    return this.http.put<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${test.qbank_subject_uuid}/tests/${test.topic_uuid}`, test);
  }

}
