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
      .sort([ ['stats.total', 'desc'] ])
      .exec();

    const analysis = ranks.filter((it, index) => {
      it.rank = index + 1;
      // return it.user.uuid === userUuid
    });

    return { analysis: analysis[0] }

  }

  async getReview(uuid: string, userUuid: string) {

    return this.userModel.aggregate([
      { $match: { uuid: userUuid } },
      { $addFields: { "submissions": {
        $filter: {
          input: "$submissions.qbanks",
          cond: {
            $eq: [ "$$this.topic.uuid", uuid ]
          }
        }
      }}},
      { $match: {
        "submissions.qbanks": {
          $ne: []
        }
      }},
      {
        $addFields: {
          submissions: {
            tests: "$submissions.qbanks",
          }
        }
      }
    ]).exec()
    .then(res => {
      return res[0].submissions;
    })
    .catch(err => err);

  }

  async getReviewQuestionDetails(uuid: string, userUuid: string, questionUuid: string, query) {

    return this.userModel
      .aggregate([
        {
          $match: {
            uuid: userUuid,
            "submissions.qbanks.topic.uuid": uuid,
            "submissions.qbanks.answers.question.uuid": questionUuid,
          }
        },
        {
          $addFields: {
            "submissions.qbanks": {
              $filter: {
                input: "$submissions.qbanks",
                cond: {
                  $eq: [ "$$this.topic.uuid", uuid ]
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
