import { VideoInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVideoDTO } from '../dto/create-video.dto';
import { Course, Video, VideoSubject, Syllabus } from '../schema';

@Injectable()
export class VideosService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
  ) { }

  async addSubjectVideo(createVideoDTO: CreateVideoDTO): Promise<VideoSubject> {
    return this.videoSubjectModel
      .findOneAndUpdate(
        { uuid: createVideoDTO.videoSubjectUuid },
        // filter and push to the object
        {
          $push: { "chapters.$[elem].videos": createVideoDTO.videos },
          $inc: { 'count': 1 }
        },
        { arrayFilters: [{ "elem.uuid": { $eq: createVideoDTO.chapter } }] },
      )
      .exec();


  }

  async deleteByUuid(subjectUuid: string, videoUuid: string) {
    return this.videoSubjectModel
      .findOneAndUpdate(
        { uuid: subjectUuid },
        // filter and push to the object
        {
          $pull: { "chapters.$[].videos": { uuid: videoUuid } },
          $inc: { 'count': -1 }
        },
      )
      .exec();
  }

  async editVideoByUuid(
    request: VideoInterface
  ): Promise<any> {
     this.videoSubjectModel
      .findOneAndUpdate(
        { uuid: request.videoSubjectUuid },
        // filter and push to the object
        {
          $pull: { "chapters.$[].videos": { uuid: request.videos.uuid } },
          //   $inc : { 'count' : -1 }
        },
      )
      .exec();
    // pushing into new chapter
     return this.videoSubjectModel
      .findOneAndUpdate(
        {
          // courses: request.courses,
          uuid: request.videoSubjectUuid
         },
        // filter and push to the object
        {
          $push: { "chapters.$[elem].videos": request.videos }
         // $inc : { 'count' : 1 }
        },
        { arrayFilters: [ { "elem.uuid": { $eq: request.chapter } } ] },
      )
      .exec();
  }

  /* ****************************CLEAN-UP****************************************** */

  // @TODO

  // async findAll(subjectUuid: string): Promise<Video[]> {
  //   return this.videoSubjectModel
  //   .find({ 'subject.uuid': subjectUuid })
  //   .exec();
  // }

  // async findByCourse(courseId: string): Promise<any> {

  //   const matchedCourse = await this.courseModel.find({ _id: courseId }).exec();

  //   return this.videoSubjectModel
  //   .find({ courses: courseId }, { id: 1, uuid: 1, title: 1})
  //   .exec();

  // }

  // async findSuggestedSeries(): Promise<Video[]> {
  //   return this.videoModel.find({$eq: [{ flags : { suggested:true } }] })
  //   .populate('courses')
  //   .populate('subjects')
  //   .populate('chapters')
  //   .exec();
  // }

  async findByUuid(subjectUuid: string, chapterUuid: string, uuid: string): Promise<any> {
    let chapterobj = await this.syllabusModel.find({ uuid: chapterUuid }, { "_id": 1, "uuid": 1, "title": 1 }).exec();
    return this.videoSubjectModel
      .aggregate([
        { $match: { uuid: subjectUuid, "chapters.videos.uuid": uuid } },
        { $unwind: "$chapters" },
        {
          $addFields: {
            "chapters.videos": {
              $filter: {
                input: "$chapters.videos",
                cond: { $eq: ["$$this.uuid", uuid] }
              }
            }
          }
        },
      ])
      // .sort({order:'ASC'})
      .exec()
      .then(res => {
        let totalres = res.filter(it => it.chapters.videos.length > 0)[0].chapters.videos[0];
        totalres['chapter'] = chapterobj[0];
        return totalres;
      })
      .catch(err => err);
  }

}
