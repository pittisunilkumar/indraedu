import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as uuid from 'uuid';
import { Location } from '@angular/common';
import { VideoInterface, VideoSubjectChapterInterface, VideoSubjectInterface } from '@application/api-interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { VideosRepositoryService } from '@application/ui';

@Component({
  selector: 'application-copy-move-videos',
  templateUrl: './copy-move-videos.component.html',
  styleUrls: ['./copy-move-videos.component.less']
})
export class CopyMoveVideosComponent implements OnInit {
  payload: any;
  subjectList: any;
  subjects: VideoSubjectInterface[]
  chaptersList: VideoSubjectChapterInterface[];
  videoList: VideoInterface[];
  mode: string;
  type: string;
  toSubject: VideoSubjectInterface;
  videosData: any = [];
  // questionsData: any = [];
  videoSubjectUuid: string;
  videoChapterUuid: string;
  videoUuid: string
  selectedListChapters: any = [];
  selectedListVideos: any = [];
  // selectedListQuetions: any = [];

  form = new FormGroup({
    toSubject: new FormControl(''),
    toChapter: new FormControl(''),
  })
  errors: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, copyMode: string, type: string },
    private _location: Location,
    private videosRepo: VideosRepositoryService,
  ) { }

  ngOnInit(): void {
    this.videoSubjectUuid = window.localStorage.getItem('videoSubjectUuid');
    this.videoChapterUuid = window.localStorage.getItem('videoChapterUuid');
    this.videoUuid = window.localStorage.getItem('videoUuid');
    this.payload = this.data.payload;
    this.mode = this.data.copyMode;
    this.type = this.data.type;
    this.videosRepo.getAllVideoSubjects().subscribe(
      (res) => {
        this.subjectList = res.response;
        this.subjects = res.response;
      }
    );
  }

  syllabusFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.subjects = this.subjectList.filter((sub) => {
        return (
          sub.syllabus.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          sub.courses.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    } else {
      this.subjects = this.subjectList;
    }
  }

  getChapters(chapter) {
    this.toSubject = chapter;
    this.videosRepo.getVideoSubjectsByUuid(chapter.uuid).subscribe(res => {
      this.chaptersList = res.response.chapters;
      console.log('this.chaptersList',this.chaptersList);
      
      this.payload.map(res => {
        const arr = this.chaptersList.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedListChapters?.push(res);
        }
      })
    })
    console.log(this.selectedListChapters);
  }

  getVideos(videos) {
    this.videoList = videos.videos;
    this.payload.map(res => {
      const arr = this.videoList.filter(it => it.title === res.title);
      if (!arr?.length) {
        this.selectedListVideos?.push(res);
      }
    })
    console.log(' this.topicUuid ', this.videoUuid );
    this.videoList= this.videoList.filter((res)=>{
      return res.uuid != this.videoUuid
    })
    console.log(this.videoList);
  }

  submit() {
    let value = this.form.value
    this.selectedListVideos.map((res, i) => {
      let data = {
          uuid: uuid.v4(),
          totalTime: res.totalTime,
          topics: res.topics,
          order: res.order,
          videoId: res.videoId.trim(),
          youtubeUrl: res.youtubeUrl.trim(),
          androidUrl: res.androidUrl.trim(),
          iosUrl: res.iosUrl,
          slides: res.slides,
          faculty:res.faculty,
          notes: res.notes,
          bannerName:res.bannerName,
          flags: res.flags,
          suggestedBanner: res.suggestedBanner,
          publishOn: res.publishOn,
          title: res.title,
          createdOn: new Date().toISOString().toString(),
          modifiedOn: null,
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
      }
      this.videosData.push(data)
    })
    let videosCount = 0
    

    if (this.type == 'copy') {
       if (this.mode == 'videos') {
        let videosPayload = {
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          count:this.selectedListVideos.length,
          videos: this.videosData
        }
        console.log('videosPayload',videosPayload);
        this.videosRepo.copyVideos(videosPayload).subscribe(data => { })
      }
      else if (this.mode == 'chapters') {
        this.selectedListChapters.map((res,i)=>{
          videosCount += res.videos.length
        })
        let chaptersPayload = {
          to_subject: this.toSubject.uuid,
          count:videosCount,
          chapter: this.selectedListChapters
        }
        console.log('chaptersPayload',chaptersPayload);
        
        this.videosRepo.copyChapters(chaptersPayload).subscribe(data => { })
      }
    }

    else if (this.type == 'move') {
      if (this.mode == 'videos') {
        let fromVideo: string[] = [];
        this.payload.map((res, i) => {
          fromVideo.push(res.uuid)
        })
        let videosPayload = {
          from_subject: this.videoSubjectUuid,
          from_chapter: this.videoChapterUuid,
          count:this.selectedListVideos.length,
          from_video: fromVideo,
          to_subject: this.toSubject.uuid,
          to_chapter: value.toChapter.uuid,
          videos: this.videosData
        }
        console.log('videosPayload',videosPayload);
        this.videosRepo.moveVideos(videosPayload).subscribe(data => { })
      }
      else if (this.mode == 'chapters') {
        this.selectedListChapters.map((res,i)=>{
          videosCount += res.videos.length
        })
        let fromChapter: string[] = [];
        this.payload.map((res, i) => {
          fromChapter.push(res.uuid)
        })
        let chaptersPayload = {
          from_subject: this.videoSubjectUuid,
          from_chapter: fromChapter,
          count:videosCount,
          to_subject: this.toSubject.uuid,
          chapter: this.selectedListChapters
        }
        console.log('chaptersPayload',chaptersPayload);
        this.videosRepo.moveChapters(chaptersPayload).subscribe(data => { })
      }
    }
    // this._location.back();
    window.location.reload();
  }

}
