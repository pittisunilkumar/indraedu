import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CommonFunctions } from '../../../helpers/functions';
import { SubmittedTest, User, TSCategories } from '../../../schema';

@Injectable()
export class TestResultsService {
  constructor(
    @InjectModel('SubmittedTest')
    private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>
  ) {}

  async getLeaderBoard(request, body) {
    const sortedss = await this.submittedTestModel
      .find({
        testSeriesUuid: body.testSeriesUuid,
        categoryUuid: body.categoryUuid,
        courseId: body.courseId,
        // "status":2
      })
      // .sort([ ['stats.secureMarks', 'desc'] ])
      .countDocuments();

    const ranksss = await this.submittedTestModel
      .updateMany(
        {
          testSeriesUuid: body.testSeriesUuid,
          categoryUuid: body.categoryUuid,
          courseId: body.courseId,
          // "status":2
        },
        {
          $set: {
            totalUsers: sortedss,
          },
        }
      )
      .exec();

    const getTestDetails = await this.getTestDetails(body.testSeriesUuid);

    const ranks = await this.submittedTestModel
      .find(
        {
          testSeriesUuid: body.testSeriesUuid,
          categoryUuid: body.categoryUuid,
          courseId: body.courseId,
          status: 2,
        },
        {
          uuid: 1,
          stats: 1,
          userId: 1,
          testSeriesUuid: 1,
          submittedOn: 1,
          count: 1,
          // rank: 1,
          totalUsers: 1,
        }
      )
      .populate({
        path: 'userId',
        model: 'User',
        select: {
          _id: 1,
          name: 1,
          uuid: 1,
          imgUrl: 1,
        },
      })
      .sort({ 'stats.secureMarks': -1 })
      // .countDocuments();
      .exec();

    const analysis = ranks.filter((it, index) => {
      it.rank = index + 1;
      var id = it.userId;
      if (id) {
        var userID = id['_id'];
        return userID.toString() === request.user._id.toString();
      }
    });

    var analysiss = {};
    if (analysis.length > 0) {
      analysiss = analysis[0];
    }
    // var ranksss = ranks.slice(0, 10);
    // ranksss.map(data =>{
    //     console.log(data);
    // });
    var title = '';
    var ranksssss = ranks.slice(0, 10);
    var showResult = 0;
    if (getTestDetails?.title) {
      title = getTestDetails?.title;
    }
    if (getTestDetails.testStatus == 2) {
      if (new Date(getTestDetails.expiryDate) < new Date()) {
        if (new Date(getTestDetails.resultDate) < new Date()) {
        } else {
          showResult = 1;
          try {
            title =
              'Results will show On ' +
              new Date(
                CommonFunctions.getISTTime(getTestDetails.resultDate)
              ).toLocaleString();
          } catch (error) {
            title =
              'Results will show On ' +
              CommonFunctions.getISTTime(getTestDetails.resultDate);
          }
          analysiss = {};
          ranksssss = [];
        }
      } else {
        showResult = 1;
        try {
          title =
            'Results will show On ' +
            new Date(
              CommonFunctions.getISTTime(getTestDetails.resultDate)
            ).toLocaleString();
        } catch (error) {
          title =
            'Results will show On ' +
            CommonFunctions.getISTTime(getTestDetails.resultDate);
        }
        analysiss = {};
        ranksssss = [];
      }
    }
    ranksssss.map((user) => {
      var userDetailss = user.userId;
      if (userDetailss) {
        if (user.users) {
          user.users = user.users;
        } else {
          user.users = userDetailss;
        }
        // user.users = userDetailss;
        // user.userId = userDetailss['_id']
      } else {
        user.users = {
          name: 'noName',
          uuid: '',
          _id: '',
        };
        user.userId = '62567c0b1a005c3554ba3b37';
      }
      user.userId = '62567c0b1a005c3554ba3b37';
      user.answers = [];
    });

    // console.log(analysis)
    analysis.map((user) => {
      // console.log(user)
      var userDetailssss = user.userId;
      // user.userId = ''

      if (userDetailssss) {
        if (user.users) {
          user.users = user.users;
        } else {
          user.users = userDetailssss;
        }
        //   user.userId = ''
      } else {
        user.users = {
          name: 'noName',
          uuid: '',
          _id: '',
        };
        user.userId = '62567c0b1a005c3554ba3b37';
      }
      user.userId = '62567c0b1a005c3554ba3b37';

      user.answers = [];
    });

    return {
      analysis: analysiss,
      ranks: ranksssss,
      title: title,
      // testDetails : getTestDetails?.tests
    };
  }
  async getTestDetails(testSeriesUuid) {
    return await this.TSCategoriesModel.aggregate([
      { $match: { 'categories.tests.uuid': testSeriesUuid } },
      // { $match: { courses : mongoose.Types.ObjectId(body.courseId) } },
      { $unwind: '$categories' },
      {
        $project: {
          tests: {
            $filter: {
              input: '$categories.tests',
              cond: {
                $eq: ['$$this.uuid', testSeriesUuid],
              },
            },
          },
        },
      },
      {
        $unwind: '$tests',
      },
      {
        $project: {
          _id: 0,
          title: '$tests.title',
          subjects: '$tests.subjects',
          testStatus: '$tests.testStatus',
          expiryDate: '$tests.expiryDate',
          resultDate: '$tests.resultDate',
          tests: 1,
        },
      },
    ])
      .exec()
      .then((res) => {
        return res[0];
      })
      .catch((err) => err);
  }

  async getReview(uuid: string, userUuid: string) {
    return this.userModel
      .aggregate([
        { $match: { uuid: userUuid } },
        {
          $addFields: {
            submissions: {
              $filter: {
                input: '$submissions.tests',
                cond: {
                  $eq: ['$$this.test.uuid', uuid],
                },
              },
            },
          },
        },
        {
          $match: {
            'submissions.tests': {
              $ne: [],
            },
          },
        },
        {
          $addFields: {
            submissions: {
              tests: '$submissions.tests',
            },
          },
        },
      ])
      .exec()
      .then((res) => {
        return res[0].submissions;
      })
      .catch((err) => err);
  }

  async getReviewQuestionDetails(
    uuid: string,
    userUuid: string,
    questionUuid: string
  ) {
    return this.userModel
      .aggregate([
        {
          $match: {
            uuid: userUuid,
            'submissions.tests.test.uuid': uuid,
            'submissions.tests.answers.question.uuid': questionUuid,
          },
        },
        {
          $addFields: {
            'submissions.tests': {
              $filter: {
                input: '$submissions.tests',
                cond: {
                  $eq: ['$$this.test.uuid', uuid],
                },
              },
            },
          },
        },
        { $unwind: '$submissions.tests' },
        {
          $addFields: {
            'submissions.tests.answers': {
              $filter: {
                input: '$submissions.tests.answers',
                cond: {
                  $eq: ['$$this.question.uuid', questionUuid],
                },
              },
            },
          },
        },
      ])
      .exec()
      .then((res) => {
        return res[0].submissions.tests.answers[0];
      })
      .catch((err) => err);
  }
}
