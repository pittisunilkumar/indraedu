import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PearlsInputInterface, PeralInputSubjectInterface, ResponseInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeralsService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }
  
  getAllPerals(): Observable<ResponseInterface<PearlsInputInterface[]>> {
    return this.http.get<ResponseInterface<PearlsInputInterface[]>>(this.baseUrl + 'pearls');
  }

  getPeralByUuid(uuid: string): Observable<ResponseInterface<PearlsInputInterface>> {
    return this.http.get<ResponseInterface<PearlsInputInterface>>(this.baseUrl + 'pearls/' + uuid);
  }

  getPeralById(id: string): Observable<ResponseInterface<PearlsInputInterface>> {
    return this.http.get<ResponseInterface<PearlsInputInterface>>(this.baseUrl + 'pearls/' + id);
  }

  addPeral(payload: PearlsInputInterface): Observable<ResponseInterface<PearlsInputInterface>> {
    return this.http.post<ResponseInterface<PearlsInputInterface>>(this.baseUrl + 'pearls', payload);
  }

  editPeral(perals: PearlsInputInterface): Observable<ResponseInterface<PearlsInputInterface>>  {
    return this.http.put<ResponseInterface<PearlsInputInterface>>(this.baseUrl + `pearls/${perals.uuid}`, perals);
  }

  removePeral(payload: PearlsInputInterface): Observable<ResponseInterface<PearlsInputInterface>> {
    return this.http.delete<ResponseInterface<PearlsInputInterface>>(this.baseUrl + `pearls/${payload.uuid}`);
  }

  viewQuestions(uuid: string): Observable<ResponseInterface<PearlsInputInterface>> {
    return this.http.get<ResponseInterface<PearlsInputInterface>>(this.baseUrl + 'pearls/questions/' + uuid);
  }


  assignSubject(payload: PeralInputSubjectInterface): Observable<ResponseInterface<PeralInputSubjectInterface>> {
    return this.http.post<ResponseInterface<PeralInputSubjectInterface>>(this.baseUrl + 'pearlsubjects', payload);
  }
  editAssignSubject(payload: any): Observable<ResponseInterface<PeralInputSubjectInterface>> {
    return this.http.post<ResponseInterface<PeralInputSubjectInterface>>(this.baseUrl + 'pearlsubjects/getSubjectsAndChapters', payload);
  }
  updateAssignSubject(perals: PeralInputSubjectInterface): Observable<ResponseInterface<PeralInputSubjectInterface>>  {
    return this.http.post<ResponseInterface<PeralInputSubjectInterface>>(this.baseUrl + `pearlsubjects/updatePearlSubjects`, perals);
  }


}
