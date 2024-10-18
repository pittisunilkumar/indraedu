import { QBankInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQBankDTO, StartTopicDTO, StopTopicDTO } from '../../dto';
import { Course, QBank, QBankSubject, Syllabus, User } from '../../schema';

@Injectable()
export class MobileQbankService {

  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('QBank') private qbankModel: Model<QBank>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('Syllabus') private syllabus: Model<Syllabus>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async findAllTopicsBySubjectUuid(subjectUuid: string): Promise<QBank[]> {
    return this.qbankModel
      .find({ 'subject.uuid': subjectUuid })
      .exec();
  }

  async findByUuid(uuid: string): Promise<QBank> {
    return this.qbankModel.findOne({ uuid })
    .exec();
  }

  async findSubjectsByCourse(courseId: string): Promise<any> {

    return this.courseModel
      .find({ _id: courseId, 'flags.qBank': true }, { syllabus: 1, count: 1 })
      .populate({
        path: 'syllabus',
        select: '_id uuid title type',
        match: {
          type: { $eq: 'SUBJECT' },
          'flags.questionBank':  { $eq: true }
        }
      })
      .exec();

  }

  //============ START TOPIC ============

  async startTopic(testUuid: string, userUuid: string, startTopicDTO: StartTopicDTO): Promise<any> {

    return this.userModel.findOneAndUpdate(
      { uuid: userUuid },
      {
        $addToSet: {
          "qbanks":  {
            topic: startTopicDTO.topic,
            chapter: startTopicDTO.chapter,
            course: startTopicDTO.course,
            subject: startTopicDTO.subject,
            status: startTopicDTO.status,
            startedAt: startTopicDTO.startedAt,
          }
        }
      },
    ).exec().then(
      (res) => {
        return res.qbanks;
      },
      (err) => {
        return err;
      }
    )

  }

  //============ STOP TOPIC ============

  async stopTopic(topicUuid: string, userUuid: string, stopTopicDTO: StopTopicDTO): Promise<any> {

    return this.userModel.findOneAndUpdate(
      { uuid: userUuid,  },
      // filter and replace the object
      {
        $set : { "qbanks.$[elem]": stopTopicDTO },
      },
      { arrayFilters: [ { "elem.topic.uuid": { $eq: topicUuid } } ] },
    ).exec().then(
      (res) => {
        return res.qbanks;
      },
      (err) => {
        return err;
      }
    )

  }

}
