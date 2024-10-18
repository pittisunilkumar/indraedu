import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  CourseInterface,
  OrganizationInterface,
  ResponseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class CourseRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  createCourse(course: CourseInterface): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.post<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `courses`, course
    );
  }

  getAllCourses(): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.get<ResponseInterface<CourseInterface[]>>(this.baseUrl + 'courses')
  }

  getAllActiveCourses(): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.get<ResponseInterface<CourseInterface[]>>(this.baseUrl + 'courses/getActiveCourses')
  }

  getAllQBankCourses(): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.get<ResponseInterface<CourseInterface[]>>(this.baseUrl + 'courses/byQBank')
  }

  getAllVideoCourses(): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.get<ResponseInterface<CourseInterface[]>>(this.baseUrl + 'courses/byVideos')
  }

  getCourseByUuid(courseUuid: string): Observable<ResponseInterface<CourseInterface>> {
    return this.http.get<ResponseInterface<CourseInterface>>(
      this.baseUrl + `courses/${courseUuid}`
    );
  }

  createCourseByOrgUuid(
    org: OrganizationInterface,
    course: CourseInterface
  ): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.post<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `organizations/${org.uuid}/courses`,
      course
    );
  }

  deleteCourseByUuid(courseUuid: string): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.delete<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `courses/${courseUuid}`
    );
  }

  editCourseByUuid(
    course: CourseInterface
  ): Observable<ResponseInterface<CourseInterface>> {
    return this.http.put<ResponseInterface<CourseInterface>>(
      this.baseUrl + `courses/${course.uuid}`, course
    );
  }

  assignBulkSyllabus(
    course: CourseInterface,
    syllabus: SyllabusInterface[]
  ): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.post<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `courses/${course.uuid}/syllabus`,
      syllabus
    );
  }

  disconnectOrganizationCourse(
    orgUuid: string,
    courseUuid: string
  ): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.delete<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `organizations/${orgUuid}/courses/${courseUuid}`
    );
  }

  editOrganizationCourseByUuid(
    orgUuid: string,
    courseUuid: string,
    course: CourseInterface
  ): Observable<ResponseInterface<CourseInterface[]>> {
    return this.http.put<ResponseInterface<CourseInterface[]>>(
      this.baseUrl + `organizations/${orgUuid}/courses/${courseUuid}`,
      course
    );
  }
}
