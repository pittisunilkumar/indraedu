import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubmittedTest, User } from '../../../schema';

@Injectable()
export class TestResultsService {

  constructor(
    @InjectModel('SubmittedTest') private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async getLeaderBoard(uuid: string, userUuid: string, query) {
    console.log({ query });

    const ranks = await this.submittedTestModel
      .find(
        { 'test.uuid': uuid, 'category.uuid': query.category, 'course.uuid': query.course },
        { uuid: 1, stats: 1, user: 1, test: 1, submittedOn: 1, count: 1, rank: 1, totalUsers: 1,
          "answers.question.postive": 1, "answers.question.negative": 1,
          "answers.flags.correct": 1, "answers.flags.wrong": 1 }
      )
      .sort([ ['stats.total', 'desc'] ])
      .exec();

    const analysis = ranks.filter((it, index) => {
      it.rank = index + 1;
      return it.user.uuid === userUuid
    });

    return { analysis: analysis[0], ranks: ranks.slice(0, 50) }

  }

  async getReview(uuid: string, userUuid: string) {

    return this.userModel.aggregate([
      { $match: { uuid: userUuid } },
      { $addFields: { "submissions": {
        $filter: {
          input: "$submissions.tests",
          cond: {
            $eq: [ "$$this.test.uuid", uuid ]
          }
        }
      }}},
      { $match: {
        "submissions.tests": {
          $ne: []
        }
      }},
      {
        $addFields: {
          submissions: {
            tests: "$submissions.tests",
          }
        }
      }
    ]).exec()
    .then(res => {
      return res[0].submissions;
    })
    .catch(err => err);

  }

  async getReviewQuestionDetails(uuid: string, userUuid: string, questionUuid: string) {

    return this.userModel
      .aggregate([
        {
          $match: {
            uuid: userUuid,
            "submissions.tests.test.uuid": uuid,
            "submissions.tests.answers.question.uuid": questionUuid,
          }
        },
        {
          $addFields: {
            "submissions.tests": {
              $filter: {
                input: "$submissions.tests",
                cond: {
                  $eq: [ "$$this.test.uuid", uuid ]
                },
              }
            }
          }
        },
        { $unwind: "$submissions.tests" },
        {
          $addFields: {
            "submissions.tests.answers": {
              $filter: {
                input: "$submissions.tests.answers",
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
        return res[0].submissions.tests.answers[0];
      })
      .catch(err => err);

  }

}
