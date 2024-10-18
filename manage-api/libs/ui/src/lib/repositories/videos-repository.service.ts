import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ResponseInterface, VideoInterface, VideoSubjectInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class VideosRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addVideoSubjects(videoSubject: VideoSubjectInterface): Observable<ResponseInterface<VideoSubjectInterface>> {
    return this.http.post<ResponseInterface<VideoSubjectInterface>>(this.baseUrl + `videos/subjects`, videoSubject);
  }

  getAllVideoSubjects(): Observable<ResponseInterface<VideoSubjectInterface[]>> {
    return this.http.get<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects`);
  }

  getVideoSubjectsByUuid(subjectUuid: string): Observable<ResponseInterface<VideoSubjectInterface>> {
    return this.http.get<ResponseInterface<VideoSubjectInterface>>(this.baseUrl + `videos/subjects/${subjectUuid}`);
  }

  getVideoSubjectsByCourseId(courseId: string): Observable<ResponseInterface<VideoSubjectInterface[]>> {
    return this.http.get<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/bycourseId/${courseId}`);
  }

  deleteVideoSubjectsByUuid(subjectUuid: string): Observable<ResponseInterface<VideoSubjectInterface>> {
    return this.http.delete<ResponseInterface<VideoSubjectInterface>>(this.baseUrl + `videos/subjects/${subjectUuid}`);
  }

  editVideoSubjectsByUuid(subject: VideoSubjectInterface): Observable<ResponseInterface<VideoSubjectInterface>> {
    return this.http.put<ResponseInterface<VideoSubjectInterface>>(this.baseUrl + `videos/subjects/${subject.uuid}`, subject);
  }

  addVideo(video: VideoInterface): Observable<any> {
    return this.http.post(this.baseUrl + `videos/subjects/${video.videoSubjectUuid}/video`, video);
  }

  addBulkVideos(videos: any): Observable<any> {
    return this.http.post(this.baseUrl + `videos/subjects/bulkVideos`, videos);
  }

  getAllVideos(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `videos/subjects/${uuid}/videos`);
  }

  getVideoByUuid(subjectUuid: string, chapterUuid: string, videoUuid: string, course: string,): Observable<any> {
    return this.http.get(this.baseUrl + `videos/subjects/${subjectUuid}/chapter/${chapterUuid}/videos/${videoUuid}/${course}`);
  }

  getVideosByCourseId(courseId: string): Observable<any> {
    return this.http.get(this.baseUrl + `videos/subjects/courses/${courseId}`);
  }

  // subjectsByCourseIds(course: any): Observable<any> {
  //   return this.http.post(this.baseUrl + `videos/subjects/subjectsByCourseIds`,course);
  // }

  deleteVideoByUuid(subjectUuid: string, videoUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `videos/subjects/${subjectUuid}/videos/${videoUuid}`);
  }

  editVideoByUuid(
    video: VideoInterface
  ): Observable<any> {
    console.log('video', video);
    return this.http.post(this.baseUrl + `videos/subjects/updateVideos`, video);

    // return this.http.put(this.baseUrl + `videos/subjects/${video.videoSubjectUuid}/videos/${video.videos.uuid}`, video);
  }

  dragAndDropVideos(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/dragAndDropVideos`, inputBody);
  }

  dragAndDropVideoChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/dragAndDropVideoChapters`, inputBody);
  }

  dragAndDropVideoSubjects(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/dragAndDropSubjects`, inputBody);
  }


  /// new API's

  copyVideos(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/copyVideos`, inputBody);
  }
  copyChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/copychapters`, inputBody);
  }

  moveVideos(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/moveVideos`, inputBody);
  }
  moveChapters(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/moveChapters`, inputBody);
  }

  deleteVideoChaptersByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/deleteChapters`, inputBody);
  }

  deleteVideosByUuid(inputBody): Observable<any> {
    return this.http.post<ResponseInterface<VideoSubjectInterface[]>>(this.baseUrl + `videos/subjects/deleteVideos`, inputBody);
  }


  /////////////////////////// Suggested Videos////////////////////////////////////
  suggestedvideos(videos: any): Observable<any> {
    return this.http.post(this.baseUrl + `suggestedvideos`, videos);
  }
  getAllSuggestedVideos(): Observable<any> {
    return this.http.get(this.baseUrl + 'suggestedvideos');
  }
  updateSuggestedVideoStatus(id,status): Observable<any> {
    return this.http.put(this.baseUrl + `suggestedvideos/status/${id}`,status);
  }
}
