import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TagInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addTag(tag: TagInterface): Observable<any> {
    return this.http.post(this.baseUrl + `tags`, tag);
  }

  getAllTags(): Observable<any> {
    return this.http.get(this.baseUrl + 'tags');
  }

  getAllActiveTags(): Observable<any> {
    return this.http.get(this.baseUrl + 'tags/active');
  }

  getTagByUuid(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `tags/${uuid}`);
  }

  deleteTagByUuid(tagUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `tags/${tagUuid}`);
  }

  editTagByUuid(tag: TagInterface): Observable<any> {
    return this.http.put(this.baseUrl + `tags/${tag.uuid}`, tag);
  }

}
