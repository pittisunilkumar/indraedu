import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FacultyInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class FacultyRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addFaculty(faculty: FacultyInterface): Observable<any> {
    return this.http.post(this.baseUrl + `faculty`, faculty);
  }

  getAllFaculty(): Observable<any> {
    return this.http.get(this.baseUrl + 'faculty');
  }

  getOnlyFaculty(): Observable<any> {
    return this.http.get(this.baseUrl + 'faculty/faculty/active');
  }

  getFacultyByUuid(facultyUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `faculty/${facultyUuid}`);
  }

  deleteFacultyByUuid(facultyUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `faculty/${facultyUuid}`);
  }

  editFacultyByUuid(faculty: FacultyInterface): Observable<any> {
    return this.http.put(this.baseUrl + `faculty/${faculty.uuid}`, faculty);
  }
}
