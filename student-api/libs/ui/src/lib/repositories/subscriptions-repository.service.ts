import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, SubscriptionInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class SubscriptionsRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllSubscriptions(): Observable<ResponseInterface<SubscriptionInterface[]>> {
    return this.http.get<ResponseInterface<SubscriptionInterface[]>>(this.baseUrl + 'subscriptions');
  }

  getActiveSubcriptions(): Observable<ResponseInterface<SubscriptionInterface[]>> {
    return this.http.get<ResponseInterface<SubscriptionInterface[]>>(this.baseUrl + 'subscriptions/sub/getSubcriptionsGreaterToday');
  }

  getSubscriptionByUuid(uuid: string): Observable<ResponseInterface<SubscriptionInterface>> {
    return this.http.get<ResponseInterface<SubscriptionInterface>>(this.baseUrl + 'subscriptions/' + uuid);
  }

  // editSubscriptionByUuid(uuid: string): Observable<ResponseInterface<SubscriptionInterface>> {
  //   return this.http.get<ResponseInterface<SubscriptionInterface>>(this.baseUrl + 'subscriptions/edit/' + uuid);
  // }

  addSubscription(payload: SubscriptionInterface): Observable<ResponseInterface<SubscriptionInterface>> {
    return this.http.post<ResponseInterface<SubscriptionInterface>>(this.baseUrl + 'subscriptions', payload);
  }

  removeSubscription(payload: SubscriptionInterface): Observable<ResponseInterface<SubscriptionInterface>> {
    return this.http.delete<ResponseInterface<SubscriptionInterface>>(this.baseUrl + `subscriptions/${payload.uuid}`);
  }

  editSubscription(payload: SubscriptionInterface): Observable<ResponseInterface<SubscriptionInterface>> {
    return this.http.put<ResponseInterface<SubscriptionInterface>>(this.baseUrl + `subscriptions/update/${payload.uuid}`, payload);
  }

  getSubscriptionByCourseId(uuid: string): Observable<ResponseInterface<SubscriptionInterface>> {
    return this.http.get<ResponseInterface<SubscriptionInterface>>(this.baseUrl + 'subscriptions/courses/' + uuid);
  }


}
