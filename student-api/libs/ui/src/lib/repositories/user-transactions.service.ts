import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, TransactionsDateInterface, UserTransactonsInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTransactionsService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllUserTransactions(): Observable<ResponseInterface<UserTransactonsInterface[]>> {
    return this.http.get<ResponseInterface<UserTransactonsInterface[]>>(this.baseUrl + 'usertransactions');
  }

  addUserTransactions(payload: UserTransactonsInterface): Observable<ResponseInterface<UserTransactonsInterface>> {
    return this.http.post<ResponseInterface<UserTransactonsInterface>>(this.baseUrl + 'usertransactions', payload);
  }
  searchTransactions(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'usertransactions/searchDateFilter', payload);
  }
}
