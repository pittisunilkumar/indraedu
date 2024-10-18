import {
  QBankInterface,
  UserVideoInterface,
  UserVideoStatusEnum,
  VideoPlaybackInfoInterface,
  VideoSubjectInterface,
} from '@application/api-interfaces';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { CreateVideoSubjectDto } from '../dto';
import { Syllabus, User, VideoSubject, Faculty, DisableUserForTestSubmit } from '../schema';
import * as mongoose from 'mongoose';
import { CommonFunctions } from '../helpers/functions';

@Injectable()
export class MobileVideoSubjectService {
  constructor(
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('Faculty') private facultyModel: Model<Faculty>,
    private httpService: HttpService,
    @InjectModel('DisableUserForTestSubmit')
    private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>
  ) {}

  async findByCourse(req, body) {
    try {
      let userUuid = req.user.uuid;
      let UserId = req.user._id;
      let sub = [];

      var videosData = await this.videoSubjectModel
        .find(
          { courses: body.courseId, 'flags.active': true },
          { id: 1, uuid: 1, imgUrl: 1, count: 1, courses: 1, order: 1 }
        )
        .populate({
          path: 'syllabus',
          match: {
            type: 'SUBJECT',
            'flags.active': true,
            'flags.questionBank': true,
          },
          select: {
            title: 1,
          },
        })
        .exec();

      let userWatchVideos = await this.userModel
        .aggregate([
          { $match: { uuid: userUuid } },
          { $unwind: '$userVideos' },
          {
            $match: {
              'userVideos.courseId': mongoose.Types.ObjectId(body.courseId),
              'userVideos.status': 2,
            },
          },
          {
            $project: {
              userVideos: 1,
            },
          },
        ])
        .exec();
      for (var i = 0; i < videosData.length; i++) {
        let new_syl: any = videosData[i].syllabus;
        var watchCount = 0;
        userWatchVideos.forEach((element) => {
          if (
            String(element.userVideos.videoSubjectId) ===
            String(videosData[i]._id)
          ) {
            watchCount = watchCount + 1;
          }
        });

        sub.push({
          id: videosData[i]._id,
          uuid: videosData[i].uuid,
          subjectName: new_syl.title,
          image: videosData[i].imgUrl,
          completedCount: watchCount,
          courseId: videosData[i].courses,
          totalCount: videosData[i].count,
          order: videosData[i].order,
        });
      }
      sub.sort((a, b) => (a.order > b.order ? 1 : -1));

      return {
        status: true,
        code: 2000,
        message: 'Subjects Fetched',
        data: sub,
      };
    } catch {
      return {
        status: true,
        code: 2001,
        message: 'Something Went Wrong',
        data: [],
      };
    }
  }

  async findAllChaptersBySubjectUuid(
    subjectUuid: string
  ): Promise<{ title: string }[]> {
    return this.videoSubjectModel
      .find({ uuid: subjectUuid }, { chapters: 1 })
      .exec();
  }

  async findAll(): Promise<VideoSubject[]> {
    return this.videoSubjectModel.find().exec();
  }

  async findChaptersBySubjectId(req, body): Promise<any> {
    // return this.videoSubjectModel
    //   .findOne({ uuid : body.subjectUuid },
    //     { courses: 0, createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0,
    //     "chapters.videos.subject": 0, "chapters.videos.chapter": 0 }
    //   )
    //   .exec();

    var id = body.subjectId;
    var uuid = body.subjectUuid;
    var user_uuid = req.user.uuid;
    let lockstatus = false;

    var subscriptionStatus = await this.userModel
      .aggregate([{ $match: { uuid: user_uuid } }])
      .exec();

      const videos = subscriptionStatus[0].videos;
      videos.forEach((video) => {
        var now = new Date();
        if (lockstatus == false) {
          if (id == video.subject_id) {
            if (now <= video.expiry_date) {
              lockstatus = true;
            } else {
              lockstatus = false;
            }
          } else {
            lockstatus = false;
          }
        }
      });
      var disableLockCheck = await this.disableUserForTestSubmitModel
      .findOne({ mobile: req.user.mobile, status: true, subscription:true})
      .exec();
      if(disableLockCheck){
        lockstatus = true;
      }

    let userWatchVideos = await this.userModel
      .aggregate([
        { $match: { uuid: user_uuid } },
        { $unwind: '$userVideos' },
        {
          $match: {
            'userVideos.courseId': mongoose.Types.ObjectId(req.user.courses),
          },
        },
        {
          $project: {
            userVideos: 1,
          },
        },
      ])
      .exec();
    var result = await this.videoSubjectModel
      .findOne(
        { _id: id, 'flags.active': true },
        {
          courses: 1,
          syllabus: 1,
          chapters: 1,
          _id: 1,
          uuid: 1,
          title: 1,
          imgUrl: 1,
          order: 1,
          flags: 1,
          count: 1,
          createdBy: 1,
          createdOn: 1,
        }
      )
      .exec()
      .then(async (res) => {
        if (res != undefined) {
          var array = res.chapters;
          res.chapters.sort((a, b) => (a.order > b.order ? 1 : -1));

          for (var j = 0; j < array.length; j++) {
            let name = '';
            var obj = await this.syllabusModel
              .findOne({ _id: res.chapters[j]._id }, { title: 1 })
              .sort({ order: 1 })
              .exec();
            if (obj) {
              name = obj.title;
            }
            let videos = [];
            // videos = res.chapters[j].videos;
            videos = res.chapters[j].videos.filter(
              (video) => video.flags.active == true
            );
            if (videos) {
              for (var k = 0; k < videos.length; k++) {
                let facultyName = '';
                let userVideoStatus = {
                  uuid: videos[k].uuid,
                  vdoCipherId: videos[k].videoId,
                  title: videos[k].title,
                  status: 0,
                  totalTime: videos[k].totalTime,
                  remainingTime: videos[k].totalTime,
                };
                // var faculty = await this.facultyModel.findOne({ "uuid": videos[k].faculty.uuid }, { name: 1 }).exec();
                // if (faculty) {
                //   facultyName = faculty.name;
                // }
                var published = true;

                if (new Date(videos[k].publishOn) > new Date()) {
                  published = false;
                }

                videos[k]['totalTopics'] = videos[k].topics.length;
                // videos[k]['completedMcq'] = 0;
                videos[k]['facultyName'] = facultyName;
                var userdataSubmittedVideos = [];
                videos[k]['topicStatus'] = 0;
                videos[k]['userVideoStatus'] = userVideoStatus;
                videos[k]['videoWatchPercentage'] = 0;
                videos[k]['timePlayed'] = 0;
                videos[k]['published'] = published;
                try {
                  videos[k]['publishOn'] = CommonFunctions.getISTTime(videos[k].publishOn);
                } catch (error) {
                  videos[k]['publishOn'] = CommonFunctions.getISTTime(new Date().toISOString());
                }

                userWatchVideos.forEach((element) => {
                  if (
                    String(element.userVideos.uuid) ===
                    String(videos[k]['uuid'])
                  ) {
                    // if(lockstatus){
                    videos[k]['topicStatus'] = element.userVideos.status;
                    videos[k]['userVideoStatus'] = element.userVideos;
                    // }
                    try {
                      var totalTime = element.userVideos.totalTime; // your input string
                      var watchTime = element.userVideos.watchTime; // your input string
                      if (element.userVideos.watchTime) {
                        watchTime = element.userVideos.watchTime / 1000 / 60;
                      } else {
                        watchTime = 0;
                      }
                      var a = totalTime.split(':'); // split it at the colons
                      // var b = rem.split(':'); // split it at the colons

                      // minutes are worth 60 seconds. Hours are worth 60 minutes.
                      // var time = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                      var time = Number(a[0]) * 60 + Number(a[1]);
                      // var remaining = (+b[0]) * 60 * 60 + (+b[1]) * 60;
                      // console.log(watchTime, time, a)
                      var percentage = 0;
                      try {
                        percentage = (watchTime / time) * 100;
                      } catch {
                        percentage = 0;
                      }
                      if (percentage >= 100) {
                        percentage = 100;
                      }
                      videos[k]['videoWatchPercentage'] = Math.round(
                        percentage
                      );
                      videos[k]['timePlayed'] = Number(
                        element.userVideos.watchTime
                      );

                      if (lockstatus == false) {
                        videos[k]['videoWatchPercentage'] = 0;
                        videos[k]['timePlayed'] = 0;
                      } // lock status
                    } catch {}
                  }
                });
                videos[k]['subscribed'] = lockstatus;
              }
            }
            res.chapters[j]['title'] = name;
            res.chapters[j]['subscribed'] = lockstatus;
            res.chapters[j]['completedCount'] = 1;
            res.chapters[j]['count'] = res.chapters[j].videos.length;
            res.chapters[j]['videos'] = videos.sort((a, b) =>
              a.order > b.order ? 1 : -1
            );
          }
        }
        return res;
      })
      .catch((err) => err);

    return result;
  }

  async findVideosByUuid(req, videoUuid: string): Promise<VideoSubject> {
    const testPressToken =
      '';

      var user_uuid = req.user.uuid;

      let userWatchVideos = await this.userModel
      .aggregate([
        { $match: { uuid: user_uuid } },
        { $unwind: '$userVideos' },
        {
          $match: {
            'userVideos.courseId': mongoose.Types.ObjectId(req.user.courses),
            'userVideos.uuid': videoUuid,
          },
        },
        {
          $project: {
            userVideos: 1,
          },
        },
      ])
      .exec()
      .then((res) => {
        let totalres = res.filter((it) => it)[0]
        return totalres;
      })

    var videoDetails = await this.videoSubjectModel
      .aggregate([
        // { $match: { "chapters.videos.uuid": videoUuid  } },
        {
          $match: {
            'chapters.videos.uuid': videoUuid,
            'flags.active': true,
            courses: mongoose.Types.ObjectId(req.user.courses),
          },
        },
        { $unwind: '$chapters' },
        {
          $addFields: {
            'chapters.videos': {
              $filter: {
                input: '$chapters.videos',
                cond: {
                  $eq: ['$$this.uuid', videoUuid],
                },
              },
            },
          },
        },
      ])
      .exec()
      .then((res) => {
        if(res.length == 0){
          return {};
        }
        let totalres = res.filter((it) => it.chapters.videos.length > 0)[0]
          .chapters.videos[0];
        return totalres;
      })
      .catch((err) => err);

      if(!videoDetails.videoId){
        return videoDetails;
      }
      let userVideoStatus = {
        uuid: videoDetails.uuid,
        vdoCipherId: videoDetails.videoId,
        title: videoDetails.title,
        status: 0,
        totalTime: videoDetails.totalTime,
        remainingTime: videoDetails.totalTime,
      };

      if(userWatchVideos){
        if(userWatchVideos.userVideos){
          videoDetails.userWatchVideos = userWatchVideos.userVideos;
        }
      }else{
        videoDetails.userWatchVideos = userVideoStatus;
      }


    if (videoDetails.videoType == 'TEST_PRESS') {
      var accessToken = '';
      try {
        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
          "time_to_live": "300",
          // "expires_after_first_usage":true
        });
        var config = {
          method: 'post',
          url:
            'https://domain.testpress.in/api/v2.5/admin/videos/' + videoDetails.androidUrl + '/access-tokens/',
          headers: {
            Authorization:
              '',
          },
          data: data,
        };

        await axios(config)
          .then(function (response) {
            var results = response.data;
            if(results){
              accessToken = response.data.code
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (error) {}
      videoDetails.accessToken = accessToken;
      videoDetails.iosUrl = accessToken;
    } else {
      videoDetails.accessToken = '';
    }
    return videoDetails;
  }

  async getPlaybackInfo(req, payload: VideoPlaybackInfoInterface) {
    var video = await this.httpService
      .post(`https://dev.vdocipher.com/api/videos/${payload.vdoCipherId}/otp`)
      .toPromise()
      .then(async (res) => {
        // const video: UserVideoInterface = {
        //   uuid: payload.videoUuid,
        //   vdoCipherId: payload.vdoCipherId,
        //   title: payload.title,
        //   status: UserVideoStatusEnum.PAUSED,
        //   remainingTime: payload.totalTime,
        // }
        // return await this.userModel.findOneAndUpdate(
        //   { uuid: req.user.uuid },
        //   { $push: { userVideos: video } },
        //   {new: true, useFindAndModify: false}
        // ).exec()
        //   .then(result => {
        return res.data;
        // })
      })
      .catch((err) => err);

    return {
      status: true,
      code: 2000,
      message: 'Video Fetched',
      data: video,
    };
  }

  async deleteByUuid(uuid: string) {
    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.videoSubjectModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.videoSubjectModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });

    return this.videoSubjectModel.findOneAndDelete({ uuid }).exec();
  }

  async create(
    createVideoSubjectDTO: CreateVideoSubjectDto
  ): Promise<VideoSubject> {
    const createdVideoSubject = new this.videoSubjectModel(
      createVideoSubjectDTO
    );
    const result = createdVideoSubject.save();
    return result;
  }

  async editByUuid(request: QBankInterface): Promise<VideoSubject> {
    const result = this.videoSubjectModel
      .findOneAndUpdate({ uuid: request.uuid }, request)
      .exec();
    // result.then(QBankSeries => {
    //   this.updateAssignments(QBankSeries);
    // })

    return result;
  }

  async updateVideoStatus(req, payload) {
    var videoUuid = payload.videoUuid;

    if (payload.videoUuid) {
      videoUuid = payload.videoUuid;
    } else {
      videoUuid = payload.uuid;
    }

    var videoInfo = await this.videoSubjectModel
      .aggregate([
        // { $match: { "chapters.videos.uuid": videoUuid,courses : req.user.courses } }, // course id added
        {
          $match: {
            'chapters.videos.uuid': videoUuid,
            courses: req.user.courses,
          },
        },
        { $unwind: '$chapters' },
        {
          $addFields: {
            'chapters.videos': {
              $filter: {
                input: '$chapters.videos',
                cond: {
                  $eq: ['$$this.uuid', videoUuid],
                },
              },
            },
          },
        },
        {
          $match: {
            chapters: {
              $ne: [],
            },
          },
        },
        {
          $addFields: {
            chapters: ['$chapters'],
          },
        },
      ])
      .exec()
      .then((res) => {
        return res;
        if (res[0]?.chapters[0]?.videos) {
          var v = res[0].chapters[0]?.videos;
          return v;
        }
        (err) => {
          return;
        };
      })
      .catch((err) => err);

    var videoSubjectId = '';
    var courseId = '';
    var syllabusId = '';
    if (videoInfo[0]) {
      videoSubjectId = videoInfo[0]._id;
      courseId = videoInfo[0].courses;
      syllabusId = videoInfo[0].syllabus;
    }

    const video: UserVideoInterface = {
      uuid: videoUuid,
      vdoCipherId: payload.vdoCipherId,
      videoSubjectId: videoSubjectId,
      courseId: courseId,
      syllabusId: syllabusId,
      title: payload.title,
      // status: UserVideoStatusEnum.PAUSED,
      status: payload.status,
      totalTime: payload.totalTime,
      remainingTime: payload.remainingTime,
      watchTime: payload.watchTime,
    };

    // console.log(video)
    var suggested = false;
    var videoss = {};
    if (videoInfo[0]?.chapters[0]?.videos) {
      videoss = videoInfo[0].chapters[0].videos[0];
      if (videoInfo[0]?.chapters[0]?.videos[0]) {
        suggested = videoInfo[0]?.chapters[0]?.videos[0]?.flags.suggested;
      }
    }

    // var normal = await this.updateNormalVideoStatus(req, payload, video);
    // var suggestedVideos = await this.updateSuggestedVideoStatus(suggested,req,payload,video);
    // if(normal){
    //   return normal;
    // }else{
    //   return suggestedVideos;
    // }

    // }
    // async updateSuggestedVideoStatus(suggested,req,payload,video){

    if (suggested) {
      var pull = await this.userModel
        .findOneAndUpdate(
          { uuid: req.user.uuid },
          {
            $pull: {
              userSuggestedVideos: { uuid: videoUuid, courseId: courseId },
            },
          },
          { new: true, useFindAndModify: false }
        )
        .exec();

      await this.userModel
        .findOneAndUpdate(
          { uuid: req.user.uuid },
          {
            $push: { userSuggestedVideos: video },
          },
          { new: true, useFindAndModify: false }
        )
        .exec()
        .then((result) => {
          return result.userSuggestedVideos;
        });
    }
    var pull = await this.userModel
      .findOneAndUpdate(
        { uuid: req.user.uuid },
        {
          // $pull: { 'userVideos.uuid' : payload.videoUuid },
          $pull: { userVideos: { uuid: videoUuid, courseId: courseId } },
        },
        { new: true, useFindAndModify: false }
      )
      .exec();

    return await this.userModel
      .findOneAndUpdate(
        { uuid: req.user.uuid },
        {
          $push: { userVideos: video },
        },
        { new: true, useFindAndModify: false }
      )
      .exec()
      .then((result) => {
        return result.userVideos;
      });
  }

  async getofflinePlaybackInfo(req, payload: VideoPlaybackInfoInterface) {
    var subscribeStatus = false;
    var userSubscriptions = req.user.subscriptions;
    var now = new Date();
    var toDate = new Date();
    now.setDate(now.getDate() + 15);
    userSubscriptions.forEach((element) => {
      if (subscribeStatus == false) {
        if (toDate <= element.expiry_date) {
          toDate = element.expiry_date;
        }
      }
    });

    var diff = (toDate.getTime() - now.getTime()) / 1000;
    diff /= 60 * 60; // For Hours
    //diff /= (60);          For Minutes
    var hrs = Math.abs(Math.round(diff));

    var body = {
      licenseRules: JSON.stringify({
        canPersist: true,
        rentalDuration: hrs * 3600,
      }),
    };
    // return body;
    var video = await this.httpService
      .post(
        `https://dev.vdocipher.com/api/videos/${payload.vdoCipherId}/otp`,
        body
      )
      .toPromise()
      .then(async (res) => {
        return res.data;
      })
      .catch((err) => err);

    return video;
  }
}
