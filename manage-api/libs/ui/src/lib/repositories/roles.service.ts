import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, RoleInterface, RoleSubModuleInterface, RoleValueInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }
  
  getAllRoles(): Observable<ResponseInterface<RoleInterface[]>> {
    return this.http.get<ResponseInterface<RoleInterface[]>>(this.baseUrl + 'roles');
  }

  getAllActiveRoles(): Observable<ResponseInterface<RoleInterface[]>> {
    return this.http.get<ResponseInterface<RoleInterface[]>>(this.baseUrl + 'roles/active/roles');
  }
  

  getRoleByUuid(uuid: string): Observable<ResponseInterface<RoleInterface>> {
    return this.http.get<ResponseInterface<RoleInterface>>(this.baseUrl + 'roles/' + uuid);
  }

  getRoleById(id: any): Observable<ResponseInterface<RoleInterface>> {
    return this.http.get<ResponseInterface<RoleInterface>>(this.baseUrl + `roles/role/${id}`);
  }


  addRole(payload: RoleInterface): Observable<ResponseInterface<RoleInterface>> {
    return this.http.post<ResponseInterface<RoleInterface>>(this.baseUrl + 'roles', payload);
  }

  editRole(role: RoleInterface): Observable<ResponseInterface<RoleInterface>>  {
    return this.http.put<ResponseInterface<RoleInterface>>(this.baseUrl + `roles/${role.uuid}`, role);
  }

  removeRole(payload: RoleInterface): Observable<ResponseInterface<RoleInterface>> {
    return this.http.delete<ResponseInterface<RoleInterface>>(this.baseUrl + `roles/${payload.uuid}`);
  }

  /////////////////// Role Modules //////////////////
  getAllRolesValues(): Observable<ResponseInterface<RoleValueInterface[]>> {
    return this.http.get<ResponseInterface<RoleValueInterface[]>>(this.baseUrl + 'role-modules');
  }
  getAllActiveRolesValues(): Observable<ResponseInterface<RoleValueInterface[]>> {
    return this.http.get<ResponseInterface<RoleValueInterface[]>>(this.baseUrl + 'role-modules/active/rolesValues');
  }
  getRoleValueByUuid(uuid: string): Observable<ResponseInterface<RoleValueInterface>> {
    return this.http.get<ResponseInterface<RoleValueInterface>>(this.baseUrl + 'role-modules/' + uuid);
  }

  addRoleValue(payload: RoleValueInterface): Observable<ResponseInterface<RoleValueInterface>> {
    return this.http.post<ResponseInterface<RoleValueInterface>>(this.baseUrl + 'role-modules', payload);
  }

  editRoleValue(role: RoleValueInterface): Observable<ResponseInterface<RoleValueInterface>>  {
    return this.http.put<ResponseInterface<RoleValueInterface>>(this.baseUrl + `role-modules/${role.uuid}`, role);
  }

  removeRoleValue(payload: RoleValueInterface): Observable<ResponseInterface<RoleValueInterface>> {
    return this.http.delete<ResponseInterface<RoleValueInterface>>(this.baseUrl + `role-modules/${payload.uuid}`);
  }

  /////////////////// Role Sub Modules //////////////////
  getAllRoleSubModule(): Observable<ResponseInterface<RoleSubModuleInterface[]>> {
    return this.http.get<ResponseInterface<RoleSubModuleInterface[]>>(this.baseUrl + 'role-sub-module');
  }
  getAllActiveRoleSubModule(): Observable<ResponseInterface<RoleSubModuleInterface[]>> {
    return this.http.get<ResponseInterface<RoleSubModuleInterface[]>>(this.baseUrl + 'role-sub-module/active/roleSubModules');
  }
  getRoleSubModuleByUuid(uuid: string): Observable<ResponseInterface<RoleSubModuleInterface>> {
    return this.http.get<ResponseInterface<RoleSubModuleInterface>>(this.baseUrl + 'role-sub-module/' + uuid);
  }

  addRoleSubModule(payload: RoleSubModuleInterface): Observable<ResponseInterface<RoleSubModuleInterface>> {
    return this.http.post<ResponseInterface<RoleSubModuleInterface>>(this.baseUrl + 'role-sub-module', payload);
  }

  editRoleSubModulee(role: RoleSubModuleInterface): Observable<ResponseInterface<RoleSubModuleInterface>>  {
    return this.http.put<ResponseInterface<RoleSubModuleInterface>>(this.baseUrl + `role-sub-module/${role.uuid}`, role);
  }

  removeRoleSubModule(payload: RoleSubModuleInterface): Observable<ResponseInterface<RoleSubModuleInterface>> {
    return this.http.delete<ResponseInterface<RoleSubModuleInterface>>(this.baseUrl + `role-sub-module/${payload.uuid}`);
  }
}
