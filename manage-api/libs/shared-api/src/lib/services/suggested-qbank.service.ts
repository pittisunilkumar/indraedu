import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { QBankSubject } from '../schema';
import { SuggestedQbank } from '../schema/suggested-qbank.schema';
//import { Course, QBank, QBankSubject, Syllabus } from '../schema';

@Injectable()
export class SuggestedQbankService {

  constructor(

    @InjectModel('SuggestedQbank') private suggestedQbankModel: Model<SuggestedQbank>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>
  ) { }

  async create(request) {

    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let chapterId = request.chapterId;
    let qbankUuid = request.qbankUuid;
    let status = request.status;

    let qbankData: any;

    qbankData = await this.suggestedQbankModel.find(
      {
        "courseId": courseId,
        "subjectId": subjectId,
        "chapterId": chapterId,
        "qbankUuid": qbankUuid
      }
    ).exec();
    if (qbankData.length > 0) {

      this.suggestedQbankModel.findOneAndUpdate(
        // filter and push to the object
        { courseId: courseId, subjectId: subjectId, chapterId: chapterId, qbankUuid: qbankUuid },

        // filter and set to the object
        {
          $set: { "status": status },
        },

      ).exec();
      return qbankData
    } else {
      if (status == true) {
        const createdSuggestedQbank = new this.suggestedQbankModel(request);
        const result = await createdSuggestedQbank.save();
        return result
      }

    }

  }
  async updateStatus(id, status) {
    return this.suggestedQbankModel.findOneAndUpdate(
      { _id: id },
      {
        "status": status.status,
      },
    ).exec();
  }

  async findAll(): Promise<SuggestedQbank[]> {
    //return 1;
    let new_result = [];
    await this.suggestedQbankModel.find()
      .populate({
        path: 'courseId',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      // .populate({
      //   path: 'subjectId',

      //   select: {
      //     "uuid": 1,
      //     "title": 1,
      //     "_id": 1,


      //   }
      // })
      .populate({
        path: 'chapterId',

        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,


        }
      }).exec().then(async topics => {
        for (var k = 0; k < topics.length; k++) {
          var result = await this.qbankSubjectModel.findOne({ _id: topics[k]['subjectId'] }, { syllabus: 1 })
            .populate({
              path: 'syllabus',
              select: {
                "uuid": 1,
                "title": 1,
                "_id": 1,
              }
            })
          console.log('result8978', result);
          let topicss = await this.qbankSubjectModel
            .aggregate([
              { $match: { "chapters.topics.uuid": topics[k]['qbankUuid'] } },
              { $unwind: "$chapters" },
              {
                $addFields: {
                  "chapters.topics": {
                    $filter: {
                      input: "$chapters.topics",
                      cond: { $eq: ["$$this.uuid", topics[k]['qbankUuid']] }
                    }
                  }
                }
              }
            ])
            .exec()
            .then(res => {
              let totalres = res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];
              return { title: totalres.title, uuid: totalres.uuid };
            })
            .catch(err => err);
          new_result.push({
            _id: topics[k]._id,
            course: topics[k].courseId,
            // subject: topics[k].subjectId,
            subject: result.syllabus,
            chapter: topics[k].chapterId,
            topic: topicss,
            status: topics[k].status,
            createdOn: topics[k].createdOn
          })
        };

      }).catch(err => err);

    return new_result;
  }

}