import {
  AboutInterface,
  HomePageDataInterface,
  QBankInterface,
  UserVideoInterface,
  VideoInterface,
} from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Banner,
  Course,
  User,
  QBank,
  QBankSubject,
  Test,
  Video,
  VideoSubject,
  SuggestedVideos,
  SuggestedTests,
  SuggestedQbank,
  SubmittedQBankTopic,
  TSCategories,
  SubmittedTest,
  MCQOfTheDay,
  Subscription,
  UserNotifications,
  DisableUserForTestSubmit,
  Groups,
} from '../schema';
import { QuestionsService } from '../services/questions.service';
import * as mongoose from 'mongoose';

// export interface HomePageDataInterface {
// banners: { imgUrl: string; link: string }[];
// suggested: {
//   qbanks: QBankInterface[];
//   // videos: VideoInterface[];
//   videos: any;
//   tests: Test[];
// }
// }

export interface HomePageCourseInterface {
  uuid: string;
  id: string;
  title: string;
  imgUrl: string;
}

export interface ApiResponseInterface {
  status: boolean;
  code: number;
  message: string;
  data: any;
}

@Injectable()
export class MobileHomeService {
  constructor(
    @InjectModel('Banner') private bannersModel: Model<Banner>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Groups') private groupsModel: Model<Groups>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Test') private testModel: Model<Test>,
    @InjectModel('TSCategories') private testSeriesModel: Model<TSCategories>,
    @InjectModel('VideoSubject') private videoSubjectModel: Model<VideoSubject>,
    @InjectModel('SuggestedVideos')
    private suggestedVideosModel: Model<SuggestedVideos>,
    @InjectModel('SuggestedQbank')
    private suggestedQbankModel: Model<SuggestedQbank>,
    @InjectModel('SuggestedTests')
    private suggestedTestsModel: Model<SuggestedTests>,
    @InjectModel('QBankSubject') private qbankSubjectModel: Model<QBankSubject>,
    @InjectModel('SubmittedQBankTopic')
    private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('SubmittedTest')
    private submittedTestModel: Model<SubmittedTest>,
    @InjectModel('MCQOfTheDay') private mcqOfTheModel: Model<MCQOfTheDay>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('UserNotifications')
    private userNotifications: Model<UserNotifications>,
    @InjectModel('DisableUserForTestSubmit')
    private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>
  ) {}

  async getData(request, body): Promise<HomePageDataInterface> {
    try {
      var courseId = body.courseId;
      var useruuid = request.user.uuid;
      var userId = request.user._id;
      const banners = await this.bannersModel
        .find(
          { courses: courseId, 'flags.active': true },
          {
            _id: 1,
            imgUrl: 1,
            uuid: 1,
            title: 1,
            youtubeLink: 1,
            subscriptions: 1,
            link: 1,
            order: 1,
            flags: 1,
          }
        )
        .sort('order')
        .exec();
      const mcqOfTheDay = await this.mcqOfTheModel
        .aggregate([
          {
            $match: {
              courseId: mongoose.Types.ObjectId(courseId),
              status: true,
            },
          },
          {
            $lookup: {
              from: 'questions',
              let: { questionId: '$questionId' },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$questionId'] } } },
              ],
              as: 'questions',
            },
          },
          { $unwind: '$questions' },
          {
            $project: {
              'questions.syllabus': 0,
              'questions.createdBy': 0,
              'questions.modifiedBy': 0,
              // 'questions.createdOn': 0,
              createdBy: 0,
              // createdOn: 0,
            },
          },
        ])
        .exec();

      const qbanks = [];
      const qbankList = await this.suggestedQbankModel
        .aggregate([
          {
            $match: {
              courseId: mongoose.Types.ObjectId(courseId),
              status: true,
            },
          },
        ])
        .exec();
      for (var i = 0; i < qbankList.length; i++) {
        var qbankUuid = qbankList[i]['qbankUuid'];
        var chapterId = qbankList[i]['chapterId'];
        var subjectId = qbankList[i]['subjectId'];

        try {
          var userdataSubmittedTopic = await this.submittedQBankTopicModel
            .findOne(
              { userId: userId, qbankTopicUuid: qbankUuid },
              {
                status: 1,
                stats: 1,
              }
            )
            .exec()
            .then((res) => {
              return res;
            });

          var topicStatus = 0;
          var attemptedMcq = 0;
          if (userdataSubmittedTopic) {
            topicStatus = userdataSubmittedTopic.status;
            if (userdataSubmittedTopic.stats.totalAttempted) {
              attemptedMcq = userdataSubmittedTopic.stats.totalAttempted;
            }
          } else {
            topicStatus = 0;
          }
          if (topicStatus != 2) {
            var qbankData = await this.qbankSubjectModel
              .aggregate([
                {
                  $match: {
                    'chapters.topics.uuid': qbankUuid,
                    'chapters._id': chapterId.toHexString(),
                    // syllabus: mongoose.Types.ObjectId(subjectId),
                    _id: mongoose.Types.ObjectId(subjectId),
                    courses: mongoose.Types.ObjectId(courseId),
                  },
                },
                { $unwind: '$chapters' },
                {
                  $addFields: {
                    'chapters.topics': {
                      $filter: {
                        input: '$chapters.topics',
                        cond: { $eq: ['$$this.uuid', qbankUuid] },
                      },
                    },
                  },
                },
                { $project: { createdBy: 0, createdOn: 0, modifiedOn: 0 } },
              ])
              .exec()
              .then((res) => {
                let totalres = res.filter(
                  (it) => it.chapters.topics.length > 0
                )[0];
                return totalres;
              })
              .catch((err) => err);

            qbankData.chapters.topics[0]['totalMcq'] =
              qbankData.chapters?.topics[0].que.length;
            qbankData['syllabus'] = qbankData.syllabus;
            qbankData.chapters.topics[0]['topicStatus'] = topicStatus;
            qbankData.chapters.topics[0]['completedMcq'] = attemptedMcq;

            if (qbankData) {
              qbanks.push(qbankData);
            }
          }
        } catch {}
      }
      const tests = [];
      const testList = await this.suggestedTestsModel
        .find({ courseId: courseId, status: true })
        .exec();
      for (var j = 0; j < testList.length; j++) {
        var testUuid = testList[j]['testUuid'];
        var testCourseId = testList[j]['courseId'];
        var testCategoryId = testList[j]['categoryId'];
        var userSubmittedTests = await this.submittedTestModel
          .findOne(
            {
              userId: userId,
              testSeriesUuid: testUuid,
              courseId: courseId,
            },
            {
              status: 1,
              stats: 1,
            }
          )
          .exec()
          .then((res) => {
            return res;
          });
        var submitStatus = 0;
        var completedMcq = 0;
        if (userSubmittedTests) {
          // console.log(userSubmittedTests);
          submitStatus = userSubmittedTests.status;
          completedMcq = userSubmittedTests.stats.attempted;
        } else {
          submitStatus = 0;
          completedMcq = 0;
        }
        if (submitStatus != 2) {
          var testSeriesData = await this.testSeriesModel
            .aggregate([
              {
                $match: {
                  'categories.tests.uuid': testUuid,
                  'flags.active': true,
                  // "chapters._id":testCategoryId,
                  // "categories.test.subjects._id" : subjectId.toHexString(),
                  courses: mongoose.Types.ObjectId(testCourseId),
                },
              },
              { $unwind: '$categories' },
              {
                $addFields: {
                  'categories.tests': {
                    $filter: {
                      input: '$categories.tests',
                      cond: { $eq: ['$$this.uuid', testUuid] },
                    },
                  },
                },
              },
              // { $project: { 'categories.tests.que':0}}
              {
                $project: {
                  'categories.modifiedBy': 0,
                  'categories.modifiedOn': 0,
                  'categories.tests.que.order': 0,
                  'categories.tests.que.positive': 0,
                  'categories.tests.que.negative': 0,
                  'categories.tests.createdBy': 0,
                  'categories.tests.modifiedBy': 0,
                  'categories.tests.createdOn': 0,
                  createdBy: 0,
                  createdOn: 0,
                  modifiedBy: 0,
                  modifiedOn: 0,
                },
              },
            ])
            .exec()
            .then((res) => {
              let totalres = res.filter(
                (it) => it.categories.tests.length > 0
              )[0];
              return totalres;
            })
            .catch((err) => err);
          if (testSeriesData) {
            testSeriesData.categories.tests[0]['completedMcq'] = completedMcq;
            testSeriesData.categories.tests[0]['submitted'] = submitStatus;
            tests.push(testSeriesData);
          }
        }
      }

      const videos = await this.suggestedVideosModel
        .aggregate([
          {
            $match: {
              courseId: mongoose.Types.ObjectId(courseId),
              status: true,
            },
          },
        ])
        .exec();

      // console.log(videos);

      const videosList = [];
      for (var k = 0; k < videos.length; k++) {
        var videoStatus = 0;
        var userdataSubmittedVideos = await this.userModel
          .aggregate([
            { $match: { uuid: useruuid } },
            { $unwind: '$userVideos' },
            {
              $match: {
                'userVideos.uuid': videos[k]['videoUuid'],
              },
            },
            {
              $project: {
                userVideos: 1,
              },
            },
          ])
          .exec()
          .then((res) => {
            if (res[0]?.userVideos) {
              var v = res[0]?.userVideos;
              return v;
            }
            (err) => {
              return;
            };
          });
        // console.log(userdataSubmittedVideos,videos[k]['videoUuid'])
        if (userdataSubmittedVideos) {
          videoStatus = userdataSubmittedVideos.status;
        } else {
          videoStatus = 0;
        }

        if (videoStatus != 2) {
          var videoss = await this.videoSubjectModel
            .aggregate([
              { $match: { 'chapters.videos.uuid': videos[k]['videoUuid'] } },
              { $unwind: '$chapters' },
              {
                $addFields: {
                  'chapters.videos': {
                    $filter: {
                      input: '$chapters.videos',
                      cond: { $eq: ['$$this.uuid', videos[k]['videoUuid']] },
                    },
                  },
                },
              },
            ])
            .exec()
            .then((res) => {
              var totalres;
              let totalress = res.filter(
                (it) => it.chapters.videos.length > 0
              )[0].chapters.videos[0];
              // console.log(totalress)
              try {
                res.map((its) => {
                  if (its.chapters.videos.length > 0) {
                    if (
                      its.chapters.videos[0].slides !=
                      its.chapters.videos[0].suggestedBanner
                    ) {
                      // console.log(its.chapters.videos[0])
                      totalres = its.chapters.videos[0];
                    }
                  }
                });
                return totalres;
              } catch (error) {
                return totalress;
              }
            })
            .catch((err) => err);
          // console.log(videoss)
          if (videoss) {
            if (userdataSubmittedVideos) {
              videoss.videoWatchStatus = userdataSubmittedVideos;
            } else {
              if (videoss) {
                videoss.videoWatchStatus = {
                  status: 0,
                };
              }
            }
          }
          if (videoss) {
            videosList.push(videoss);
          }
        }
      }

      // const tests = await this.testModel
      //   .find(
      //     { courses: courseId, 'flags.suggested': true },
      //     { title: 1, count: 1, imgUrl: 1, uuid: 1, description: 1, categories: 1, time: 1 })
      //   .exec();

      const plans = await this.viewSubscriptionsByUuid(
        useruuid,
        request.user.courses
      );

      return {
        status: true,
        code: 2000,
        message: 'Home Page Data',
        data: {
          banners,
          mcqOfTheDay: mcqOfTheDay,
          quotation: 'A winner is a dreamer who never gives up',
          suggested: { qbanks, videos: videosList, tests },
          plans: plans[0] ? plans[0].subscription : [],
        },
      };
    } catch (error) {
      return {
        status: false,
        code: 5000,
        message: 'Server error',
        data: {
          banners: [],
          mcqOfTheDay: {},
          quotation: '',
          suggested: {},
          plans: [],
        },
      };
    }
  }

  async viewSubscriptionsByUuid(uuid: string, courseId: string) {
    return this.userModel
      .aggregate([
        { $match: { uuid: uuid } },
        { $unwind: '$subscriptions' },
        {
          $lookup: {
            from: 'subscriptions',
            let: {
              subscription_id: '$subscriptions.subscription_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$subscription_id'] },
                },
              },
              {
                $project: {
                  _id: 1,
                  uuid: 1,
                  title: 1,
                  description: 1,
                  order: 1,
                  period: 1,
                  type: 1,
                  createdOn: 1,
                  flags: 1,
                  actual: 1,
                  discounted: 1,
                  courses: 1,
                  qbanks: 1,
                  videos: 1,
                  tests: 1,
                },
              },
            ],
            as: 'subscription',
          },
        },
        { $unwind: '$subscription' },
        {
          $lookup: {
            from: 'courses',
            let: {
              courses: '$subscription.courses',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$courses'] },
                },
              },
              { $project: { _id: 1, title: 1, uuid: 1 } },
            ],
            as: 'subscriptions.course',
          },
        },

        {
          $unwind: {
            path: '$subscriptions.course',
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $match: {
        //     'subscriptions.expiry_date': { $gt: new Date() },
        //   },
        // },
        {
          $match: {
            'subscriptions.expiry_date': { $gt: new Date() },
            'subscriptions.course._id': courseId,
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              uuid: '$uuid',
              name: '$name',
              email: '$email',
              mobile: '$mobile',
            },
            subscription: {
              $addToSet: {
                _id: '$subscriptions._id',
                subscription_id: '$subscriptions.subscription_id',
                uuid: '$subscriptions.uuid',
                expiry_date: '$subscriptions.expiry_date',
                active: '$subscriptions.active',
                createdOn: '$subscriptions.createdOn',
                title: '$subscription.title',
                description: '$subscription.description',
                order: '$subscription.order',
                period: '$subscription.period',
                type: '$subscription.type',
                actual: '$subscription.actual',
                discounted: '$subscription.discounted',
                flags: '$subscription.flags',
                course: '$subscriptions.course',
                // "qbanks":"$subscriptions.qbanks",
                // "videos":"$subscriptions.videos",
                // "tests":"$subscriptions.tests",
              },
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            uuid: '$_id.uuid',
            name: '$_id.name',
            email: '$_id.email',
            mobile: '$_id.mobile',
            subscription: '$subscription',
          },
        },
      ])
      .exec();
  }

  async getUserlist(request, application): Promise<ApiResponseInterface> {
    var data = await this.userModel.find().limit(500);
    return {
      status: true,
      code: 2000,
      message: 'Courses Fetched',
      data: data,
    };
  }
  async findAllCourses(request, application): Promise<ApiResponseInterface> {
    try {
      var users = request.user;
      var active = true;
      if (users) {
        var disableUser = await this.disableUserForTestSubmitModel
          .findOne({
            mobile: users.mobile,
            status: true,
            showInActiveCourses: true,
          })
          .exec();
        if (disableUser) {
          active = false;
        }
      }

      if (application) {
        var data = await this.courseModel
          .find(
            { 'flags.active': true, organizations: application },
            { title: 1, uuid: 1, id: 1, imgUrl: 1 }
          )
          .sort('order')
          .exec();
      } else {
        application = '641079c651477113b4d6410c';
        if (active) {
          var data = await this.courseModel
            .find(
              { 'flags.active': true, organizations: application },
              { title: 1, uuid: 1, id: 1, imgUrl: 1 }
            )
            .sort('order')
            .exec();
        } else {
          var data = await this.courseModel
            .find(
              { 'flags.active': false, organizations: application },
              { title: 1, uuid: 1, id: 1, imgUrl: 1 }
            )
            .sort('order')
            .exec();
        }
      }

      return {
        status: true,
        code: 2000,
        message: 'Courses Fetched',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }
  // async findAllCourses(): Promise<HomePageCourseInterface[]> {
  //   return this.courseModel
  //   .find({ 'flags.active': true },{ title: 1, uuid: 1, id: 1, imgUrl: 1 })
  //   .exec();
  // }

  public getBannersByCourseId(courseId) {
    //return this.banner.find({},
    // {_id:0, title:1,imagUrl:1, courses:{$elemMatch:{$eq:mongoose.Types.ObjectId(courseId)}}}).exec();
    return this.bannersModel
      .aggregate([
        //{$match: {$expr: {$in: ["$courses", mongoose.Types.ObjectId(courseId)]}}},
        { $unwind: '$courses' },
        { $match: { courses: mongoose.Types.ObjectId(courseId) } },
        {
          $project: {
            _id: 1,
            title: '$title',
            uuid: '$uuid',
            imgUrl: '$imgUrl',
            youtubeLink: '$youtubeLink',
            subscriptions: '$subscriptions',
            link: '$link',
            order: '$order',
            flags: '$flags',
          },
        },
      ])
      .exec();
  }
  async updateSuggestedVideoStatus(req, payload) {}
  async UpdateUserSubscription(req, payload) {
    var subscriptionId = payload.subscriptionId;
    var subscriptionData = await this.subscriptionModel.findOne({
      _id: subscriptionId,
    });
    var users = await this.userModel.find({
      'subscriptions.subscription_id': subscriptionId,
    });
    // var UserData = await this.userModel.findOne({_id:"61ab1ab7bf26b8470417ae07"});

    var expiry = null;
    users.map(async (UserData) => {
      UserData.subscriptions.map((sub) => {
        if (
          sub.subscription_id.toHexString() ==
          subscriptionData._id.toHexString()
        ) {
          expiry = sub.expiry_date;

          subscriptionData.qbanks.map((res) => {
            UserData.qbanks = UserData?.qbanks.filter((e) => {
              return e.subject_id != res.toString();
            });
            UserData.qbanks.push({ subject_id: res, expiry_date: expiry });
          });

          subscriptionData.videos.map((res) => {
            UserData.videos = UserData?.videos.filter((e) => {
              return e.subject_id != res.toString();
            });
            UserData.videos.push({ subject_id: res, expiry_date: expiry });
          });

          subscriptionData.tests.map((res) => {
            UserData.tests = UserData?.tests.filter((e) => {
              return e.category_id != res.toString();
            });
            UserData.tests.push({ category_id: res, expiry_date: expiry });
          });
          // console.log(UserData.tests)
        }
      });
      let update = await UserData.save();
    });

    return {
      status: true,
      code: 2000,
      message: 'User Subscription Data Updated',
      data: {
        subscription: subscriptionData,
        users: subscriptionData,
      },
    };
  }

  async checkCubscriptionStatus(req, payload) {
    var user_uuid = req.user.uuid;
    let lockstatus = false;
    let completeStatus = 0;

    var subscriptionStatus = await this.userModel
      .aggregate([{ $match: { uuid: user_uuid } }])
      .exec();

    if (payload.type == 'video') {
      var videoUuid = payload.uuid;
      var videoSubject = await this.videoSubjectModel
        .aggregate([
          { $match: { 'chapters.videos.uuid': videoUuid } },
          { $unwind: '$chapters' },
          {
            $addFields: {
              'chapters.videos': {
                $filter: {
                  input: '$chapters.videos',
                  cond: {
                    $eq: ['$$this.uuid', videoUuid],
                  },
                },
              },
            },
          },
          {
            $match: {
              chapters: {
                $ne: [],
              },
            },
          },
          {
            $addFields: {
              chapters: ['$chapters'],
            },
          },
          {
            $project: {
              chapters: 0,
              _id: 1,
            },
          },
        ])
        .exec()
        .then((res) => {
          return res[0];
        })
        .catch((err) => err);

      const videos = subscriptionStatus[0].videos;
      videos.forEach((video) => {
        var now = new Date();
        if (lockstatus == false) {
          if (videoSubject._id.toHexString() == video.subject_id) {
            if (now <= video.expiry_date) {
              lockstatus = true;
            } else {
              lockstatus = false;
            }
          } else {
            lockstatus = false;
          }
        }
      });
    } else if (payload.type == 'qb') {
      var qbankUuid = payload.uuid;
      var userdataSubmittedqbankSeriesStatus = await this.userModel
        .aggregate([
          { $match: { uuid: user_uuid } },
          { $unwind: '$qbanksTestSubmissions' },
          {
            $match: {
              'qbanksTestSubmissions.qbankTopicUuid': qbankUuid,
            },
          },
          {
            $project: {
              _id: 0,
              qbanksTestSubmissions: 1,
            },
          },
        ])
        .exec()
        .then((res) => {
          if (res[0]?.qbanksTestSubmissions) {
            var v = res[0]?.qbanksTestSubmissions;
            return v;
          }
          (err) => {
            return;
          };
        });

      if (userdataSubmittedqbankSeriesStatus) {
        completeStatus = userdataSubmittedqbankSeriesStatus?.status;
      }
      var qbankData = await this.qbankSubjectModel
        .aggregate([
          { $match: { 'chapters.topics.uuid': qbankUuid } },
          { $unwind: '$chapters' },
          {
            $addFields: {
              'chapters.topics': {
                $filter: {
                  input: '$chapters.topics',
                  cond: {
                    $eq: ['$$this.uuid', qbankUuid],
                  },
                },
              },
            },
          },
          {
            $project: {
              topics: {
                $filter: {
                  input: '$chapters.topics',
                  cond: {
                    $eq: ['$$this.uuid', qbankUuid],
                  },
                },
              },
            },
          },
          {
            $unwind: '$topics',
          },
          {
            $match: {
              chapters: {
                $ne: [],
              },
            },
          },
          {
            $addFields: {
              chapters: ['$chapters'],
            },
          },
          {
            $project: {
              // "chapters": 0,
              _id: 1,
              'topics.que': 0,
              'topics.subjects': 0,
            },
          },
        ])
        .exec()
        .then((res) => {
          return res[0];
        })
        .catch((err) => err);
      const qbanks = subscriptionStatus[0].qbanks;
      qbanks.forEach((qbank) => {
        var now = new Date();
        if (lockstatus == false) {
          if (qbankData._id.toHexString() == qbank.subject_id) {
            if (now <= qbank.expiry_date) {
              lockstatus = true;
            } else {
              lockstatus = false;
            }
          } else {
            lockstatus = false;
          }
        }
      });
      if (qbankData) {
        if (qbankData.topics) {
          // console.log(qbankData.topics.flags.paid)
          if (!qbankData.topics.flags.paid) {
            lockstatus = true;
          }
        }
      }
    } else if (payload.type == 'test') {
      var testUuid = payload.uuid;
      var userdataSubmittedTestSeriesStatus = await this.userModel
        .aggregate([
          { $match: { uuid: user_uuid } },
          { $unwind: '$testSeriesSubmissions' },
          {
            $match: {
              'testSeriesSubmissions.testSeriesUuid': testUuid,
            },
          },
          {
            $project: {
              _id: 0,
              testSeriesSubmissions: 1,
            },
          },
        ])
        .exec()
        .then((res) => {
          if (res[0]?.testSeriesSubmissions) {
            var v = res[0]?.testSeriesSubmissions;
            return v;
          }
          (err) => {
            return;
          };
        });

      if (userdataSubmittedTestSeriesStatus) {
        completeStatus = userdataSubmittedTestSeriesStatus?.status;
      }

      var testData = await this.testSeriesModel
        .aggregate([
          { $match: { 'categories.tests.uuid': testUuid } },
          { $unwind: '$categories' },
          {
            $addFields: {
              'categories.tests': {
                $filter: {
                  input: '$categories.tests',
                  cond: {
                    $eq: ['$$this.uuid', testUuid],
                  },
                },
              },
            },
          },
          {
            $project: {
              tests: {
                $filter: {
                  input: '$categories.tests',
                  cond: {
                    $eq: ['$$this.uuid', testUuid],
                  },
                },
              },
            },
          },
          {
            $unwind: '$tests',
          },
          {
            $match: {
              categories: {
                $ne: [],
              },
            },
          },
          {
            $addFields: {
              categories: ['$categories'],
            },
          },
          {
            $project: {
              // "categories": 0,
              _id: 1,
              'tests.que': 0,
              'tests.subjects': 0,
            },
          },
        ])
        .exec()
        .then((res) => {
          return res[0];
        })
        .catch((err) => err);

      const tests = subscriptionStatus[0].tests;
      tests.forEach((test) => {
        var now = new Date();
        if (lockstatus == false) {
          if (testData._id.toHexString() == test.category_id) {
            if (now <= test.expiry_date) {
              lockstatus = true;
            } else {
              lockstatus = false;
            }
          } else {
            lockstatus = false;
          }
        }
      });
      if (testData) {
        if (testData.tests) {
          if (!testData.tests.flags.paid) {
            lockstatus = true;
          }
        }
      }
    }

    return { status: lockstatus, completedStatus: completeStatus };
  }

  //Get Single Course Groups
  async getGroups(request, application): Promise<ApiResponseInterface> {
    try {
      var data = await this.groupsModel
        .find({ active: true }, { group_name: 1, uuid: 1 })
        .populate({
          path: 'courses',
          model: 'Course',
          select: {
            uuid: 1,
            title: 1,
            _id: 1,
          },
        })
        .sort('group_name')
        .exec();

      return {
        status: true,
        code: 2000,
        message: 'Groups List Fetched',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  //Get Course Groups
  async getGroup(request, id): Promise<ApiResponseInterface> {
    try {
      var data = await this.groupsModel
        .findOne({ active: true, _id: id })
        .populate({
          path: 'courses',
          model: 'Course',
          select: {
            uuid: 1,
            title: 1,
            _id: 1,
          },
        })
        .exec();

      return {
        status: true,
        code: 2000,
        message: 'Groups List Fetched',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }
}
