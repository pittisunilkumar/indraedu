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

  getUserByUuid(uuid: string): Observable<ResponseInterface<UserInterface>> {
    return this.http.get<ResponseInterface<UserInterface>>(this.baseUrl + 'users/' + uuid);
  }

  getUserCoupons(userId:string,subId: string): Observable<any> {
    return this.http.get(this.baseUrl + `users/coupons/${userId}/${subId}`);
  }

  getUserSubscriptionsByUuid(uuid: string): Observable<ResponseInterface<UserInterface>> {
    return this.http.get<ResponseInterface<UserInterface>>(this.baseUrl + 'users/subscriptions/' + uuid);
  }
  

  addUser(payload: UserInterface): Observable<ResponseInterface<UserInterface>> {
    return this.http.post<ResponseInterface<UserInterface>>(this.baseUrl + 'users', payload);
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
}
