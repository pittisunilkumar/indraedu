import { TestCategoryInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonFunctions } from '../../helpers/functions';
import { DisableUserForTestSubmit, SubmittedTest, TSCategories, User } from '../../schema';
import * as mongoose from 'mongoose';

@Injectable()
export class MobileTestCategoryService {
  constructor(
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('DisableUserForTestSubmit') private disableUserForTestSubmitModel: Model<DisableUserForTestSubmit>,
    @InjectModel('SubmittedTest') private submittedTest: Model<SubmittedTest>,

  ) { }

  async findAll(): Promise<TSCategories[]> {
    return this.TSCategoriesModel
      .find()
      .populate('courses')
      .exec();
  }

  async findAllByCourseId(request, body): Promise<TSCategories[]> {
    var userUuid = request.user.uuid;
    var courseId = body.courseId;
    var userId = request.user._id

    // var date = new Date().getTime();
    // date += (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
    // var tests = this.TSCategoriesModel.find({
    //   'categories.tests.testStatus': 0,
    //   "flags.active": true,
    //   'categories.tests.scheduledDate': {
    //     $lt: new Date(date).toISOString()
    //   }
    // },
    //   (err, events) => {
    //     events.forEach(testes => {
    //       var steps = testes.categories.tests.filter(test => (new Date(test.scheduledDate) < new Date(date) && test.testStatus == 0));

    //       steps.forEach(async step => {
    //         step.testStatus = 1
    //         // console.log(new Date(step.scheduledDate),new Date(),date)
    //         await this.TSCategoriesModel
    //           .findOneAndUpdate(
    //             {
    //               uuid: testes.uuid
    //             },
    //             {
    //               $set: {
    //                 "categories.tests.$[elem1].testStatus": 1,
    //               }
    //             },
    //             {
    //               arrayFilters: [
    //                 { "elem1.uuid": { $eq: step.uuid } }
    //               ]
    //             },
    //           ).exec();
    //         // console.log(testes.uuid,step.uuid)
    //       })
    //     })
    //   })

    var disableLockCheck = await this.disableUserForTestSubmitModel
    .findOne({ mobile: request.user.mobile, status: true, subscription:true})
    .exec();

    return this.userModel.findOne(
      { uuid: userUuid },
    ).exec().then(
      (res: User) => {
        return this.TSCategoriesModel
          .find({ courses: courseId, 'flags.active': true },
            {
              "categories.tests.que.uuid": 0,
              "categories.tests.que.title": 0,
              "categories.tests.que.positive": 0,
              "categories.tests.que.negative": 0
            })
          // .limit(1)
          .sort('categories.order')
          .exec().then(
            (result) => {
              result.map(it => {
                it.count = 0;
                it.freeTests = 0;
                it.userCompletedCount = 0;
                it.categories.tests.sort((a, b) => (a.order > b.order) ? 1 : -1);
                it.categories.tests = it.categories.tests.filter(test => (test.flags.active == true));
                it.categories.tests?.map(async test => {
                  ++it.count
                  if (test.flags.paid == false) {
                    ++it.freeTests
                  }
                  test._id = it._id
                  // test.scheduledDate = CommonFunctions.getISTTime(test.scheduledDate);
                  // test.expiryDate = CommonFunctions.getISTTime(test.expiryDate);
                  // test.resultDate = CommonFunctions.getISTTime(test.resultDate);


                  let lockstatus = false;

                  if (res?.tests) {
                    res?.tests.map(ts => {
                      var now = new Date();
                      if (lockstatus == false) {
                        try {
                          if (test.flags.paid == true) {
                            if (test._id.toHexString() === ts.category_id.toHexString()) {
                              if (now <= ts.expiry_date) {
                                lockstatus = true;
                              } else {
                                lockstatus = false;
                              }
                            }
                            else {
                              lockstatus = false;
                            }
                          } else {
                            lockstatus = true;
                          }
                        } catch (error) {

                        }
                      }
                    })
                  }
                
                  if(disableLockCheck){
                    lockstatus = true;
                  }

                  test['subscribed'] = lockstatus;
                  let submitStatus = 0;
                  let completedMcq = 0;


                  if (res?.testSeriesSubmissions) {
                    res?.testSeriesSubmissions.map(tests => {
                      // console.log(test.uuid, tests.categoryUuid, tests.testSeriesUuid);
                      //// condition  removed for checking purpose
                      // if (test.uuid == tests.testSeriesUuid && it.uuid == tests.categoryUuid && lockstatus ) {
                      if (test.uuid == tests.testSeriesUuid && it.uuid == tests.categoryUuid) {
                        submitStatus = tests.status;
                        completedMcq = tests.completedMcq;
                      }
                    })
                  }
                  var liveTestStatus = 0;
                  if (test.testStatus == 2) {
                    if (new Date(test.scheduledDate) < new Date()) {

                      if (test.testStatus == 2 && test.resultDate && test.expiryDate) {
                        if (submitStatus != 0) {
                          if (submitStatus == 1) {
                            if (new Date(test.expiryDate) < new Date()) {

                              if (new Date(test.resultDate) < new Date()) {

                                liveTestStatus = 0
                              } else {

                                liveTestStatus = 1
                              }

                            } else {

                              liveTestStatus = 3
                            }
                          } else {
                            if (new Date(test.resultDate) < new Date()) {
                              liveTestStatus = 0
                            } else {

                              liveTestStatus = 1
                            }

                          }

                        } else {
                          if (new Date(test.expiryDate) < new Date()) {

                            if (new Date(test.resultDate) < new Date()) {

                              liveTestStatus = 0
                            } else {

                              liveTestStatus = 1
                            }
                          } else {
                            liveTestStatus = 3
                          }
                        }
                      }
                    } else {
                      console.log(new Date(test.scheduledDate))
                      liveTestStatus = 2
                    }
                  }
                  var statusMessages = {
                    0: 'Test result out',
                    1: 'Test Result Not Yet Released',
                    2: 'Test Not Yet Started',
                    3: 'Test Is Going On',
                  };
                  try {
                    test.scheduledDate = CommonFunctions.getISTTime(test.scheduledDate);
                  } catch (error) {
                    test.scheduledDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }
                  try {
                    test.expiryDate = CommonFunctions.getISTTime(test.expiryDate);
                  } catch (error) {
                    test.expiryDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }
                  try {
                    test.resultDate = CommonFunctions.getISTTime(test.resultDate);
                  } catch (error) {
                    test.resultDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }

                  test['liveTestStatus'] = liveTestStatus;
                  test['statusMessages'] = statusMessages;
                  test['completedMcq'] = completedMcq;
                  test['submitted'] = submitStatus;
                })

                if (res?.testSeriesSubmissions) {
                  res?.testSeriesSubmissions.map(test => {
                    // console.log(it.uuid, test.categoryUuid, it.uuid === test.categoryUuid);
                    if (it.uuid === test.categoryUuid) {
                      if (test.status == 2) {
                        ++it.userCompletedCount;
                      }
                    }
                  })
                }

              })

              return result;
            }
          )
      }
    )

  }

  async v2findAllByCourseId(request, body): Promise<TSCategories[]> {
    var userUuid = request.user.uuid;
    var courseId = body.courseId;
    var userId = request.user._id

    var disableLockCheck = await this.disableUserForTestSubmitModel
    .findOne({ mobile: request.user.mobile, status: true, subscription:true})
    .exec();

    return this.userModel.findOne(
      { uuid: userUuid },
    ).exec().then(
      async (res: User) => {

        // var log = await this.TSCategoriesModel.aggregate([
        //   { $match: { courses : mongoose.Types.ObjectId(courseId) ,'flags.active': true} },
        //   {
        //   $project: {
        //     "categories.tests.que.uuid": 0,
        //     "categories.tests.que.title": 0,
        //     "categories.tests.que.positive": 0,
        //     "categories.tests.que.negative": 0,
        // //   //   // _id: '$_id',
        //     "totalCategories": { $size: "$categories" }
        //   }
        // }
        // ]).exec();
        // console.log(log)
        // return log;
        return this.TSCategoriesModel
          .find({ courses: courseId, 'flags.active': true },
            {
              "categories.tests.que.uuid": 0,
              "categories.tests.que.title": 0,
              "categories.tests.que.positive": 0,
              "categories.tests.que.negative": 0
            })
          .sort('categories.order')
          .exec().then(
            (result) => {
              result.map(it => {
                it.count = 0;
                it.freeTests = 0;
                it.userCompletedCount = 0;
                it.categories.tests.sort((a, b) => (a.order > b.order) ? 1 : -1);
                it.categories.tests = it.categories.tests.filter(test => (test.flags.active == true));
                it.categories.tests?.map(async test => {
                  ++it.count
                  if (test.flags.paid == false) {
                    ++it.freeTests
                  }
                  test._id = it._id

                  let lockstatus = false;

                    if (res?.tests) {
                      res?.tests.map(ts => {
                        var now = new Date();
                        if (lockstatus == false) {
                          try {
                            if (test.flags.paid == true) {
                              if (test._id.toHexString() === ts.category_id.toHexString()) {
                                if (now <= ts.expiry_date) {
                                  lockstatus = true;
                                } else {
                                  lockstatus = false;
                                }
                              }
                              else {
                                lockstatus = false;
                              }
                            } else {
                              lockstatus = true;
                            }
                          } catch (error) {

                          }
                        }

                      })
                    }
                
                  if(disableLockCheck){
                    lockstatus = true;
                  }

                  test['subscribed'] = lockstatus;
                  let submitStatus = 0;
                  let completedMcq = 0;


                  if (res?.testSeriesSubmissions) {
                    res?.testSeriesSubmissions.map(tests => {
                      if (test.uuid == tests.testSeriesUuid && it.uuid == tests.categoryUuid) {
                        submitStatus = tests.status;
                        completedMcq = tests.completedMcq;
                      }
                    })
                  }
                  var liveTestStatus = 0;
                  if (test.testStatus == 2) {
                    if (new Date(test.scheduledDate) < new Date()) {

                      if (test.testStatus == 2 && test.resultDate && test.expiryDate) {
                        if (submitStatus != 0) {
                          if (submitStatus == 1) {
                            if (new Date(test.expiryDate) < new Date()) {

                              if (new Date(test.resultDate) < new Date()) {

                                liveTestStatus = 0
                              } else {

                                liveTestStatus = 1
                              }

                            } else {

                              liveTestStatus = 3
                            }
                          } else {
                            if (new Date(test.resultDate) < new Date()) {
                              liveTestStatus = 0
                            } else {

                              liveTestStatus = 1
                            }

                          }

                        } else {
                          if (new Date(test.expiryDate) < new Date()) {

                            if (new Date(test.resultDate) < new Date()) {

                              liveTestStatus = 0
                            } else {

                              liveTestStatus = 1
                            }
                          } else {
                            liveTestStatus = 3
                          }
                        }
                      }
                    } else {
                      console.log(new Date(test.scheduledDate))
                      liveTestStatus = 2
                    }
                  }
                  var statusMessages = {
                    0: 'Test result out',
                    1: 'Test Result Not Yet Released',
                    2: 'Test Not Yet Started',
                    3: 'Test Is Going On',
                  };
                  try {
                    test.scheduledDate = CommonFunctions.getISTTime(test.scheduledDate);
                  } catch (error) {
                    test.scheduledDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }
                  try {
                    test.expiryDate = CommonFunctions.getISTTime(test.expiryDate);
                  } catch (error) {
                    test.expiryDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }
                  try {
                    test.resultDate = CommonFunctions.getISTTime(test.resultDate);
                  } catch (error) {
                    test.resultDate = CommonFunctions.getISTTime(new Date().toISOString());
                  }

                  test['liveTestStatus'] = liveTestStatus;
                  test['statusMessages'] = statusMessages;
                  test['completedMcq'] = completedMcq;
                  test['submitted'] = submitStatus;
                  test['questions_count'] = test.que.length;
                  test.que = []
                })

                if (res?.testSeriesSubmissions) {
                  res?.testSeriesSubmissions.map(test => {
                    if (it.uuid === test.categoryUuid) {
                      if (test.status == 2) {
                        ++it.userCompletedCount;
                      }
                    }
                  })
                }

              })

              return result;
            }
          )
      }
    )

  }
  async findCategoriesByCourseId(request, body): Promise<TSCategories[]> {
    var userUuid = request.user.uuid;
    var courseId = body.courseId;
    var limit = body.limit;
    var userId = request.user._id

    // var date = new Date().getTime();
    // date += (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
    // var tests = this.TSCategoriesModel.find({
    //   'categories.tests.testStatus': 0,
    //   "flags.active": true,
    //   'categories.tests.scheduledDate': {
    //     $lt: new Date(date).toISOString()
    //   }
    // },
    //   (err, events) => {
    //     events.forEach(testes => {
    //       var steps = testes.categories.tests.filter(test => (new Date(test.scheduledDate) < new Date(date) && test.testStatus == 0));

    //       steps.forEach(async step => {
    //         step.testStatus = 1
    //         // console.log(new Date(step.scheduledDate),new Date(),date)
    //         await this.TSCategoriesModel
    //           .findOneAndUpdate(
    //             {
    //               uuid: testes.uuid
    //             },
    //             {
    //               $set: {
    //                 "categories.tests.$[elem1].testStatus": 1,
    //               }
    //             },
    //             {
    //               arrayFilters: [
    //                 { "elem1.uuid": { $eq: step.uuid } }
    //               ]
    //             },
    //           ).exec();
    //         // console.log(testes.uuid,step.uuid)
    //       })
    //     })
    //   })
    return this.userModel.findOne(
      { uuid: userUuid },
    ).exec().then(
      (res: User) => {
        return this.TSCategoriesModel
          .find({ courses: courseId, 'flags.active': true },
            {
              'categories.tests.que': 0,
              'categories.tests.subjects': 0,
              "categories.tests.createdOn": 0,
              "categories.tests.modifiedOn": 0,
              "categories.tests.pdf": 0,
              "categories.tests.suggestedBanner": 0,
              "categories.tests.expiryDate": 0,
              "categories.tests.expiryTime": 0,
              "categories.tests.imgUrl": 0,
              "categories.tests.scheduledTime": 0,
              "categories.tests.createdBy": 0,
              "categories.tests.title": 0,
              "categories.tests.description": 0,
              "categories.tests.time": 0,
              "categories.tests.order": 0,
              "categories.tests.scheduledDate": 0,
              "categories.tests.count": 0,
              "categories.tests.negativeMarks": 0,
              "categories.tests.positiveMarks": 0,
              "categories.tests.testStatus": 0,
              "categories.tests.status": 0,
              "categories.tests.testType": 0,
            }
          ).sort('categories.order').exec().then(
            (result) => {
              result.map(it => {
                // it.count = 0;
                // it.freeTests = 0;
                it.userCompletedCount = 0;
                try {
                  it.scheduledDate = CommonFunctions.getISTTime(it.scheduledDate);
                } catch (error) {
                  it.scheduledDate = CommonFunctions.getISTTime(new Date().toISOString());
                }
                try {
                  it.expiryDate = CommonFunctions.getISTTime(it.expiryDate);
                } catch (error) {
                  it.expiryDate = CommonFunctions.getISTTime(new Date().toISOString());
                }
                try {
                  it.resultDate = CommonFunctions.getISTTime(it.resultDate);
                } catch (error) {
                  it.resultDate = CommonFunctions.getISTTime(new Date().toISOString());
                }


                //changed from submission to testSeriesSubmissions
                if (res?.testSeriesSubmissions) {
                  res?.testSeriesSubmissions.map(test => {
                    // console.log(it.uuid, test.categoryUuid, it.uuid === test.categoryUuid);
                    if (it.uuid === test.categoryUuid && test.status == 2) {
                      it.categories.tests?.map(async testsss => {
                        // console.log(testsss)
                        if (testsss.flags.active == true && test.testSeriesUuid == testsss.uuid) {
                          ++it.userCompletedCount;
                        }
                      });
                    }
                  })
                }

              })

              return result;
            }
          )
      }
    )

  }

  async getTestSeriesTopicsBycategorieId(request, body): Promise<any> {
    var userUuid = request.user.uuid;
    var categorieId = body.categorieId;
    var courseId = body.courseId;
    var userId = request.user._id

    // var date = new Date().getTime();
    // date += (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
    // var tests = this.TSCategoriesModel.find({
    //   'categories.tests.testStatus': 0,
    //   "flags.active": true,
    //   'categories.tests.scheduledDate': {
    //     $lt: new Date(date).toISOString()
    //   }
    // },
    //   (err, events) => {
    //     events.forEach(testes => {
    //       var steps = testes.categories.tests.filter(test => (new Date(test.scheduledDate) < new Date(date) && test.testStatus == 0));

    //       steps.forEach(async step => {
    //         step.testStatus = 1
    //         // console.log(new Date(step.scheduledDate),new Date(),date)
    //         await this.TSCategoriesModel
    //           .findOneAndUpdate(
    //             {
    //               uuid: testes.uuid
    //             },
    //             {
    //               $set: {
    //                 "categories.tests.$[elem1].testStatus": 1,
    //               }
    //             },
    //             {
    //               arrayFilters: [
    //                 { "elem1.uuid": { $eq: step.uuid } }
    //               ]
    //             },
    //           ).exec();
    //         // console.log(testes.uuid,step.uuid)
    //       })
    //     })
    //   })

    var disableLockCheck = await this.disableUserForTestSubmitModel
    .findOne({ mobile: request.user.mobile, status: true, subscription:true})
    .exec();

    return this.userModel.findOne(
      { uuid: userUuid },
    ).exec()
      .then(
        (res: User) => {

          return this.TSCategoriesModel.findOne({ _id: categorieId, 'categories.tests.flags.active': true }, {
            // "categories.tests.que":0,
            "categories.tests.que.title": 0,
            "categories.tests.que.positive": 0,
            "categories.tests.que.negative": 0,
            'categories.tests.createdBy': 0
          }).exec()
            .then(
              (result) => {
                if (result) {
                  result.count = 0;
                  result.freeTests = 0;
                  result.userCompletedCount = 0;
                  result.scheduledDate = CommonFunctions.getISTTime(result.scheduledDate);

                  result.categories.tests.sort((a, b) => (a.order > b.order) ? 1 : -1);
                  result.categories.tests = result.categories.tests.filter(test => (test.flags.active == true));
                  result.categories.tests?.map(async test => {
                    ++result.count
                    if (test.flags.paid == false) {
                      ++result.freeTests
                    }
                    test._id = result._id
                    let lockstatus = false;
  
                      if (res?.tests) {
                        res?.tests.map(ts => {
                          var now = new Date();
                          if (lockstatus == false) {
                            try {
                              if (test._id.toHexString() === ts.category_id.toHexString()) {
                                if (now <= ts.expiry_date) {
                                  lockstatus = true;
                                } else {
                                  lockstatus = false;
                                }
                              }
                              else {
                                lockstatus = false;
                              }
                            } catch (error) {

                            }
                          }
                        })
                      }

                    if(disableLockCheck){
                      lockstatus = true;
                    }
                    test['subscribed'] = lockstatus;
                    let submitStatus = 0;
                    let completedMcq = 0;

                    if (res?.testSeriesSubmissions) {
                      res?.testSeriesSubmissions.map(tests => {
                        if (test.uuid === tests.testSeriesUuid) {
                          submitStatus = tests.status;
                          completedMcq = tests.completedMcq;
                          if (tests.status == 2) {
                            ++result.userCompletedCount;
                          }
                        }
                      })
                    }
                    var liveTestStatus = 0;
                    if (test.testStatus == 2) {
                      if (new Date(test.scheduledDate) < new Date()) {

                        if (test.testStatus == 2 && test.resultDate && test.expiryDate) {
                          if (submitStatus != 0) {
                            if (submitStatus == 1) {
                              if (new Date(test.expiryDate) < new Date()) {

                                if (new Date(test.resultDate) < new Date()) {

                                  liveTestStatus = 0
                                } else {

                                  liveTestStatus = 1
                                }

                              } else {

                                liveTestStatus = 3
                              }
                            } else {
                              if (new Date(test.resultDate) < new Date()) {
                                liveTestStatus = 0
                              } else {

                                liveTestStatus = 1
                              }

                            }

                          } else {
                            if (new Date(test.expiryDate) < new Date()) {

                              if (new Date(test.resultDate) < new Date()) {

                                liveTestStatus = 0
                              } else {

                                liveTestStatus = 1
                              }
                            } else {
                              liveTestStatus = 3
                            }
                          }
                        }
                      } else {
                        console.log(new Date(test.scheduledDate), new Date())
                        liveTestStatus = 2
                      }
                    }
                    var statusMessages = {
                      0: 'Test result out',
                      1: 'Test Result Not Yet Released',
                      2: 'Test Not Yet Started',
                      3: 'Test Is Going On',
                    };
                    // test.scheduledDate = CommonFunctions.getISTTime(test.scheduledDate);
                    try {
                      test.scheduledDate = CommonFunctions.getISTTime(test.scheduledDate);
                    } catch (error) {
                      test.scheduledDate = CommonFunctions.getISTTime(new Date().toISOString());
                    }
                    try {
                      test.expiryDate = CommonFunctions.getISTTime(test.expiryDate);
                    } catch (error) {
                      test.expiryDate = CommonFunctions.getISTTime(new Date().toISOString());
                    }
                    try {
                      test.resultDate = CommonFunctions.getISTTime(test.resultDate);
                    } catch (error) {
                      test.resultDate = CommonFunctions.getISTTime(new Date().toISOString());
                    }

                    test['liveTestStatus'] = liveTestStatus;
                    test['statusMessages'] = statusMessages;
                    test['completedMcq'] = completedMcq;
                    test['submitted'] = submitStatus;
                  })
                  return result;
                }
                return [];
              })
        }
      )
  }

  async checkTestStatus(request, body): Promise<any> {
    let uuid = body.categoryUuid;
    let testuuid = body.testUuid;
    var userUuid = request.user.uuid;
    // console.log(request.user)
    let testData = await this.TSCategoriesModel
      .aggregate([
        { $match: { "uuid": uuid } },
        { $unwind: "$categories" },
        {
          '$project': {
            'tests': {
              '$filter': {
                'input': '$categories.tests',
                'cond': {
                  '$eq': [
                    '$$this.uuid', testuuid,
                  ]
                }
              }
            }
          }
        },
        {
          '$unwind': '$tests'
        },
        {
          $project: {
            "_id": 0,
            "tests.que": 0,
            "tests.subjects": 0
          }
        },
      ])
      .exec();
    if (testData) {
      if (testData[0]?.tests) {
        var userdataSubmittedTestSeriesStatus = await this.userModel
          .aggregate([
            { $match: { uuid: userUuid } },
            { $unwind: "$testSeriesSubmissions" },
            {
              $match: {
                "testSeriesSubmissions.testSeriesUuid": testuuid,
                "testSeriesSubmissions.categoryUuid": body.categoryUuid,
              }
            },
            {
              $project: {
                "_id": 0,
                "testSeriesSubmissions": 1,
              }
            },
          ])
          .exec()
          .then(
            (res) => {
              if (res[0]?.testSeriesSubmissions) {
                var v = res[0]?.testSeriesSubmissions;
                return v;
              }
              (err) => {
                return;
              }
            }
          );

        var usertestStatus = 0;

        if (userdataSubmittedTestSeriesStatus?.status) {
          usertestStatus = userdataSubmittedTestSeriesStatus?.status;
        }

        var test = testData[0].tests;
        var status = {
          0: 'Test Not Yet Started',
          1: 'Test Started',
          2: 'Test Result Released',
          3: 'Test Result Not Yet Released',
          4: 'Test Ends & Result Not Yet Released',
          5: 'Test Not Yet End',
          6: 'You Are Not Attempted You Can Start Exam'
        };
        var message = '';
        var testCurrentStatus = 0;
        if (new Date(test.scheduledDate) < new Date()) {
          message = 'Test Started';
          testCurrentStatus = 1

          if (usertestStatus != 0) {
            if (usertestStatus == 1) {
              if (new Date(test.expiryDate) < new Date()) {
                message = 'Test Ends & Result Not Yet Released';
                testCurrentStatus = 4

                if (new Date(test.resultDate) < new Date()) {
                  message = 'You Are Not Attempted You Can Start Exam';
                  testCurrentStatus = 6
                } else {
                  message = 'Test Ends & Result Not Yet Released';
                  testCurrentStatus = 4
                }

              } else {
                message = 'Test Not Yet End';
                testCurrentStatus = 5
              }
            } else {
              if (new Date(test.resultDate) < new Date()) {
                message = 'Test Result Released';
                testCurrentStatus = 2
              } else {
                try {
                  message = 'Results will Release On ' + new Date(test.resultDate).toLocaleDateString() + " " + new Date(test.resultDate).toLocaleTimeString();
                } catch (error) {
                  message = 'Test Result Not Yet Released';
                }
                testCurrentStatus = 3
              }
            }
          } else {
            if (new Date(test.expiryDate) < new Date()) {
              message = 'Test Ends & Result Not Yet Released';
              testCurrentStatus = 4

              if (new Date(test.resultDate) < new Date()) {
                message = 'You Are Not Attempted You Can Start Exam';
                testCurrentStatus = 6
              } else {
                message = 'Test Ends & Result Not Yet Released';
                testCurrentStatus = 4
              }
            } else {
              message = 'Test Not Yet End';
              testCurrentStatus = 5
            }
          }
        } else {
          message = 'Test Not Yet Started';
          testCurrentStatus = 0
        }
        return {
          "status": true, "code": 2000, 'message': message, 'data': {
            testCurrentStatus: testCurrentStatus,
            status: status
          }
        }
      } else {
        return { "status": false, "code": 5002, 'message': "Test Not Found", 'data': {} }
      }
    } else {
      return { "status": false, "code": 5001, 'message': "Categories Not Found", 'data': {} }
    }


  }


  async getTestQuestionsByUuid(request, body): Promise<any> {
    let uuid = body.categoryUuid;
    let testuuid = body.testUuid;
    var questionsData = [];


    var stats = {
      total: 0,
      totalMarks: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
      attempted: 0,
      unAttempted: 0,
      guessed: {
        total: 0,
        correct: 0,
        wrong: 0,
      },
      percentages: {
        correct: 0,
        wrong: 0,
        skipped: 0,
        guessedTotal: 0,
      }
    };
    let questions = await this.TSCategoriesModel
      .aggregate([
        { $match: { "uuid": uuid } },
        { $unwind: "$categories" },
        {
          '$project': {
            'tests': {
              '$filter': {
                'input': '$categories.tests',
                'cond': {
                  '$eq': [
                    '$$this.uuid', testuuid
                  ]
                }
              }
            }
          }
        },
        {
          '$unwind': '$tests'
        },

        {
          $unwind: "$tests.que"
        },
        // { $sort: { 'tests.que.order': 1 } },
        {
          $lookup: // Equality Match
          {
            from: "questions",
            localField: "tests.que.uuid",
            foreignField: "uuid",
            as: "question",
          }
        },
        {
          $unwind: "$question"
        },

        {
          $group: {
            _id: { a: "$_id", order: "$tests.que.order", time: "$tests.time" },
            "questions":
            {
              $addToSet: {
                // "order": '$z.que.order',
                "order": '$tests.que.order',
                "positive": '$tests.que.positive',
                "negative": '$tests.que.negative',
                "subjects": "$tests.subjects",
                "_id": "$question._id",
                "questionId": "$question.questionId",
                "uuid": "$question.uuid",
                "title": "$question.title",
                "options": "$question.options",
                "type": "$question.type",
                "answer": "$question.answer",
                "description": "$question.description",
                "flags": "$question.flags",
                "mathType": "$question.mathType",
                "imgUrl": "$question.imgUrl",
                "descriptionImgUrl": "$question.descriptionImgUrl",
                "matchRightSideOptions": "$question.matchRightSideOptions",
                "matchLeftSideOptions": "$question.matchLeftSideOptions",
              }
            },
          }
        },
        // {$limit: 5 * 10},
        // { $sort: { "_id.order": 1 } },
        {
          $project: {
            _id: 0,
            time: "$_id.time",
            questions: "$questions"
          }
        }
      ])
      .exec();

    var today = new Date();

    var userdataSubmittedTestSeriesStatus = await this.userModel
      .aggregate([
        { $match: { uuid: request.user.uuid } },
        { $unwind: "$testSeriesSubmissions" },
        {
          $match: {
            "testSeriesSubmissions.testSeriesUuid": testuuid
          }
        },
        {
          $project: {
            "_id": 0,
            "testSeriesSubmissions": 1,
          }
        },
      ])
      .exec()
      .then(
        (res) => {
          if (res[0]?.testSeriesSubmissions) {
            var v = res[0]?.testSeriesSubmissions;
            return v;
          }
          (err) => {
            return;
          }
        }
      );
    // userdataSubmittedTestSeries.testSeriesSubmissions.status = 2;
    // userdataSubmittedTestSeries.save();;
    const userSubmission = await this.submittedTest
      .aggregate([
        { $match: { "testSeriesUuid": testuuid, "userId": request.user._id } },
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
    // return userSubmission;
    var time = questions[0].time;
    var d2 = new Date(today);
    d2.setMinutes(today.getMinutes() + time);
    // console.log(today,d2);

    var testSeriesStatus = {
      testSeriesUuid: testuuid,
      categoryUuid: uuid,
      courseId: request.user.courses,
      subjectId: body.subjectId,
      totalTime: time,
      expiryDate: d2,
      status: 0,
      // leftOverTime : time,
      startedAt: today,
    };

    var lastAttemptedQuestion = 0;

    if (userSubmission.length > 0) {

      if (userdataSubmittedTestSeriesStatus) {

      } else {
        console.log('abc');
        var teststart = this.userModel.findOneAndUpdate(
          { uuid: request.user.uuid },
          {
            $addToSet: {
              "testSeriesSubmissions": testSeriesStatus
            }
          },
          { new: true, useFindAndModify: false }
        ).exec().then(
          (res) => {
            return res.testSeriesSubmissions;
          },
          (err) => {
            return err;
          }
        )
        userdataSubmittedTestSeriesStatus = testSeriesStatus;
      }
      // var questionsData = [];
      userSubmission.forEach(element => {
        // console.log(element)
        lastAttemptedQuestion = element.lastAttemptedQuestion;

        // var ans = [];
        if (element.answers) {
          stats = element.stats
          var ans = {
            "order": element.answers.question.order,
            "negative": element.answers.question.negative,
            "positive": element.answers.question.positive,
            "_id": element.answers.questions[0]._id,
            'questionId': element.answers.questions[0].questionId,
            "uuid": element.answers.questions[0].uuid,
            "title": element.answers.questions[0].title,
            "shortTitle": element.answers.questions[0].shortTitle,
            "options": element.answers.questions[0].options,
            "type": element.answers.questions[0].type,
            "answer": element.answers.questions[0].answer,
            "description": element.answers.questions[0].description,
            "flags": element.answers.questions[0].flags,
            "mathType": element.answers.questions[0].mathType,
            "imgUrl": element.answers.questions[0].imgUrl,
            "descriptionImgUrl": element.answers.questions[0].descriptionImgUrl,
            "matchRightSideOptions": element.answers.questions[0].matchRightSideOptions,
            "matchLeftSideOptions": element.answers.questions[0].matchLeftSideOptions,
            "attemptedAnswer": element.answers.answer,
            // "attemptedInSeconds": element.answers.attemptedInSeconds,
            "attemptedflags": element.answers.flags,
          };
          questionsData.push(ans);
        }
      });
    } else {


      if (userdataSubmittedTestSeriesStatus) {
      } else {
        console.log('abc');

        var disableUser = await this.disableUserForTestSubmitModel.findOne({ "mobile": request.user.mobile, status: true, submission:true }).exec();

        if (!disableUser) {
          var teststart = this.userModel.findOneAndUpdate(
            { uuid: request.user.uuid },
            {
              $addToSet: {
                "testSeriesSubmissions": testSeriesStatus
              }
            },
            { new: true, useFindAndModify: false }
          ).exec().then(
            (res) => {
              return res.testSeriesSubmissions;
            },
            (err) => {
              return err;
            }
          )
        }
        userdataSubmittedTestSeriesStatus = testSeriesStatus;
      }

      // var questionsData = [];
      questions.forEach((elements, i) => {
        // var ans = {};
        var element = elements.questions[0];
        if (element) {
          var ans = {
            "order": element.order,
            "positive": element.positive,
            "negative": element.negative,
            "subjects": element.subjects,
            'questionId': element.questionId,
            "_id": element._id,
            "uuid": element.uuid,
            "title": element.title,
            "shortTitle": element.shortTitle,
            "options": element.options,
            "type": element.type,
            "answer": element.answer,
            "description": element.description,
            "flags": element.flags,
            "mathType": element.mathType,
            "imgUrl": element.imgUrl,
            "descriptionImgUrl": element.descriptionImgUrl,
            "matchRightSideOptions": element.matchRightSideOptions,
            "matchLeftSideOptions": element.matchLeftSideOptions,
            "attemptedAnswer": 0,
            "attemptedInSeconds": 0,
            "attemptedflags": {
              "attempted": false,
              "bookmark": false,
              "isBookMarked": false,
              "markAsGuessed": false,
              "markForReview": false,
              "skipped": false,
              "wrong": false
            }
          };
          questionsData.push(ans);
          stats.unAttempted = questionsData.length;
        }
      });
    }

    // console.log('TSquestion',questionsData);
    var startedAt = userdataSubmittedTestSeriesStatus?.startedAt
    const startDate = new Date(startedAt);
    // console.log(startDate);
    const timeDiff = today.getTime() - startDate.getTime();
    const mins = Math.floor(timeDiff / (1000 * 60));
    const msec = Math.floor(timeDiff);

    let leftOverTime;
    let leftOverTimeInSec;
    let leftOverTimeInmilliSec;

    var timeeee = (questions[0].time) * (60 * 1000);

    if (mins > timeeee) {
      leftOverTime = 0;
      leftOverTimeInSec = 0;
      leftOverTimeInmilliSec = 0;
    } else {
      leftOverTime = (questions[0].time) - mins;
      leftOverTimeInSec = Math.floor((timeeee - msec) / 1000);
      leftOverTimeInmilliSec = Math.floor(timeeee - msec);
    }
    // console.log(leftOverTime)


    questionsData.sort((a, b) => (a.order > b.order) ? 1 : -1);
    // if(userdataSubmittedTestSeriesStatus.status != 2){
    // if(uuid=="c11e3c4b-d88e-4ee7-ba68-9920b8e18c24" && testuuid=="56463d96-4188-48d1-802d-dee863504137"){
    //    if(userdataSubmittedTestSeriesStatus?.status == 2){
    //       questionsData = [{
    //         "order": 1,
    //         "negative": 0,
    //         "positive": 1,
    //         "_id": "",
    //         "questionId": "",
    //         "uuid": "",
    //         "title": "ఈ పేపర్ Review , ఫలితాలు ప్రకటించిన తరువాత వీక్షించవచ్చును.",
    //         "options": [
    //         ],
    //         "type": "SINGLE",
    //         "answer": {
    //             "options": 4
    //         },
    //         "description": "తెలుగు రాష్ట్రాలలో SI & Constable పోటీ పరీక్షలకు ప్రిపేర్ అవుతున్న అభ్యర్థులకు Plato Online App అందిస్తున్న గొప్ప అవకాశం. తేది : 26-03-2022 ఉదయం 10 గంటల నుండి నుండి 27-03-2022 రాత్రి 10 గంటల వరకు Online ద్వారా Plato Online App లో నిర్వహించే Scholarship Test ద్వారా 10,000/- వరకు గెలుచుకునే అద్భుత అవకాశం.",
    //         "flags": {
    //         },
    //         "mathType": "no",
    //         "imgUrl": "",
    //         "descriptionImgUrl": "",
    //         "matchRightSideOptions": [],
    //         "matchLeftSideOptions": [],
    //         "attemptedAnswer": 0,
    //         "attemptedflags": {
    //         }
    //     }];
    //    }
    // }
    return {
      'questions': questionsData,
      'time': questions[0].time,
      'stats': stats,
      'lastAttemptedQuestion': lastAttemptedQuestion,
      'testSeriesStatus': userdataSubmittedTestSeriesStatus,
      'startedAt': startedAt,
      'status': userdataSubmittedTestSeriesStatus?.status,
      "leftOverTime": leftOverTime,
      "leftOverTimeInSec": leftOverTimeInSec,
      "leftOverTimeInMilliSec": leftOverTimeInmilliSec,
    }
    // }

  }

  async getReAttemptTestQuestionsByUuid(request, body): Promise<any> {
    let uuid = body.categoryUuid;
    let testuuid = body.testUuid;
    var questionsData = [];

    const userSubmission = await this.submittedTest
      .aggregate([
        { $match: { "testSeriesUuid": testuuid, "userId": request.user._id } },
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
    // return userSubmission;

    var lastAttemptedQuestion = 0;

    if (userSubmission.length > 0) {

      // var questionsData = [];
      userSubmission.forEach(element => {
        // console.log(element)
        lastAttemptedQuestion = element.lastAttemptedQuestion;

        // var ans = [];
        if (element.answers) {
          if (element.answers.flags.attempted && element.answers.flags.wrong) {
            var ans = {
              "order": element.answers.question.order,
              "negative": element.answers.question.negative,
              "positive": element.answers.question.positive,
              "_id": element.answers.questions[0]._id,
              'questionId': element.answers.questions[0].questionId,
              "uuid": element.answers.questions[0].uuid,
              "title": element.answers.questions[0].title,
              "options": element.answers.questions[0].options,
              "type": element.answers.questions[0].type,
              "answer": element.answers.questions[0].answer,
              "description": element.answers.questions[0].description,
              "mathType": element.answers.questions[0].mathType,
              "imgUrl": element.answers.questions[0].imgUrl,
              "descriptionImgUrl": element.answers.questions[0].descriptionImgUrl,
              "matchRightSideOptions": element.answers.questions[0].matchRightSideOptions,
              "matchLeftSideOptions": element.answers.questions[0].matchLeftSideOptions,
              "attemptedAnswer": element.answers.answer,
              // "attemptedInSeconds": element.answers.attemptedInSeconds,
              "attemptedflags": element.answers.flags,
            };
            questionsData.push(ans);
          }
        }
      });
    } else {
    }

    questionsData.sort((a, b) => (a.order > b.order) ? 1 : -1);

    return {
      'questions': questionsData
    }
    // }

  }

  async findByUuid(uuid: string): Promise<TSCategories> {
    return this.TSCategoriesModel
      .findOne({ uuid })
      .populate('courses')
      .exec();
  }

  async deleteByUuid(uuid: string) {

    // this.findCategoryByUuid(uuid).then(result => {
    // result.children.forEach(child => {
    //   if(child){
    //     this.TSCategoriesModel.findByIdAndUpdate(
    //       {_id: child},
    //       { $pull: { parents: result._id } }
    //     ).exec();
    //   }
    // });
    // result.parents.forEach(parent => {
    //   if(parent){
    //     this.TSCategoriesModel.findByIdAndUpdate(
    //       {_id: parent},
    //       { $pull: { children: result._id } }
    //     ).exec();
    //   }
    // });

    // });

    return this.TSCategoriesModel.findOneAndDelete({ uuid }).exec();

  }

  // async create(createTSCategoriesDTO: CreateTSCategoriesDTO): Promise<TSCategories> {
  //   const createdTSCategories = new this.TSCategoriesModel(createTSCategoriesDTO);
  //   const result = createdTSCategories.save();
  //   return result;
  // }

  // async editByUuid(request: TestCategoryInterface): Promise<TSCategories> {

  //   return this.TSCategoriesModel.findOneAndUpdate({ uuid: request.uuid }, request).exec();

  // }

}
