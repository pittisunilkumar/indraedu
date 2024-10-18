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

  getPeralQBankSubjects(): Observable<ResponseInterface<QBankSubjectInterface[]>> {
    return this.http.get<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/perals/qbankSubjects`);
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

  getVideoChapterBySubjectId(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `Syllabus/fetChapters/videos`, inputBody);

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

  dragAndDropQBQuestions(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/dragAndDropQBQuestions`, inputBody);
  }
  dragAndDropQBTopics(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/dragAndDropQBTopics`, inputBody);
  }

  dragAndDropQBChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/dragAndDropQBChapters`, inputBody);
  }

  dragAndDropQBSubjects(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<QBankSubjectInterface[]>>(this.baseUrl + `qbank/subjects/dragAndDropQBSubjects`, inputBody);
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

  resetQbankTopic(userId:any,payload: any) {
    return this.http.post(this.baseUrl + `qbank/resetUser/${userId}`, payload);
  }




  addQBankTests(topic: QBankInterface): Observable<ResponseInterface<QBankInterface>> {
    return this.http.post<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/${topic.subject.uuid}/tests`, topic);
  }

  addBulkQBankTests(topics: any): Observable<ResponseInterface<QBankInterface>> {
    return this.http.post<ResponseInterface<QBankInterface>>(this.baseUrl + `qbank/subjects/bulkTests`, topics);
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

   /////////////////////////// Suggested Topics////////////////////////////////////
 suggestedTopics(videos: any): Observable<any> {
  return this.http.post(this.baseUrl + `suggestedqbank`, videos);
}
getAllSuggestedQBTopics(): Observable<any> {
  return this.http.get(this.baseUrl + 'suggestedqbank');
}
updateSuggestedQbankStatus(id,status): Observable<any> {
  return this.http.put(this.baseUrl + `suggestedqbank/status/${id}`,status);
}

}
