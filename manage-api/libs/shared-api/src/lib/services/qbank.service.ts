import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankDTO } from '../dto';
import { Course, QBank, QBankSubject, Question, Syllabus,SubmittedQBankTopic, User } from '../schema';
import * as mongoose from 'mongoose';

@Injectable()
export class QbankService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('SubmittedQBankTopic') private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('User') private userModel: Model<User>,
    //   @InjectModel('QBank') private qbankmodel: Model<QBank>,
  ) { }

  // async findByUuid(subjectUuid: string, chapterUuid: string, uuid: string): Promise<any> {
  //   let chapterobj = await this.syllabusModel.find({ uuid: chapterUuid }, { "_id": 1, "uuid": 1, "title": 1 }).exec();
  //   //let res=await this.qbankSubjectModel.find({uuid: subjectUuid, "chapters.topics.uuid": uuid},{"chapters.topics":1}).exec();
  //   //res.chapters[0]=chapterobj;
  //   //return res;
  //   return this.qbankSubjectModel
  //     .aggregate([
  //       { $match: { uuid: subjectUuid, "chapters.topics.uuid": uuid } },
  //       { $unwind: "$chapters" },
  //       {
  //         $addFields: {
  //           "chapters.topics": {
  //             $filter: {
  //               input: "$chapters.topics",
  //               cond: { $eq: ["$$this.uuid", uuid] }
  //             }
  //           }

  //         }
  //       },
  //     ])
  //     .exec()
  //     .then(res => {
  //       let totalres = res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];
  //       totalres['chapter'] = chapterobj[0];
  //       return totalres;
  //     })
  //     .catch(err => err);

  // }
  async findByUuid(subjectUuid: string, chapterUuid: string, uuid: string): Promise<any> {
    let chapterobj = await this.syllabusModel.find({ uuid: chapterUuid }, { "_id": 1, "uuid": 1, "title": 1 }).exec();
    return await this.qbankSubjectModel
      .aggregate([
        { $match: { uuid: subjectUuid, "chapters.topics.uuid": uuid } },
        { $unwind: "$chapters" },
        {
          $addFields: {
            "chapters.topics": {
              $filter: {
                input: "$chapters.topics",
                cond: { $eq: ["$$this.uuid", uuid] }
              }
            }
          }
        },
      ])
      .exec()
      .then(async res => {
        let totalres = res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];
        var questionsDatas = [];
        if(totalres.que){
              for (var j = 0; j < totalres.que.length; j++) {
              let name = '';
              var  obj= await this.questionModel.findOne({"uuid": totalres.que[j].uuid},{ title: 1 }).exec();
              if (obj) {
                name = obj.title;
              }
              totalres.que[j]['title'] = name ;
            };
        }
        totalres['chapter'] = chapterobj[0];
        return totalres;
      })
      .catch(err => err);
  }


  async deleteByUuid(subjectUuid: string, topicUuid: string) {

    return this.qbankSubjectModel
      .findOneAndUpdate(
        { uuid: subjectUuid },
        // filter and push to the object
        {
          $pull: { "chapters.$[].topics": { uuid: topicUuid } },
          $inc: { 'count': -1 }
        },
      )
      .exec();
  }

  /*async editByUuid(request: QBankInterface): Promise<QBankSubject> {

    return this.qbankSubjectModel.findOneAndUpdate(
      { uuid: request.subject.uuid },
      // filter and set object
      { $set: { 'chapters.$[outer].topics.$[inner]': request } },
      { arrayFilters: [
        { "outer.uuid": request.chapter.uuid },
        { 'inner.uuid': request.uuid }
      ] },
    ).exec();

  }*/
  /*async editByUuid(request: QBankInterface): Promise<QBankSubject> {
    //console.log('request data',request);
    

    // return request.topics;
    // return this.qbankSubjectModel.findOneAndUpdate(
    //   { uuid: request.uuid },
    //   // filter and set object
    //   { $set: { 'chapters.$[outer].topics.$[inner]': request.topics } },
    //   { arrayFilters: [
    //     { "outer.uuid": request.chapter_uuid },
    //     { 'inner.uuid': request.topic_uuid }
    //   ] }, 
    // ).exec();
    var topic_uuid = request.topic_uuid
    // removing from existing chapter
    this.qbankSubjectModel
        .findOneAndUpdate(
          { uuid: request.qbank_subject_uuid },
          // filter and push to the object
          {
            $pull: { "chapters.$[].topics": { uuid:topic_uuid } },
            $inc : { 'count' : -1 }
          },
        )
        .exec();
      // pushing into new chapter
    return this.qbankSubjectModel
      .findOneAndUpdate(
        {
          courses: request.courses,
          syllabus: request.subject,
         },
        // filter and push to the object
        {
          $push: { "chapters.$[elem].topics": request.topics },
          $inc : { 'count' : 1 }
        },
        { arrayFilters: [ { "elem.uuid": { $eq: request.chapter_uuid } } ] },
      )
      .exec();
  }*/


  async editByUuid(request: QBankInterface): Promise<QBankSubject> {
    return this.qbankSubjectModel
      .findOneAndUpdate(

        {
          uuid: request.qbank_subject_uuid
        },

        {
          $set: {
            "chapters.$[elem].topics.$[elem1]": request.topics,
          }
          // $inc: { 'count': 1 }
        },

        {
          arrayFilters: [{ "elem.uuid": { $eq: request.chapter_uuid } },
          { "elem1.uuid": { $eq: request.topics.uuid } }
          ]
        },

      ).exec();

  }

  async resetUserTest(userId, request) {

    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let qbankTopicUuids = request.qbankTopicUuid;

    this.submittedQBankTopicModel.remove(
      {
        "userId": mongoose.Types.ObjectId(userId),
        "courseId": mongoose.Types.ObjectId(courseId),
        //  "subjectId": mongoose.Types.ObjectId(subjectId),
        "qbankTopicUuid": qbankTopicUuids
      },
    ).exec();

    var data = await this.removeQbanksubmissions(userId, qbankTopicUuids).then(async () => {

      return await this.removeQbanksTestSubmissions(userId, qbankTopicUuids).then((res) => {
        return res;
      });

    });
    // return true;
    return { "status": true, "code": 2000, 'message': 'Test Reset Done ', 'data': data }
  }

   async removeQbanksubmissions(userId, qbankTopicUuid) {

    return await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            "submissions.qbanks": { "qbankTopicUuid": qbankTopicUuid },
          }
        },
        { new: true, useFindAndModify: false }
      ).exec();

  }

  async removeQbanksTestSubmissions(userId, qbankTopicUuid) {

    var submission = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          qbanksTestSubmissions: {
            qbankTopicUuid: qbankTopicUuid,
          }
        }
      },
      { new: true, useFindAndModify: false }
    );
    return submission.qbanksTestSubmissions

  }

}
