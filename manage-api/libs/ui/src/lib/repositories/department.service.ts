import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addDepartment(event: any): Observable<any> {
    return this.http.post(this.baseUrl + `department`, event);
  }

  getAllDepartments(): Observable<any> {
    return this.http.get(this.baseUrl + 'department');
  }

  getAllActiveDepartments(): Observable<any> {
    return this.http.get(this.baseUrl + 'department/activeDepartments');
  }

  getDepartmentByUuid(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `department/${uuid}`);
  }

  deleteEventByUuid(tagUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `department/${tagUuid}`);
  }

  editDepartmentByUuid(event: any): Observable<any> {
    return this.http.put(this.baseUrl + `department/${event.uuid}`, event);
  }

  getAllTickets(request): Observable<any> {
    return this.http.post(this.baseUrl + `department/allTickets`, request);
  }
  sendRepay(request): Observable<any> {
    return this.http.post(this.baseUrl + `department/send-reply`, request);
  }
  updateTicket(request): Observable<any> {
    return this.http.put(this.baseUrl + `department/updateTicket/status`, request);
  }

  getTicketByUUid(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `department/ticket/${uuid}`);
  }
}
