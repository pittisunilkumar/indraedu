import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  CourseInterface,
  OrganizationInterface,
} from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizationRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllOrganizations(): Observable<any> {
    return this.http.get(this.baseUrl + 'organizations');
  }

  getOrganizationByUuid(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + 'organizations/' + uuid);
  }

  addOrganization(payload: OrganizationInterface): Observable<any> {
    return this.http.post(this.baseUrl + 'organizations', payload);
  }

  removeOrganization(payload: OrganizationInterface): Observable<any> {
    return this.http.delete(this.baseUrl + `organizations/${payload.uuid}`);
  }
}
