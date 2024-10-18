import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }
  //////////////////////////   STATE    ////////////////////////////////////

  createFeedback(request: any): Observable<any> {
    return this.http.post(this.baseUrl + `feedback`, request);
  }

  getFeedbacks(): Observable<any> {
    return this.http.get(this.baseUrl + 'feedback');
  }

  getActiveFeedbacks(): Observable<any> {
    return this.http.get(this.baseUrl + 'feedback/active');
  }

  findFeedback(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `feedback/${uuid}`);
  }

  deleteFeedback(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + `feedback/${id}`);
  }

  updateFeedback(request: any): Observable<any> {
    return this.http.put(this.baseUrl + `feedback`, request);
  }
}
