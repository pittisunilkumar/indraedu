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
    return this.http.get<ResponseInterface<UserTransactonsInterface[]>>(this.baseUrl + 'usertransactions/transactions');
  }

  addUserTransactions(payload: UserTransactonsInterface): Observable<ResponseInterface<UserTransactonsInterface>> {
    return this.http.post<ResponseInterface<UserTransactonsInterface>>(this.baseUrl + 'usertransactions', payload);
  }
  searchTransactions(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'usertransactions/searchDateFilter', payload);
  }
  getMasterAdviceTransactions(): Observable<ResponseInterface<any>> {
    return this.http.get<ResponseInterface<any>>(this.baseUrl + 'usertransactions/masterAdviceTransactions');
  }
  getmasterAdviceDateFilter(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'usertransactions/masterAdvice/searchDateFilters', payload);
  }
  getTransactionByUuid(uuid: string): Observable<ResponseInterface<UserTransactonsInterface>> {
    return this.http.get<ResponseInterface<UserTransactonsInterface>>(this.baseUrl + 'usertransactions/' + uuid);
  }

  assignedSubscriptions(id: any) {
    return this.http.get<ResponseInterface<any>>(this.baseUrl + 'usertransactions/subscription/' + id);
  }

  yearwiseTransactions(payload) {
    console.log('payload',payload);
    
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'usertransactions/year/payments',payload);
  }
  weeklyPayments(){
    return this.http.get<ResponseInterface<any>>(this.baseUrl + 'usertransactions/week/payments');
  }
  paymentsReports(){
    return this.http.get<ResponseInterface<any>>(this.baseUrl + 'usertransactions/all/payments');
  }

  checkPaymentStatus(payload:any) {
    return this.http.post<ResponseInterface<UserTransactonsInterface>>('', payload);
  }
}
