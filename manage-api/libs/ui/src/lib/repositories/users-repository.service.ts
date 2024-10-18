import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EmployeeInterface, KeyInterface, ResponseInterface, SubscriptionInterface } from '@application/api-interfaces';
import {
  OrganizationInterface,
  UserInterface,
} from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class UsersRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllUsers(): Observable<ResponseInterface<UserInterface[]>> {
    return this.http.get<ResponseInterface<UserInterface[]>>(this.baseUrl + 'users');
  }

  getAllStudents(): Observable<ResponseInterface<UserInterface[]>> {
    return this.http.get<ResponseInterface<UserInterface[]>>(this.baseUrl + 'users/students');
  }

  getStudentsPerPage(data): Observable<ResponseInterface<any>> {
    return this.http.get<ResponseInterface<any>>(this.baseUrl + `users/paginate?page=${data.page}&limit=${data.limit}&search=${data.search}`);
  }

  searchByMobile(payload): Observable<ResponseInterface<UserInterface>> {
    return this.http.post<ResponseInterface<UserInterface>>(this.baseUrl + 'users/mobile' , payload);
  }

  getUserByUuid(uuid: string): Observable<ResponseInterface<UserInterface>> {
    return this.http.get<ResponseInterface<UserInterface>>(this.baseUrl + 'users/' + uuid);
  }

  getUserCoupons(userId:string,subId: string): Observable<any> {
    return this.http.get(this.baseUrl + `users/coupons/${userId}/${subId}`);
  }

  getAgentCoupons(subId: string): Observable<any> {
    return this.http.get(this.baseUrl + `users/agent/coupons/${subId}`);
  }

  getUserSubscriptionsByUuid(uuid: string): Observable<ResponseInterface<UserInterface>> {
    return this.http.get<ResponseInterface<UserInterface>>(this.baseUrl + 'users/subscriptions/' + uuid);
  }
  

  addUser(payload: UserInterface): Observable<ResponseInterface<UserInterface>> {
    return this.http.post<ResponseInterface<UserInterface>>(this.baseUrl + 'users', payload);
  }

  addManyUsers(payload: any): Observable<ResponseInterface<UserInterface>> {
    return this.http.post<ResponseInterface<UserInterface>>(this.baseUrl + 'users/insertMany/users', payload);
  }

  editUser(user: UserInterface): Observable<ResponseInterface<UserInterface>>  {
    return this.http.put<ResponseInterface<UserInterface>>(this.baseUrl + `users/${user.uuid}`, user);
  }

  removeUser(payload: UserInterface): Observable<ResponseInterface<UserInterface>> {
    return this.http.delete<ResponseInterface<UserInterface>>(this.baseUrl + `users/${payload.uuid}`);
  }

  // resetUserPassword(payload: UserInterface): Observable<ResponseInterface<UserInterface>> {
  //   return this.http.put<ResponseInterface<UserInterface>>(this.baseUrl + `users/${payload.uuid}/resetUserPassword`, payload);
  // }

  

  assignSubscriptions(uuid: string,payload: UserInterface): Observable<ResponseInterface<UserInterface>> {

    return this.http.post<ResponseInterface<UserInterface>>(this.baseUrl + `users/${uuid}/subscriptions`, payload);

  }

  getNotificationById(notifiationId: string): Observable<any> {
    return this.http.get(this.baseUrl + `notifiations/view-notification/${notifiationId}`);
  }
  deleteNotification(notifiationId: string): Observable<any> {
    return this.http.delete(this.baseUrl + `notifiations/${notifiationId}`);
  }

  assignOrganizationToUsers(
    user: UserInterface,
    org: KeyInterface
  ): Observable<ResponseInterface<UserInterface[]>> {
    return this.http.post<ResponseInterface<UserInterface[]>>(
      this.baseUrl + `users/${user.uuid}/organizations`,
      org
    );
  }

  removeOrganizationFromUser(
    org: OrganizationInterface,
    user: UserInterface
  ): Observable<ResponseInterface<UserInterface>> {
    return this.http.delete<ResponseInterface<UserInterface>>(
      this.baseUrl + `users/${user.uuid}/organizations/${org.uuid}`
    );
  }

  assignUsersToOrganization(
    org: OrganizationInterface,
    users: UserInterface[]
  ): Observable<ResponseInterface<OrganizationInterface>> {
    return this.http.post<ResponseInterface<OrganizationInterface>>(
      this.baseUrl + `organizations/${org.uuid}/users`,
      users
    );
  }

  removeUserFromOrganization(
    org: OrganizationInterface,
    user: UserInterface
  ): Observable<ResponseInterface<OrganizationInterface>> {
    return this.http.delete<ResponseInterface<OrganizationInterface>>(
      this.baseUrl + `organizations/${org.uuid}/users/${user.uuid}`
    );
  }


  sendNotification(payload: any): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'notifiations/send-notification', payload);
  }
  sendScheduleNotification(payload: any): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'notifiations/schedule-notification', payload);
  }


  resetAllSubscrptions(uuid) {
    return this.http.put(this.baseUrl + `users/clearSubscrptions/${uuid}`,uuid);
  }

  searchTransactions(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'users/searchDateFilter', payload);
  }

  disableuserfortestsubmits(payload) {
    return this.http.post(this.baseUrl + 'users/disableuserfortestsubmits', payload);
  }
  disableuserfortestsubmitsList() {
    return this.http.get(this.baseUrl + 'users/disableuserfortestsubmits/list');
  }
  disableuserfortestsubmitsStatus(id,status): Observable<any> {
    return this.http.put(this.baseUrl + `users/disableuserfortestsubmits/status/${id}`,status);
  }
  removeDisableuserfortestsubmit(uuid){
    return this.http.delete(this.baseUrl + `users/disableuserfortestsubmits/${uuid}`);
  }
  userAttemptedQbankTopics(inputBody) {
    return this.http.post(this.baseUrl + 'users/fetch-users-submitted-data' , inputBody);
  }
  userAttemptedTests(inputBody) {
    return this.http.post(this.baseUrl + 'users/fetch-users-submitted-tests' , inputBody);
  }
  inActiveUsers() {
    return this.http.get(this.baseUrl + 'users/inActive/users');
  }
  // brachIo(inputBody) {
  //   return this.http.post(this.baseUrl + 'users/generateBranchIoLink' , inputBody);
  // }
  notificationList(): Observable<ResponseInterface<any>> {
    return this.http.get<ResponseInterface<any>>(this.baseUrl + 'notifiations');
  }
  searchNotifications(payload): Observable<ResponseInterface<any>> {
    return this.http.post<ResponseInterface<any>>(this.baseUrl + 'notifiations/searchDateFilter', payload);
  }
 
}
