import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, SyllabusInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SyllabusRepositoryService {

  baseUrl = '';
  syllabusList;
  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllSyllabus(): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus');
  }

  getOnlySubjects(): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus/subjects/search');
  }

  onlySubjects(): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus/only/subjects');
  }

  onlyChapters(): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus/only/chapters');
  }

  GetSubjectsAndChapters(): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus/getSubjectsAndChapters');
  }
  getSubjectOrChapterList(uuid: string): Observable<ResponseInterface<SyllabusInterface>> {
    return this.http.get<ResponseInterface<SyllabusInterface>>(this.baseUrl + 'syllabus/getSubject/ChapterList/' + uuid);
  }

  


  getAllSubjectsFromQbank(id): Observable<any> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'courses/' + id);
  }

  getAllSubjects(): Observable<SyllabusInterface[]> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus').pipe(
      map(data => data.response.filter(it => it.type === 'SUBJECT'))
    )
  }

  getACtiveSubjects(): Observable<SyllabusInterface[]> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + 'syllabus/active/subjects').pipe(
      map(data => data.response.filter(it => it.type === 'SUBJECT'))
    )
  }

  getAllVideoSubjectsByCourseID(courseId: string): Observable<ResponseInterface<SyllabusInterface[]>> {
    return this.http.get<ResponseInterface<SyllabusInterface[]>>(this.baseUrl + `videos/subjects/courses/${courseId}`);
  }

  getSyllabusByUuid(uuid: string): Observable<ResponseInterface<SyllabusInterface>> {
    return this.http.get<ResponseInterface<SyllabusInterface>>(this.baseUrl + 'syllabus/' + uuid);
  }

  addSyllabus(payload: SyllabusInterface): Observable<ResponseInterface<SyllabusInterface>> {
    return this.http.post<ResponseInterface<SyllabusInterface>>(this.baseUrl + 'syllabus', payload);
  }

  removeSyllabus(payload: SyllabusInterface): Observable<ResponseInterface<SyllabusInterface>> {
    return this.http.delete<ResponseInterface<SyllabusInterface>>(this.baseUrl + `syllabus/${payload.uuid}`);
  }

  editSyllabus(payload: SyllabusInterface): Observable<ResponseInterface<SyllabusInterface>> {
    return this.http.put<ResponseInterface<SyllabusInterface>>(this.baseUrl + `syllabus/${payload.uuid}`, payload);
  }
}
