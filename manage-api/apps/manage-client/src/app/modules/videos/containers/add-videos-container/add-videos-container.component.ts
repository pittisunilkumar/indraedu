import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, VideoInterface, VideoSubjectInterface } from '@application/api-interfaces';
import {
  CourseRepositoryService,
  FacultyRepositoryService,
  SyllabusRepositoryService,
  VideosRepositoryService
} from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import * as uuid from 'uuid';


@Component({
  selector: 'application-add-videos-container',
  templateUrl: './add-videos-container.component.html',
  styleUrls: ['./add-videos-container.component.less'],
})
export class AddVideosContainerComponent implements OnInit {

  syllabus$ = this.syllabusRepository.getAllSyllabus();
  courses$ = this.courseRepo.getAllCourses();
  faculty$ = this.facultyRepo.getOnlyFaculty();
  mode = this.route.snapshot.data['mode'];
  videoByUuid$: Observable<ResponseInterface<VideoInterface>>;
  videoSubject$: Observable<ResponseInterface<VideoSubjectInterface>>;
  errors: string[];
  subjectUuid: string;
  chapterUuid: string;
  videoSubjectName: string;
  videoChapterName: string;
  videosData: any;

  fileName: any;
  file: File | any = null;


  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private courseRepo: CourseRepositoryService,
    private facultyRepo: FacultyRepositoryService,
    private videosRepo: VideosRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.videoSubjectName = window.localStorage.getItem('videoSubjectName')
    this.videoChapterName = window.localStorage.getItem('videoChapterName')
    this.chapterUuid = window.localStorage.getItem('videoChapterUuid')

    this.videoSubject$ = this.getVideoSubjectByUuid();

    if (this.mode === 'edit') {
      this.videoByUuid$ = this.getVideoByUuid();
    }

  }

  getVideoSubjectByUuid() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        this.subjectUuid = params.get('uuid');
        console.log(" this.subjectUuid", this.subjectUuid);

        return this.videosRepo.getVideoSubjectsByUuid(params.get('uuid'));
      })
    );

  }

  getVideoByUuid() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.videosRepo.getVideoByUuid(params.get('uuid'), this.chapterUuid, params.get('videoUuid'), localStorage.getItem('courseId'));
      })
    );

  }

  submit(video) {
    let suggestedVideo = {
      uuid: uuid.v4(),
      subjectId: localStorage.getItem('subjectId'),
      courseId: localStorage.getItem('courseId'),
      chapterId: video.chapterId,
      videoUuid: video.videos.uuid,
      status: video.videos.flags.suggested,
      createdOn: new Date().toISOString().toString(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      },
    }
    if (this.mode === 'add') {
      console.log('video', video);
      return this.videosRepo.addVideo(video).subscribe(
        (result) => {
          if (result.response) {
            if (suggestedVideo?.status) {
              this.videosRepo.suggestedvideos(suggestedVideo).subscribe(data => { })
            }
          }
          console.log('resultresult', result);
          this._location.back()
          // this.router.navigateByUrl(`/videos/subjects/${this.subjectUuid}/videos/list`);
        },
        (err) => {
          console.error(err);
          this.errors = err.error.error;
        }
      );
    } else {
      // let suggestedVideo = {
      //   subjectId: localStorage.getItem('subjectId'),
      //   courseId: localStorage.getItem('courseId'),
      //   chapterId: video.chapterId,
      //   videoUuid: video.videos.uuid,
      //   status: video.videos.flags.suggested,
      //   createdOn: new Date().toISOString().toString(),
      //   createdBy: {
      //     uuid: localStorage.getItem('currentUserUuid'),
      //     name: localStorage.getItem('currentUserName'),
      //   },
      // }
      console.log('suggestedVideo', suggestedVideo);

      return this.videosRepo.editVideoByUuid(video).subscribe(
        (result) => {
          console.log('result', result);
          if (result.ok) {
            this.videosRepo.suggestedvideos(suggestedVideo).subscribe(data => { })
          }
          this._location.back()
          // this.router.navigateByUrl(`/videos/subjects/${this.subjectUuid}/videos/list`);
        },
        (err) => {
          console.error(err);
          this.errors = err.error.error;
        }
      );
    }

  }
  backToSubjects() {
    this.router.navigate(['/videos/subjects/list']);
    window.localStorage.removeItem('videoSubjectName');
    window.localStorage.removeItem('videoSubjectUuid');
  }
  backToChapters() {
    this._location.back()
    window.localStorage.removeItem('videoChapterName');
    window.localStorage.removeItem('videoChapterUuid');
  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  FileSubmited() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.videosData = JSON.parse(fileReader.result);
      this.videosData.map(res => {
        let cData = {
          videoSubjectUuid: res.videosubject_uuid,
          chapter: res.chapter_uuid,
          videos: {
            uuid: uuid.v4(),
            title: res.title,
            totalTime: res.totalTime,
            topics: res.topics,
            faculty:res.faculty,
            order: Number(res.order),
            videoId: res.videoId,
            youtubeUrl: res.youtubeUrl,
            androidUrl: res.andriod_url,
            iosUrl: res.ios_Url,
            slides: res.slides,
            notes: res.notes,
            bannerName: res.banner_name,
            suggestedBanner: res.suggestedBanner,
            publishOn: new Date(),
            flags: {
              active: true,
              suggested: true,
              paid: true
            },
            createdOn: new Date(),
            // createdOn: new Date().toISOString().toString(),
            modifiedOn: null,
            createdBy: {
              uuid: localStorage.getItem('currentUserUuid'),
              name: localStorage.getItem('currentUserName'),
            },
          },
        }
        array.push(cData)

      })

      console.log(array);
      this.videosRepo.addBulkVideos(array).subscribe(data => {
        if (data) {
          console.log(data);
        }
      })

      // array.map(res => {
      //    this.videosRepo.addVideo(res).subscribe(data => {
      //     if (data) {
      //       console.log(data);
      //     }
      //   })
      // })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }
}
