import { QBankInterface, UserVideoInterface, UserVideoStatusEnum, VideoPlaybackInfoInterface } from '@application/api-interfaces';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { CreateVideoSubjectDto } from '../dto';
import { User, VideoSubject } from '../schema';

@Injectable()
export class MobileVideoSubjectService {

  constructor(
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('User') private userModel: Model<User>,
    private httpService: HttpService
  ) {}

  async findByCourse(courseId: string) {

    return this.videoSubjectModel
      .find({ courses: courseId }, { id: 1, uuid: 1, title: 1, count: 1, imgUrl: 1 })
      .exec();

  }

  async findAllChaptersBySubjectUuid(subjectUuid: string): Promise<{ title: string }[]> {
    return this.videoSubjectModel
      .find({ 'uuid': subjectUuid }, { chapters: 1 })
      .exec();
  }

  async findAll(): Promise<VideoSubject[]> {
    return this.videoSubjectModel
      .find()
      .exec();
  }

  async findSubjectChaptersByUuid(uuid: string): Promise<VideoSubject> {
    return this.videoSubjectModel
      .findOne({ uuid },
        { courses: 0, createdOn: 0, modifiedOn: 0, createdBy: 0, modifiedBy: 0,
        "chapters.videos.subject": 0, "chapters.videos.chapter": 0 }
      )
      .exec();
  }

  async findVideosByUuid(videoUuid: string): Promise<VideoSubject> {

    return this.videoSubjectModel
    .aggregate([
      { $match: { "chapters.videos.uuid": videoUuid } },
      { $unwind: "$chapters" },
      { $addFields: { "chapters.videos": { $filter: {
        input: "$chapters.videos",
        cond: {
          $eq: [
            "$$this.uuid",
            videoUuid
          ]
        }
      }}}},
      { $match: {
        "chapters": {
          $ne: []
        }
      }},
      {
        $addFields: {
          chapters: [
            "$chapters"
          ]
        }
      }
    ])
    .exec()
    .then(res => {
      return res[0].chapters[0].topics[0];
    })
    .catch(err => err);

  }

  getPlaybackInfo(videoUuid: string, payload: VideoPlaybackInfoInterface) {

    return this.httpService.post(`https://dev.vdocipher.com/api/videos/${payload.vdoCipherId}/otp`)
      .toPromise()
      .then(res => {
        const video: UserVideoInterface = {
          uuid: videoUuid,
          vdoCipherId: payload.vdoCipherId,
          title: payload.title,
          status: UserVideoStatusEnum.PAUSED,
          remainingTime: payload.totalTime,
        }
        return this.userModel.findOneAndUpdate(
          { uuid: payload.userUuid },
          { $push: { videos: video } }
        ).exec()
          .then(result => {
            return res.data;
          })
      })
      .catch(err => err);

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

  async create(createVideoSubjectDTO: CreateVideoSubjectDto): Promise<VideoSubject> {
    const createdVideoSubject = new this.videoSubjectModel(createVideoSubjectDTO);
    const result = createdVideoSubject.save();
    return result;
  }

  async editByUuid(request: QBankInterface): Promise<VideoSubject> {
    const result = this.videoSubjectModel.findOneAndUpdate(
      { uuid: request.uuid },
      request
    ).exec();
    // result.then(QBankSeries => {
    //   this.updateAssignments(QBankSeries);
    // })

    return result;
  }
}
