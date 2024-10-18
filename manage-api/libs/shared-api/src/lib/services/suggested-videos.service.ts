import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { identity } from 'rxjs';
import { CreateSubscriptionDto } from '../dto';
import { VideoSubject, SuggestedVideos } from '../schema';
//import { Course, QBank, QBankSubject, Syllabus } from '../schema';

@Injectable()
export class SuggestedVideosService {

  constructor(
    @InjectModel('SuggestedVideos') private suggestedVideosModel: Model<SuggestedVideos>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,

  ) { }

  async create(request) {
    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let chapterId = request.chapterId;
    let videoUuid = request.videoUuid;
    let status = request.status;
    let videoData: any;
    videoData = await this.suggestedVideosModel.find(
      {
        "courseId": courseId,
        "subjectId": subjectId,
        "chapterId": chapterId,
        "videoUuid": videoUuid
      }
    ).exec();
    if (videoData.length > 0) {

      this.suggestedVideosModel.findOneAndUpdate(
        // filter and push to the object
        { courseId: courseId, subjectId: subjectId, chapterId: chapterId, videoUuid: videoUuid },

        // filter and set to the object
        {
          $set: { "status": status },
        },

      ).exec();
      return videoData
    } else {
      if (status == true) {
        const createdSuggestedVideos = new this.suggestedVideosModel(request);
        const result = await createdSuggestedVideos.save();
        return result
      }
    }

  }
  async updateStatus(id, status) {    
    return this.suggestedVideosModel.findOneAndUpdate(
      { _id: id },
      {
        "status": status.status,
      },
    ).exec();
  }
  async deleteByCourse(courseId) {    
    let data =await this.suggestedVideosModel.find(
      { courseId: courseId}
    ).exec();
    console.log('data8978',data);
    
    data.map(res=>{
      this.suggestedVideosModel.findOneAndDelete(
        { _id: res._id }
      ).exec();
    })
  }
  async findAll(): Promise<SuggestedVideos[]> {
    //return 1;
    let new_result = [];
    await this.suggestedVideosModel.find()
      .populate({
        path: 'courseId',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      .populate({
        path: 'subjectId',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,


        }
      }).populate({
        path: 'chapterId',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,


        }
      }).exec().then(async videos => {
        for (var k = 0; k < videos.length; k++) {
          let videoss = await this.videoSubjectModel
            .aggregate([
              { $match: { "chapters.videos.uuid": videos[k]['videoUuid'] } },
              { $unwind: "$chapters" },
              {
                $addFields: {
                  "chapters.videos": {
                    $filter: {
                      input: "$chapters.videos",
                      cond: { $eq: ["$$this.uuid", videos[k]['videoUuid']] }
                    }
                  }
                }
              }
            ])
            .exec()
            .then(res => {
              let totalres = res.filter(it => it.chapters.videos.length > 0)[0].chapters.videos[0];
              // console.log('totalrestotalres', totalres.title);
              // return totalres
              return { title: totalres.title, uuid: totalres.uuid };
            })
            .catch(err => err);
          // console.log('videoss',videoss);

          new_result.push({
            _id: videos[k]._id,
            course: videos[k].courseId,
            subject: videos[k].subjectId,
            chapter: videos[k].chapterId,
            video: videoss,
            status: videos[k].status,
            createdOn: videos[k].createdOn
          })
        };

      }).catch(err => err);

    return new_result;
  }






}