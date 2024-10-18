import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AboutInterface, ResponseInterface, UserMessageInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class PortalRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  createAboutUsPage(payload: AboutInterface): Observable<ResponseInterface<AboutInterface>> {
    return this.http.post<ResponseInterface<AboutInterface>>(this.baseUrl + `portal/about`, payload);
  }

  getAboutUsPage(): Observable<any> {
    return this.http.get(this.baseUrl + `portal/about`);
  }

  updateAboutUsPage(payload: AboutInterface): Observable<any> {
    return this.http.put(this.baseUrl + `portal/about`, payload);
  }

  createUserMessage(payload: UserMessageInterface): Observable<ResponseInterface<UserMessageInterface>> {
    return this.http.post<ResponseInterface<UserMessageInterface>>(this.baseUrl + `portal/messages`, payload);
  }

  getUserMessages(): Observable<ResponseInterface<UserMessageInterface[]>> {
    return this.http.get<ResponseInterface<UserMessageInterface[]>>(this.baseUrl + `portal/messages`);
  }

  getUserMessageByUuid(payload: UserMessageInterface): Observable<ResponseInterface<UserMessageInterface>> {
    return this.http.get<ResponseInterface<UserMessageInterface>>(this.baseUrl + `portal/messages`);
  }

  updateUserMessage(payload: UserMessageInterface): Observable<ResponseInterface<UserMessageInterface>> {
    return this.http.put<ResponseInterface<UserMessageInterface>>(this.baseUrl + `portal/messages`, payload);
  }

}
