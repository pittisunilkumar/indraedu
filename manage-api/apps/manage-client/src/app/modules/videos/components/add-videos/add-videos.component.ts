import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CourseInterface,
  FacultyInterface,
  SyllabusInterface,
  SyllabusTypeEnum,
  VideoCheckpointsInterface,
  VideoInterface,
  VideoSubjectInterface,
} from '@application/api-interfaces';
import { AWSS3Service, HelperService, NotificationService, NotificationType } from '@application/ui';
import * as uuid from 'uuid';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Location } from '@angular/common';

@Component({
  selector: 'application-add-videos',
  templateUrl: './add-videos.component.html',
  styleUrls: ['./add-videos.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVideosComponent implements OnInit, OnChanges {

  @Input() facultyList: FacultyInterface[];
  @Input() mode: string;
  @Input() video: VideoInterface;
  @Input() subject: VideoSubjectInterface;
  @Output() commit = new EventEmitter<VideoInterface>();
  addVideoForm: FormGroup;
  subjects: SyllabusInterface[];
  selectedSubject: SyllabusInterface;
  selectedChapter: SyllabusInterface;
  slides: string[] = [];
  suggestedBanners: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private awsS3: AWSS3Service,
    private router: Router,
    public helper: HelperService,
    private _location: Location,
    private notification: NotificationService,

  ) { }

  ngOnChanges(changes: SimpleChanges) {

    if (this.mode === 'edit' && changes?.video?.currentValue) {
      this.video = changes?.video?.currentValue;
      this.selectedSubject = this.video?.videoSubjectUuid;
      this.buildForm();
    }

    if (changes?.subject?.currentValue) {
      this.subject = changes?.subject?.currentValue;
      this.buildForm();
    }
  }

  ngOnInit(): void {

    this.buildForm();

  }

  buildForm() {
    console.log('this.video', this.video);

    this.addVideoForm = this.formBuilder.group({
      chapter: [this.video?.chapter ? this.video?.chapter : null, Validators.required],
      title: [this.video?.title ? this.video?.title : '', Validators.required],
      totalTime: [this.video?.totalTime ? this.video?.totalTime : '', [Validators.required, Validators.pattern(/^(?:[0-9][0-9]):[0-5][0-9]:[0-5][0-9]$/)]],
      topics: this.formBuilder.array([]),
      videoType: [this.video?.videoType ? this.video?.videoType : '', Validators.required],
      videoId: [this.video?.videoId ? this.video?.videoId : '', Validators.required],
      youtubeUrl: [this.video?.youtubeUrl ? this.video?.youtubeUrl : ''],
      androidUrl: [this.video?.androidUrl ? this.video?.androidUrl : ''],
      accessToken:[this.video?.accessToken ? this.video?.accessToken : ''],
      iosUrl: [this.video?.iosUrl ? this.video?.iosUrl : ''],
      // slides: this.video?.slides ? this.video?.slides : [],
      slides: this.formBuilder.group({
        imgUrl: this.video?.slides ? this.video?.slides : '',
        upload: this.video?.slides ? false : true,
      }),
      faculty: [this.video?.faculty ? this.video?.faculty : null,Validators.required],
      notes: this.video?.notes ? this.video?.notes : '',
      bannerName: this.video?.bannerName ? this.video?.bannerName : '',
      order: [this.video?.order ? this.video?.order : '', Validators.required],
      flags: this.formBuilder.group({
        active: this.video ? this.video?.flags.active : true,
        paid: this.video ? this.video?.flags.paid : true,
        suggested: this.video ? this.video?.flags.suggested : false,
      }),
      suggestedBanner: this.formBuilder.group({
        imgUrl: this.video?.suggestedBanner ? this.video?.suggestedBanner : '',
        upload: this.video?.suggestedBanner ? false : true,
      }),
      publishOn: [this.video?.publishOn ? this.video?.publishOn : new Date(), [Validators.required]],
    });
    this.addTopics();
  }

  get topics(): FormArray {
    return this.addVideoForm?.get('topics') as FormArray;
  }

  newTopic(data?: VideoCheckpointsInterface): FormGroup {
    return this.formBuilder.group({
      name: data?.name ? data?.name : null,
      time: [data?.time ? data?.time : '', Validators.pattern(/^(?:[0-9][0-9]):[0-5][0-9]:[0-5][0-9]$/)],
      faculty: data?.faculty ? data?.faculty : null,
      topicOrder: data?.topicOrder ? data?.topicOrder : null,
    });
  }

  addTopics() {

    if (this.mode === 'add') {
      this.topics?.push(this.newTopic());
    }
    if (this.mode === 'edit' && this.video) {
      this.video?.topics?.map(it => this.topics?.push(this.newTopic(it)));
    }
  }

  addNewTopic() {
    return this.topics?.push(this.newTopic());
  }

  removeTopic(i) {
    return this.topics.removeAt(i)
  }

  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.addVideoForm.controls['suggestedBanner'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  getSlidesImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.addVideoForm.controls['slides'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  // async uploadImage(event, control: string) {
  //   // if (this.checkFileExists(event[0].name)) {
  //     console.log({event});

  //   await this.awsS3.uploadFile(event).then((result) => {
  //     console.log({result});

  //     switch(control) {
  //       case 'suggestedBanner':{
  //         result.map(res => this.suggestedBanners.push(res.location));
  //         break;
  //       }
  //       case 'slides': {
  //         result.map(res => this.slides.push(res.location));
  //         break;
  //       }
  //     }

  //   });
  // }

  resetForm() {
    this.addVideoForm.reset();
  }

  cancel() {
    this.router.navigateByUrl('/manage/users/list');
  }

  // timestrToSec(timestr) {
  //   var parts = timestr.split(":");
  //   return (parts[0] * 3600) +
  //     (parts[1] * 60) +
  //     (+parts[2]);
  // }

  // pad(num) {
  //   if (num < 10) {
  //     return "0" + num;
  //   } else {
  //     return "" + num;
  //   }
  // }

  // formatTime(seconds) {
  //   return [this.pad(Math.floor(seconds / 3600)),
  //   this.pad(Math.floor(seconds / 60) % 60),
  //   this.pad(seconds % 60),
  //   ].join(":");
  // }

  // getTime() {
  //   const value = this.addVideoForm.value;
  //   let time = []
  //   value.topics.map((res,i) => {
  //     time.push(res.time)
  //   })
  // let Time = this.formatTime(this.timestrToSec(time))
  //   let time1="12:12:12"
  //   let time2="01:47:49"
  //  let Time = this.formatTime(this.timestrToSec(time1) + this.timestrToSec(time2));
  //   console.log('Time', Time);
  //  this.addTimes(time)
  // }
//    addTimes(times = []) {
//     const value = this.addVideoForm.value;
//     const z = (n) => (n < 10 ? '0' : '') + n;
//     let hour = 0
//     let minute = 0
//     let second = 0
//     for (const time of times) {
//         const splited = time.split(':');
//         hour += parseInt(splited[0]);
//         minute += parseInt(splited[1])
//         second += parseInt(splited[2])
//     }
//     const seconds = second % 60;
//     let minutes = parseInt((minute % 60).toString()) + parseInt((second / 60).toString())
//     let hours = hour + parseInt((minute / 60).toString())
//     // if(minutes == 60){
//     //   minutes = minutes-60;
//     //   hours = hours + 1
//     // }
//    let totalTime = value.totalTime
//    let topicTime = z(hours) + ':' + z(minutes) + ':' + z(seconds)
//    if(topicTime > totalTime ){
//      console.log('true');
//    }
//    else{
//      console.log('falss');
     
//    }
// }

  handleSubmit() {
    let topicsList = [];
    const value = this.addVideoForm.value;
    // let array = []
    value.topics.map(res => {
      // if (this.mode == 'add') {
      let topic = {
        name: res.name,
        time: res.time,
        topicOrder: parseInt(res.topicOrder),
        // faculty: res.faculty._id
        faculty: res.faculty ? { "_id": res.faculty._id, "uuid": res.faculty.uuid } : {}
      }
      topicsList.push(topic)
      // }
      // else if (this.mode == 'edit') {
      //   if (res.faculty.uuid) {
      //     let topic = {
      //       name: res.name,
      //       time: res.time,
      //       // faculty: res.faculty._id
      //       faculty: {"_id": res.faculty._id,"uuid": res.faculty.uuid}
      //     }
      //     array.push(topic)
      //   }
      //   else {
      //     array = this.video?.topics;
      //   }
      // }
    })
    // console.log('array', topicsList);
    if (this.mode === 'add') {
      const video: any = {
        videoSubjectUuid: this.subject.uuid,
        chapter: value.chapter.uuid,
        chapterId: value.chapter._id,
        videos: {
          uuid: uuid.v4(),
          totalTime: value.totalTime,
          topics: topicsList,
          order: Number(value.order),
          videoType:value.videoType,
          accessToken:value.accessToken,
          videoId: value.videoId.trim(),
          youtubeUrl: value.youtubeUrl.trim(),
          androidUrl: value.androidUrl.trim(),
          iosUrl: value.iosUrl,
          slides: value.slides?.imgUrl,
          // faculty:value.faculty._id,
          faculty: { "_id": value.faculty._id, "uuid": value.faculty.uuid },
          notes: value.notes,
          bannerName: value.bannerName,
          flags: value.flags,
          suggestedBanner: value.suggestedBanner?.imgUrl,
          publishOn: value.publishOn.toISOString().toString(),
          title: value.title,
          createdOn: new Date().toISOString().toString(),
          modifiedOn: null,
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
        }

      };
      console.log('video', video);
      if(!value.flags.paid && value.youtubeUrl == ''){
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: 'While video is free Youtube URL cannot be empty',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
      else{
      this.commit.emit(video);
      }
    }

    if (this.mode === 'edit') {
      const video: any = {
        videoSubjectUuid: this.subject.uuid,
        chapter: value.chapter.uuid,
        chapterId: value.chapter._id,
        videos: {
          uuid: this.video.uuid,
          totalTime: value.totalTime,
          order: Number(value.order),
          topics: topicsList,
          videoType:value.videoType,
          videoId: value.videoId.trim(),
          youtubeUrl: value.youtubeUrl.trim(),
          androidUrl: value.androidUrl.trim(),
          accessToken:value.accessToken,
          iosUrl: value.iosUrl,
          slides: value.slides?.imgUrl,
          // faculty: value.faculty._id,
          faculty: { "_id": value.faculty._id, "uuid": value.faculty.uuid },
          notes: value.notes,
          bannerName: value.bannerName,
          flags: value.flags,
          suggestedBanner: value.suggestedBanner?.imgUrl,
          publishOn: value.publishOn,
          title: value.title,
          createdOn: this.video.createdOn,
          createdBy: this.video.createdBy,
          modifiedOn: new Date().toISOString().toString(),
          modifiedBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
        }
      };
      console.log(video);
      if(!value.flags.paid && value.youtubeUrl == ''){
        this.notification.showNotification({
          type: NotificationType.ERROR,
          payload: {
            message: 'While video is free Youtube URL cannot be empty',
            statusCode: 200,
            statusText: 'Successfully',
            status: 201
          },
        });
      }
      else{
      this.commit.emit(video);
      }
      // this.commit.emit(video);

    }

  }

  goBack() {
    this._location.back();
  }

}
