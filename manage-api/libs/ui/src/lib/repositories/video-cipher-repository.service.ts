import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { VideoInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class VideoCipherRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllVideos(payload: { page: number; limit: number; tags: string[]; }): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', String(payload.page));
    params = params.append('limit', String(payload.limit));
    params = params.append('tags', payload.tags.join(','));
    return this.http.get(this.baseUrl + 'vdocipher/all', { params });
  }

  getVideoByUuid(videoUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `videos/${videoUuid}`);
  }

  deleteVideoByUuid(videoUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `videos/${videoUuid}`);
  }

  editVideoByUuid(
    video: VideoInterface
  ): Observable<any> {
    return this.http.put(this.baseUrl + `videos/${video.uuid}`, video);
  }
}
