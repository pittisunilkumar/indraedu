import { HttpClient } from '@angular/common/http';
import {Inject, Injectable } from '@angular/core';
import { EmployeeInterface, ResetEmployeePasswordInterface, ResponseInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRepositoryService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }
  
  getAllEmployees(): Observable<ResponseInterface<EmployeeInterface[]>> {
    return this.http.get<ResponseInterface<EmployeeInterface[]>>(this.baseUrl + 'employee');
  }

  getEmployeeByUuid(uuid: string): Observable<ResponseInterface<EmployeeInterface>> {
    return this.http.get<ResponseInterface<EmployeeInterface>>(this.baseUrl + 'employee/' + uuid);
  }

  addEmployee(payload: EmployeeInterface): Observable<ResponseInterface<EmployeeInterface>> {
    return this.http.post<ResponseInterface<EmployeeInterface>>(this.baseUrl + 'employee', payload);
  }

  editEmployee(employee: EmployeeInterface): Observable<ResponseInterface<EmployeeInterface>>  {
    return this.http.put<ResponseInterface<EmployeeInterface>>(this.baseUrl + `employee/${employee.uuid}`, employee);
  }

  removeEmployee(payload: EmployeeInterface): Observable<ResponseInterface<EmployeeInterface>> {
    return this.http.delete<ResponseInterface<EmployeeInterface>>(this.baseUrl + `employee/${payload.uuid}`);
  }
  resetUserPassword(uuid: string, payload: ResetEmployeePasswordInterface): Observable<any> {
    return this.http.put(this.baseUrl + `employee/${uuid}/resetEmployeePassword`, payload);
  }

}
