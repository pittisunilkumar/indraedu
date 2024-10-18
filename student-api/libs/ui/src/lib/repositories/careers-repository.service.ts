import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CareerInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class CareersRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addCareer(career: CareerInterface): Observable<any> {
    return this.http.post(this.baseUrl + `portal/careers`, career);
  }

  getAllCareers(): Observable<any> {
    return this.http.get(this.baseUrl + 'portal/careers');
  }

  getCareerByUuid(careerUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `portal/careers/${careerUuid}`);
  }

  deleteCareerByUuid(careerUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `portal/careers/${careerUuid}`);
  }

  editCareerByUuid(career: CareerInterface): Observable<any> {
    return this.http.put(this.baseUrl + `portal/careers/${career.uuid}`, career);
  }

}
