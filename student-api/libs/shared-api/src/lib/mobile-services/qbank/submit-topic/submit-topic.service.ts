import { SubmitUserQBankTopicInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Uuid from 'uuid';
import { SubmitUserQBankTopicDTO } from '../../../dto';
import { SubmittedQBankTopic, User, UserQbankReset } from '../../../schema';

@Injectable()
export class SubmitQbankTopicService {

  payload: SubmitUserQBankTopicInterface;

  constructor(
    @InjectModel('SubmittedQBankTopic') private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('UserQbankReset') private UserQbankResetModel: Model<UserQbankReset>,

  ) { }

  async SubmittedTest(submitQBankTopicDTO: SubmitUserQBankTopicDTO, request): Promise<any> {
    this.payload = submitQBankTopicDTO;
    const userSubmission = await this.submittedQBankTopicModel.findOne(
      {
        'qbankTopicUuid': this.payload.qbankTopicUuid,
        'subjectId': this.payload.subjectId,
        'courseId': this.payload.courseId,
        'userId': this.payload.userId,
      }
    ).exec();
    this.payload.count = submitQBankTopicDTO.answers.length;
    this.compute();
    if (userSubmission) {
      const result = await this.submittedQBankTopicModel.findOneAndUpdate(
        {
          'qbankTopicUuid': this.payload.qbankTopicUuid,
          'subjectId': this.payload.subjectId,
          'courseId': this.payload.courseId,
          'userId': this.payload.userId,
        },
        this.payload,
        { new: true, useFindAndModify: false }
      ).exec();
    } else {
      this.payload.uuid = Uuid.v4();
      const submittedTest = new this.submittedQBankTopicModel(this.payload);
      await submittedTest.save();
    }
    // return submission
    return await this.changeTestState().then(async () => {

      return await this.computeRanks().then((res) => {
        return res;
      });

    });

  }

  compute() {

    this.buildStats();

    this.payload.answers.map((obj, index) => {

      // if(this.payload.answers[index].flags.markForReview == true) {
      //   this.payload.answers[index].flags.markForReview = true;
      //   ++this.payload.stats.review;
      // }else{
      //   this.payload.answers[index].flags.markForReview = false;
      // }
      if (this.payload.answers[index].flags.isBookMarked == true) {
        this.payload.answers[index].flags.isBookMarked = true;
        // ++this.payload.stats.bookmarkCount;
      } else {
        this.payload.answers[index].flags.isBookMarked = false;
      }

      if (this.payload.answers[index].flags.attempted == true) {
        ++this.payload.stats.totalAttempted;
        // ++this.payload.stats.bookmarkCount;
      }

      if (obj.answer === obj.question.answer) {
        // increment correct marks count
        this.payload.answers[index].flags.correct = true;
        ++this.payload.stats.correct;
      }

      if (obj.answer !== obj.question.answer) {
        // increment wrong marks count
        ++this.payload.stats.wrong;
        this.payload.answers[index].flags.wrong = true;
      }

    });

    this.payload.stats.percentages = {
      correct: (this.payload.stats.correct / this.payload.count) * 100,
      wrong: (this.payload.stats.wrong / this.payload.count) * 100,
    }

  }

  buildStats() {

    this.payload.stats = {
      total: 0,
      correct: 0,
      wrong: 0,
      totalAttempted: 0,
      percentages: {
        correct: 0,
        wrong: 0,
      }
    };

  }

  async computeRanks() {

    const sorted = await this.submittedQBankTopicModel.find(
      {
        'qbankTopicUuid': this.payload.qbankTopicUuid,
        'subjectId': this.payload.subjectId,
        'courseId': this.payload.courseId,
      }
    )
    // .sort([['stats.secureMarks', 'desc']])
      .exec();

    const userSubmission = await this.submittedQBankTopicModel.findOne(
      {
        'qbankTopicUuid': this.payload.qbankTopicUuid,
        'subjectId': this.payload.subjectId,
        'courseId': this.payload.courseId,
        'userId': this.payload.userId,
      }
    ).exec();

    //   const userSubmissionUsersTable = await this.userModel.findOne(
    //     {
    //       _id: this.payload.userId,
    //       'submissions.qbanks.qbankTopicUuid': this.payload.qbankTopicUuid,
    //       // 'submissions.qbanks.subjectId': this.payload.subjectId,
    //       // 'submissions.qbanks.courseId': this.payload.courseId,
    //     },{
    //       submissions:1
    //     }
    //   ).exec();

    //   var userTest = {}
    //   console.log(userSubmissionUsersTable)
    // if(userSubmissionUsersTable){
    //   const userTest = await this.userModel.findOneAndUpdate(
    //     { _id: this.payload.userId,
    //       'submissions.qbanks.qbankTopicUuid': this.payload.qbankTopicUuid,
    //       'submissions.qbanks.subjectId': this.payload.subjectId,
    //       'submissions.qbanks.courseId': this.payload.courseId,
    //       'submissions.qbanks.userId': this.payload.userId,
    //     },
    //     userSubmission,
    //     {new: true, useFindAndModify: false}
    //   )
    //   .exec();
    // }else{
    // await this.userModel
    // .findOneAndUpdate(
    //   { _id: mongoose.Types.ObjectId(this.payload.userId) },
    //   {
    //     $pull: {
    //        "submissions.qbanks":
    //        {"qbankTopicUuid": this.payload.qbankTopicUuid } ,
    //      },
    //   },
    //   {new: true, useFindAndModify: false}).exec();

    // const userTest = await this.userModel.findOneAndUpdate(
    //   { _id:  this.payload.userId },
    //   { $push: { "submissions.qbanks": userSubmission } },
    //   {new: true, useFindAndModify: false}
    // )
    // .exec();

    const submission = await this.userModel.findOneAndUpdate(
      { _id: this.payload.userId },
      {
        $addToSet: {
          "qbanksTestSubmissions": {
            qbankTopicUuid: this.payload.qbankTopicUuid,
            status: this.payload.status,
            startedAt: this.payload.startedAt,
            stoppedAt: this.payload.stoppedAt,
          }
        }
      },
      { new: true, useFindAndModify: false }
    ).exec();
    // }

    return { sorted, userSubmission, userTest: submission, submission };

  }

  changeTestState() {

    return this.userModel.findOneAndUpdate(
      { _id: this.payload.userId },
      {
        $pull: {
          qbanksTestSubmissions: {
            qbankTopicUuid: this.payload.qbankTopicUuid,
            // title: this.payload.topic.title
          }
        }
      },
      { new: true, useFindAndModify: false }
    );

  }


  async resetUserTest(req, request) {

    let userId = req.user._id;
    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let qbankTopicUuids = request.qbankTopicUuid;

    var check = await this.UserQbankResetModel.findOne(
      { userId: userId, qbankTopicUuid: request.qbankTopicUuid }
    ).exec();


    if (check) {
      var count = check.count;
      // console.log(count)
      if (count >= 10) {
        return { "status": false, "code": 2001, 'message': 'Test Reset Failed Your Crossed Your Limit ' + count, 'data': check }
      }

      this.UserQbankResetModel.findOneAndUpdate(
        { userId: userId, qbankTopicUuid: request.qbankTopicUuid },
        {
          $inc: {
            'count': 1,
          }
        },
        { new: true, useFindAndModify: false }
      ).exec();
    } else {
      new this.UserQbankResetModel({ userId: userId, qbankTopicUuid: request.qbankTopicUuid, count: 1 }).save();
    }

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
