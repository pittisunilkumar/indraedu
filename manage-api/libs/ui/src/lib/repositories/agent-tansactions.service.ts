import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AgentTransactonsInterface, ResponseInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentTansactionsService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllagentTransactions(): Observable<ResponseInterface<AgentTransactonsInterface[]>> {
    return this.http.get<ResponseInterface<AgentTransactonsInterface[]>>(this.baseUrl + 'agentTransactions');
  }

  addAgentTransactions(payload: AgentTransactonsInterface): Observable<ResponseInterface<AgentTransactonsInterface>> {
    return this.http.post<ResponseInterface<AgentTransactonsInterface>>(this.baseUrl + 'agentTransactions', payload);
  }
  searchTransactions(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'agentTransactions/searchDateFilter', payload);
  }
  getTransactionByUuid(uuid: string): Observable<ResponseInterface<AgentTransactonsInterface>> {
    return this.http.get<ResponseInterface<AgentTransactonsInterface>>(this.baseUrl + 'agentTransactions/' + uuid);
  }
  getTransactionById(id: string): Observable<ResponseInterface<AgentTransactonsInterface>> {
    return this.http.get<ResponseInterface<AgentTransactonsInterface>>(this.baseUrl + 'agentTransactions/agent/' + id);
  }
}
