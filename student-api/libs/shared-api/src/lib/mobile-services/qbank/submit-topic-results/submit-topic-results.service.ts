import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubmittedQBankTopic, User } from '../../../schema';

@Injectable()
export class SubmitTopicResultsService {

  constructor(
    @InjectModel('SubmittedQBankTopic') private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getLeaderBoard(uuid: string, userUuid: string, query) {
    console.log({ query });

    const ranks = await this.submittedQBankTopicModel
      .find(
        { 'topic.uuid': uuid, 'subject.uuid': query.subject, 'course.uuid': query.course },
        { uuid: 1, stats: 1, user: 1, test: 1, submittedOn: 1, count: 1, rank: 1, totalUsers: 1,
          "answers.flags.correct": 1, "answers.flags.wrong": 1 }
      )
      .sort([ ['stats.secureMarks', 'desc'] ])
      .exec();

    const analysis = ranks.filter((it, index) => {
      it.rank = index + 1;
      return it.userId === userUuid
    });

    return { analysis: analysis[0] }

  }

  async getReview(uuid, userUuid) {

    console.log(uuid, userUuid._id)
    const userSubmission = await this.submittedQBankTopicModel
      .aggregate([
      { $match: { "qbankTopicUuid": uuid,"userId": userUuid._id } },
      {
        $unwind: "$answers"
      },
      {
        $unwind: "$answers.question"
      },
      {
        $lookup: // Equality Match
        {
          from: "questions",
          localField: "answers.question.uuid",
          foreignField: "uuid",
          as: "answers.questions",
        }
      },
      ]).exec();
      return userSubmission;
    // return this.userModel.aggregate([
    //   { $match: { uuid: '0347b50f-d71e-44de-ab4f-e246c4c3327a' } },
    //   {
    //     $unwind: "$answers"
    //   },
    //   {
    //     $unwind: "$answers.question"
    //   },
    //   {
    //     $lookup: // Equality Match
    //     {
    //       from: "questions",
    //       localField: "answers.question.uuid",
    //       foreignField: "uuid",
    //       as: "answers.questions",
    //     },
    //   { $addFields: { "submissions": {
    //     $filter: {
    //       input: "$submissions.qbanks",
    //       cond: {
    //         $eq: [ "$$this.qbankTopicUuid", '3fdc91c1-e3b7-4fbe-b7c7-01ec31cb196f' ]
    //       }
    //     }
    //   }}},
    //   { $match: {
    //     "submissions.qbanks": {
    //       $ne: []
    //     }
    //   }},
    //   {
    //     $addFields: {
    //       submissions: {
    //         tests: "$submissions.qbanks",
    //       }
    //     }
    //   }
    // ]).exec()
    // .then(res => {
    //   return res[0].submissions;
    // })
    // .catch(err => err);

  }

  async getReviewQuestionDetails(uuid: string, userUuid: string, questionUuid: string, query) {

    return this.userModel
      .aggregate([
        {
          $match: {
            uuid: userUuid,
            "submissions.qbanks.qbankTopicUuid": uuid,
            "submissions.qbanks.answers.question.uuid": questionUuid,
          }
        },
        {
          $addFields: {
            "submissions.qbanks": {
              $filter: {
                input: "$submissions.qbanks",
                cond: {
                  $eq: [ "$$this.qbankTopicUuid", uuid ]
                },
              }
            }
          }
        },
        { $unwind: "$submissions.qbanks" },
        {
          $addFields: {
            "submissions.qbanks.answers": {
              $filter: {
                input: "$submissions.qbanks.answers",
                cond: {
                  $eq: [ "$$this.question.uuid", questionUuid ]
                },
              }
            }
          }
        },
      ])
      .exec()
      .then(res => {
        return res[0].submissions.qbanks.answers[0];
      })
      .catch(err => err);

  }

}
