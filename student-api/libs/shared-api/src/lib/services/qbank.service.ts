import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankDTO } from '../dto';
import { Course, QBank, QBankSubject,Syllabus } from '../schema';

@Injectable()
export class QbankService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Syllabus') private syllabusModel: Model<Syllabus>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
 //   @InjectModel('QBank') private qbankmodel: Model<QBank>,
  ) {}

  async findByUuid(subjectUuid: string,chapterUuid:string, uuid: string): Promise<any> {
    let chapterobj=await this.syllabusModel.find({uuid: chapterUuid},{"_id":1,"uuid":1,"title":1}).exec();
    //let res=await this.qbankSubjectModel.find({uuid: subjectUuid, "chapters.topics.uuid": uuid},{"chapters.topics":1}).exec();
    //res.chapters[0]=chapterobj;
    //return res;
        return this.qbankSubjectModel
        .aggregate([
          { $match: { uuid: subjectUuid, "chapters.topics.uuid": uuid } },
          { $unwind: "$chapters" },
          { $addFields: {
            "chapters.topics": {
              $filter: {
                input: "$chapters.topics",
                cond: { $eq: [ "$$this.uuid", uuid ] }
              }
            }
            
          }},
        ])
        .exec()
        .then(res => {
          let totalres= res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];
          totalres['chapter']=chapterobj[0];
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
        $inc : { 'count' : -1 }
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
  async editByUuid(request: QBankInterface): Promise<QBankSubject> {
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
  }

}
