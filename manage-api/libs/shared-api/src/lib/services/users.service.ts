import { KeyInterface, SubscriptionInterface, UserInterface } from '@application/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateUserDto, RegisterUserDto } from '../dto';
import { Subscription, User, Coupon, Disableuserfortestsubmits,SubmittedTest,SubmittedQBankTopic,QBankSubject,TSCategories, Course } from '../schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Coupon') private coupon: Model<Coupon>,
    @InjectModel('SubmittedTest') private submittedTest: Model<SubmittedTest>,
    @InjectModel('SubmittedQBankTopic')
    private submittedQBankTopic: Model<SubmittedQBankTopic>,
    @InjectModel('QBankSubject') private qBankSubjectmodel: Model<QBankSubject>,
    @InjectModel('TSCategories') private TSCategoriesModel: Model<TSCategories>,
    @InjectModel('Disableuserfortestsubmits')
    private disableuserfortestsubmitsModel: Model<Disableuserfortestsubmits>
  ) {}

  find(options) {
    return this.userModel.find(options);
  }
  count(options) {
    return this.userModel.countDocuments(options);
  }
  async getEmployeeCourses(employee) {
    return this.courseModel.find(
      { organizations: { $in: employee.organizations } },
      { _id: true }
    );
  }

  async createMultiUsers(request: any) {
    console.log('request', request);
    return this.userModel.insertMany(request);
  }

  async addUser(createUserDto: CreateUserDto): Promise<User | Error> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.password = await bcrypt.hash(createdUser.password, 10);
    const uniqueMobile = await this.findByMobile(createdUser.mobile).then(
      (res) => res
    );
    // const uniqueEmail = await this.findByEmail(createdUser.email).then(
    //   (res) => res
    // );
    // if (!uniqueEmail && !uniqueMobile) {
    if (!uniqueMobile) {
      return createdUser.save();
    }
    // else if (uniqueEmail) {
    //   throw new HttpException(
    //     'The input email is already taken, please enter a new one',
    //     HttpStatus.BAD_REQUEST
    //   );
    // }
    else if (uniqueMobile) {
      throw new HttpException(
        'The input mobile is already taken, please enter a new one',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<User | Error> {
    const createdUser = new this.userModel(registerUserDto);
    createdUser.password = await bcrypt.hash(createdUser.password, 10);
    const uniqueMobile = await this.findByMobile(createdUser.mobile).then(
      (res) => res
    );
    const uniqueEmail = await this.findByEmail(createdUser.email).then(
      (res) => res
    );

    if (!uniqueEmail && !uniqueMobile) {
      return createdUser.save();
    } else if (uniqueEmail) {
      throw new HttpException(
        'The input email is already taken, please enter a new one',
        HttpStatus.BAD_REQUEST
      );
    } else if (uniqueMobile) {
      throw new HttpException(
        'The input mobile is already taken, please enter a new one',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async login(request: { mobile: number; password: string }): Promise<User> {
    const user = await this.findByMobile(request.mobile);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    return bcrypt.compare(request.password, user.password).then((val) => {
      if (!val) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      user.flags.isLoggedIn = true;

      return user;
    });
  }

  deviceLogout(uuid: string, deviceId?: string) {
    const user = this.userModel
      .findOne({ uuid })
      .exec()
      .then((res) => {
        res.devices?.forEach((dev) => {
          if (dev?.id === deviceId) {
            dev.isLoggedIn = false;
          }
        });

        const deviceIsLoggedIn = (device) => device.isLoggedIn;

        if (!res.devices?.some(deviceIsLoggedIn)) {
          res.flags.isLoggedIn = false;
        }

        return res;
      });

    return this.userModel.findOneAndUpdate({ uuid }, user).exec();
  }

  async findAll(): Promise<User[]> {
    // return this.userModel
    // .find({ type:  'SUPER' })
    // .populate('subscriptions')
    // .exec();
    return (
      this.userModel
        .find({ type: { $ne: 'STUDENT' } })
        // .populate('subscriptions')
        .exec()
    );
  }

  async findAllStudents(): Promise<User[]> {
    return (
      this.userModel
        .find({ type: 'STUDENT' })
        // .populate('subscriptions')
        .exec()
    );
  }

  async findByMobile(mobile): Promise<User> {
    return this.userModel.findOne({ mobile }).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async viewSubscriptionsByUuid(uuid: string) {
    return this.userModel
      .aggregate([
        { $match: { uuid: uuid } },
        // { $match : {_id: new ObjectId(id)}},
        { $unwind: '$subscriptions' },
        {
          $lookup: {
            from: 'subscriptions',
            let: {
              subscription_id: '$subscriptions.subscription_id',
              // subscription_id: "$subscriptions._id"
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
        {
          $lookup: {
            from: 'qbanksubjects',
            let: { qbanks: '$subscription.qbanks' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$qbanks'] } } },
              { $project: { syllabus: 1 } },
              {
                $lookup: {
                  from: 'syllabuses',
                  let: { syllabus: '$syllabus' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$syllabus'] },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        title: 1,
                        uuid: 1,
                      },
                    },
                  ],
                  as: 'syllabus',
                },
              },
            ],
            as: 'subscriptions.qbanks',
          },
        },
        {
          $unwind: { path: '$qbank', preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: 'videosubjects',
            let: { videos: '$subscription.videos' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$videos'] } } },
              { $project: { syllabus: 1 } },
              {
                $lookup: {
                  from: 'syllabuses',
                  let: { syllabus: '$syllabus' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$syllabus'] },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        title: 1,
                        uuid: 1,
                      },
                    },
                  ],
                  as: 'syllabus',
                },
              },
            ],
            as: 'subscriptions.videos',
          },
        },
        {
          $unwind: { path: '$videos', preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: 'tscategories',
            let: { tests: '$subscription.tests' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$tests'] } } },
              {
                $project: {
                  'categories.title': 1,
                  'categories.uuid': 1,
                  'categories.order': 1,
                },
              },
            ],
            as: 'subscriptions.tests',
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
                actual: '$subscription.actual',
                discounted: '$subscription.discounted',
                flags: '$subscription.flags',
                course: '$subscriptions.course',
                qbanks: '$subscriptions.qbanks',
                videos: '$subscriptions.videos',
                tests: '$subscriptions.tests',
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

    // return await this.userModel.findOne({ uuid })
    //   .populate(
    //     {
    //       path: 'subscriptions',
    //       select: '_id uuid title courses videos tests qbanks createdOn order',
    //       // deep population method
    //       populate: {
    //         path: 'courses videos qbanks tests',
    //         select: {
    //           '_id ': 1,
    //           'uuid': 1,
    //           'title': 1,
    //           // 'syllabus': 1,
    //         },
    //         // populate: {
    //         //   path: 'syllabus',
    //         //   select: 'title',
    //         // }
    //       },
    //     }
    //   )
    //   .exec();
  }

  async findByUuid(uuid: string) {
    return await this.userModel
      .findOne({ uuid })
      // .populate(
      //   {
      //     path: 'subscriptions',
      //     select: '_id uuid title courses videos tests qbanks createdOn order',
      //     // deep population method
      //     populate: {
      //       path: 'courses videos qbanks tests',
      //       select: {
      //         '_id ': 1,
      //         'uuid': 1,
      //         'title': 1,
      //         // 'syllabus': 1,
      //       },
      //       // populate: {
      //       //   path: 'syllabus',
      //       //   select: 'title',
      //       // }
      //     },
      //   }
      // )
      .exec();
  }

  async searchByMobile(request) {
    // console.log('requestrequestrequest', request);

    return await this.userModel.find({ mobile: request.mobile }).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.userModel.findOneAndDelete({ uuid }).exec();
  }

  async changePassword(
    uuid: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string; result: User }> {
    const hashOldPassword = await bcrypt.hash(oldPassword, 10);
    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.userModel.findOne({ uuid });

    if (user) {
      return bcrypt.compare(oldPassword, user.password).then((val) => {
        if (val) {
          return this.userModel
            .findOneAndUpdate({ uuid }, { password: hashNewPassword })
            .exec()
            .then((result) => {
              return { message: 'Password reset success!!', result };
            });
        } else {
          throw new HttpException(
            'Old Password Validation Failed. Please try again.',
            HttpStatus.UNAUTHORIZED
          );
        }
      });
    } else {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async resetPassword(
    uuid: string,
    newPassword: string
  ): Promise<{ message: string; result: User }> {
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.userModel.findOne({ uuid });
    if (user) {
      return this.userModel
        .findOneAndUpdate({ uuid }, { password: hashNewPassword })
        .exec()
        .then((result) => {
          return { message: 'Password reset success!!', result };
        });
    } else {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async addOrganizationByUserUuid(uuid: string, request: any): Promise<User> {
    return this.userModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async assignSubscriptionsByUserUuid(uuid: string, request: any) {
    var result = this.userModel.findOneAndUpdate({ uuid }, request).exec();

    //let subscriptions=request.subscriptions;

    return result;
  }

  // async deleteOrganizationByUserUuid(
  //   uuid: string,
  //   orgUuid: string
  // ): Promise<User> {
  //   return this.userModel
  //     .update({}, { $pull: { organizations: { uuid: orgUuid } } })
  //     .exec();
  // }

  async editByUuid(uuid: string, request: any): Promise<User> {
    return this.userModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async clearSubscrptions(uuid: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { uuid },
        { qbanks: [], tests: [], videos: [], subscriptions: [] }
      )
      .exec();
  }

  // async fetchCouponsBysubscriptions(
  //   UserId: string[], subscription_id: string): Promise<any>  {

  //     const subscription = this.subscriptionModel.findOne({_id: new ObjectId(subscription_id)}).exec();

  //     const specificCoupons =  this.coupon.find({
  //       $or:[
  //           { users      : {$in:UserId}},
  //           { couponType : 'allUsers' },
  //           { couponType : 'users' },
  //           { valiedFrom :{$lte:new Date()}},
  //           { valiedTo :{$gte:new Date()} }
  //         ],
  //       subscription: subscription_id,
  //       availableCoupons: { $gt: 0 },
  //       agent:null,
  //       'flags.active':true,
  //     }).exec();

  //   return specificCoupons;
  // }
  async fetchCouponsBysubscriptions(
    UserId: string[],
    subscription_id: string
  ): Promise<any> {
    let datee = new Date();
    let today = datee.getTime();

    const specificCoupons = this.coupon
      .find({
        $or: [{ users: { $in: UserId } }, { couponType: 'allUsers' }],
        valiedFrom: { $lte: new Date(today) },
        valiedTo: { $gte: new Date(today) },
        subscription: subscription_id,
        availableCoupons: { $gt: 0 },
        agent: null,
        'flags.active': true,
      })
      .exec();

    return specificCoupons;
  }

  async fetchAgentCouponsBysubscriptions(
    subscription_id: string
  ): Promise<any> {
    let datee = new Date();
    let today = datee.getTime();

    const specificCoupons = this.coupon
      .find({
        $or: [{ couponType: 'agent' }],
        valiedFrom: { $lte: new Date(today) },
        valiedTo: { $gte: new Date(today) },
        subscription: subscription_id,
        availableCoupons: { $gt: 0 },
        // agent:null,
        'flags.active': true,
      })
      .exec();

    return specificCoupons;
  }

  async getTransactionsDateFilter(transactionsInterface, employee) {
    var fffdatetime = new Date(transactionsInterface.fromDate);
    let fdatetime = new Date(fffdatetime.getTime() + 5.5 * 60 * 60 * 1000);

    var fmonth = fdatetime.getMonth() + 1;
    var fday = fdatetime.getDate();
    var fyear = fdatetime.getFullYear();
    var fdateTimeString = fyear + '-' + fmonth + '-' + fday;
    let ftimee = new Date(fdateTimeString);
    let ftime = new Date(ftimee).setUTCHours(0, 0, 0, 0);
    // let fromDate = ftime.getTime() + (5.5 * 60 * 60 * 1000)

    var ttimeeeee = new Date(transactionsInterface.toDate);
    var tdatetime = new Date(ttimeeeee.getTime() + 5.5 * 60 * 60 * 1000);
    var tmonth = tdatetime.getMonth() + 1;
    var tday = tdatetime.getDate();
    var tyear = tdatetime.getFullYear();
    var tdateTimeString = tyear + '-' + tmonth + '-' + tday;
    let ttimee = new Date(tdateTimeString);

    let ttime = new Date(ttimee).setUTCHours(23, 59, 59, 999);
    // let toDate = ttime.getTime() + (5.5 * 60 * 60 * 1000)

    console.log('fromDate', new Date(ftime));
    console.log('toDate', new Date(ttime));

    const coursesList = await this.getEmployeeCourses(employee);

    console.log('coursesList', coursesList);

    return this.userModel
      .find(
        {
          createdOn: {
            $gte: new Date(ftime),
            $lte: new Date(ttime),
          },
          courses: { $in: coursesList },
        },
        {
          _id: 1,
          uuid: 1,
          name: 1,
          email: 1,
          mobile: 1,
          createdOn: 1,
          flags: 1,
          accessToken: 1,
          otp: 1,
          subscriptions: 1,
        }
      )
      .sort({ createdOn: 'DESC' })
      .exec();

    // return this.userModel
    //   .aggregate([
    //     {
    //       $match: {
    //         "createdOn": {
    //           $gte: new Date(ftime),
    //           $lte: new Date(ttime)
    //         },
    //         // "courses": { $in: coursesList }
    //       }
    //     },
    //     {  $unwind: { path: '$subscriptions', preserveNullAndEmptyArrays: true } },
    //     {
    //       $lookup: {
    //         from: 'subscriptions',
    //         let: {
    //           subscription_id: "$subscriptions.subscription_id"
    //         },
    //         pipeline: [{
    //           $match: {
    //             $expr: { $eq: ["$_id", "$$subscription_id"] }
    //           }
    //         },
    //         {
    //           $project: {
    //             _id: 1,
    //             uuid: 1,
    //             title: 1,
    //           }
    //         }
    //         ],
    //         as: 'subscription'
    //       }
    //     },

    //     {
    //       $group: {

    //         _id: {
    //           _id: "$_id",
    //           uuid: "$uuid",
    //           name: "$name",
    //           email: "$email",
    //           mobile: "$mobile",
    //           createdOn:"$createdOn",
    //           flags:"$flags",
    //           accessToken:"$accessToken",
    //           otp:"$otp"
    //         },
    //         subscription: {
    //           $addToSet: {
    //             "_id": "$subscriptions._id",
    //             "subscription_id": "$subscriptions.subscription_id",
    //             "uuid": "$subscriptions.uuid",
    //             "expiry_date": "$subscriptions.expiry_date",
    //             "active": "$subscriptions.active",
    //             "createdOn": "$subscriptions.createdOn",
    //             "title": "$subscription.title"
    //           }
    //         },
    //       }
    //     },
    //     {
    //       $project: {
    //         "_id": '$_id._id',
    //         "uuid": '$_id.uuid',
    //         "name": '$_id.name',
    //         "email": '$_id.email',
    //         "mobile": '$_id.mobile',
    //         "createdOn":"$_id.createdOn",
    //         "flags":"$_id.flags",
    //         "accessToken":"$_id.accessToken",
    //         "otp":"$_id.otp",
    //         "subscriptions": "$subscription",
    //       }
    //     }
    //   ]).exec()
  }

  async disableUserForTestSubmits(resuest) {
    const disableuserfortestsubmits = new this.disableuserfortestsubmitsModel(
      resuest
    );
    return disableuserfortestsubmits.save();
  }
  async disableUserForTestSubmitsList() {
    return this.disableuserfortestsubmitsModel.find();
  }

  async disableUserForTestSubmitStatus(id, request) {
    if (request.type == 'subscription') {
      return this.disableuserfortestsubmitsModel
        .findOneAndUpdate(
          { _id: id },
          {
            subscription: request.status,
          }
        )
        .exec();
    } else if (request.type == 'showInActiveCourses') {
      return this.disableuserfortestsubmitsModel
        .findOneAndUpdate(
          { _id: id },
          {
            showInActiveCourses: request.status,
          }
        )
        .exec();
    } else if (request.type == 'submission') {
      return this.disableuserfortestsubmitsModel
        .findOneAndUpdate(
          { _id: id },
          {
            submission: request.status,
          }
        )
        .exec();
    } else if (request.type == 'status') {
      return this.disableuserfortestsubmitsModel
        .findOneAndUpdate(
          { _id: id },
          {
            status: request.status,
          }
        )
        .exec();
    }
  }

  async disableUserForTestSubmitDelete(uuid) {
    return this.disableuserfortestsubmitsModel
      .findOneAndDelete({ uuid })
      .exec();
  }

  async copyUsersToAnotherDatabase(body) {
    var mongoose = require('mongoose');
    var conn1 = mongoose.createConnection(
      'URL',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    var conn2 = mongoose.createConnection(
      'URL',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );

    const UserFirst = conn1.model(
      'User',
      new mongoose.Schema({}, { collection: `users`, strict: false })
    );
    const UserSecond = conn2.model(
      'User',
      new mongoose.Schema({}, { collection: `users`, strict: false })
    );

    const qbankfirst = conn1.model(
      'SubmittedQBankTopic',
      new mongoose.Schema(
        {},
        { collection: `submittedqbanktopics`, strict: false }
      )
    );
    const qbankSecond = conn2.model(
      'SubmittedQBankTopic',
      new mongoose.Schema(
        {},
        { collection: `submittedqbanktopics`, strict: false }
      )
    );

    const testSeriesFirst = conn1.model(
      'SubmittedTest',
      new mongoose.Schema({}, { collection: `submittedtests`, strict: false })
    );
    const testSeriesSecond = conn2.model(
      'SubmittedTest',
      new mongoose.Schema({}, { collection: `submittedtests`, strict: false })
    );

    var result = [];
    if (body.type == 'mobile') {
      result = await UserFirst.find({ mobile: body.mobile }).exec();
    } else if (body.type == 'course') {
      result = await UserFirst.find({
        courses: mongoose.Types.ObjectId(body.course),
      }).exec();
    }
    // console.log("Total Users "+ result.length);

    var UserCount = 1;
    result.forEach(async (elements) => {
      var element = elements.toObject();

      // Copy Users Data Into Another Database
      var check = await UserSecond.findOne({ mobile: element.mobile }).exec();
      if (check) {
        var uuid = element.uuid;
        await UserSecond.findOneAndUpdate({ uuid }, element, {
          useFindAndModify: false,
        }).exec();
        console.log('User updated');
      } else {
        let swap = new UserSecond(element); //or result.toObject
        await swap.save();
      }

      // Copy Users Tests Data Into Another DataBase
      await testSeriesFirst.find({ userId: element._id }, function (
        err,
        testresult
      ) {
        console.log('Test Count' + testresult.length);
        var count = 1;
        testresult.forEach(async (testelements) => {
          var testelement = testelements.toObject();
          var check = await testSeriesSecond
            .findOne({ _id: testelement._id })
            .exec();
          if (check) {
            var uuid = testelement.uuid;
            delete testelement._id;
            await testSeriesSecond
              .findOneAndUpdate({ uuid }, testelement, {
                useFindAndModify: false,
              })
              .exec();
            console.log('Test updated ' + count);
          } else {
            let swap = new testSeriesSecond(testelement); //or result.toObject
            await swap.save();
          }
          count = count + 1;
          testelements.remove();
        });
      });

      //Copy Users Qbank From One Database To another Database
      await qbankfirst.find({ userId: element._id }, function (
        err,
        qbankresult
      ) {
        console.log('Qbank Count ' + qbankresult.length);
        var countqbank = 1;
        qbankresult.forEach(async (qbankelements) => {
          var qbankelement = qbankelements.toObject();
          var check = await qbankSecond
            .findOne({ _id: qbankelement._id })
            .exec();
          if (check) {
            var uuid = qbankelement.uuid;
            delete qbankelement._id;
            await qbankSecond
              .findOneAndUpdate({ uuid }, qbankelement, {
                useFindAndModify: false,
              })
              .exec();
            console.log('Qbank updated ' + countqbank);
          } else {
            let swap = new qbankSecond(qbankelement); //or result.toObject
            await swap.save();
          }
          countqbank = countqbank + 1;
          qbankelements.remove();
        });
      });
      elements.remove();
      console.log('User Copied ' + UserCount);
      UserCount = UserCount + 1;
    });
    return [];
  }
  // async getTransactionsDateFilter(transactionsInterface) {
  //   let fromDate = transactionsInterface.fromDate;
  //   let toDate = transactionsInterface.toDate;
  //   return this.userModel.find({
  //     createdOn: {
  //       $gte:fromDate,
  //       $lte: toDate
  //     }
  //   })
  //   .exec();

  // }

  async fetchUsersSubmittedData(body) {
    var userId = body.userId;
    const user = await this.userModel
      .findOne(
        { _id: mongoose.Types.ObjectId(userId) },
        {
          courses: 1,
          uuid: 1,
        }
      )
      .exec();

    var qbanksubmission = await this.submittedQBankTopic
      .aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'courses',
            let: { courseId: '$courseId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$courseId'] } } },
              { $project: { title: 1 } },
            ],
            as: 'courses',
          },
        },
        {
          $project: {
            qbankTopicUuid: 1,
            subjectId: 1,
            courseId: 1,
            courses: 1,
          },
        },
      ])
      .exec();

    var qbankdata = [];

    for (let index = 0; index < qbanksubmission.length; index++) {
      const element = qbanksubmission[index];

      var singleSubjectData = null;
      var Qbank = await this.qBankSubjectmodel
        .aggregate([
          { $match: { 'chapters.topics.uuid': element.qbankTopicUuid } },
          { $unwind: '$chapters' },
          {
            $addFields: {
              'chapters.topics': {
                $filter: {
                  input: '$chapters.topics',
                  cond: { $eq: ['$$this.uuid', element.qbankTopicUuid] },
                },
              },
            },
          },
          {
            $project: {
              'chapters.uuid': 1,
              'chapters.title': 1,
              'chapters.topics.title': 1,
              'chapters.topics.uuid': 1,
              'chapters.topics.description': 1,
            },
          },
        ])
        .exec()
        .then(async (res) => {
          let totalres = res.filter((it) => it.chapters.topics.length > 0)[0]
            .chapters.topics[0];
          let res2 = res.filter((it) => it.chapters.topics.length > 0)[0]
            .chapters;
          if (res2) {
            totalres['chapter_uuid'] = res2.uuid;
            totalres['chapter_title'] = res2.title;
          }
          return totalres;
        })
        .catch((err) => err);
      singleSubjectData = {
        _id: element._id,
        courseId: element.courseId,
        qbankTopicUuid: element.qbankTopicUuid,
        subjectId: element.subjectId,
        courses: element.courses,
        Qbank: Qbank,
      };
      qbankdata.push(singleSubjectData);
    }

    return { qbank_data: qbankdata, test_series: [] };
  }

  async fetchUsersSubmittedTests(body) {
    var userId = body.userId;
    var testseriesData = [];
    const userTestSubmission = await this.submittedTest
      .aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'courses',
            let: { courseId: '$courseId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$courseId'] } } },
              { $project: { title: 1 } },
            ],
            as: 'courses',
          },
        },
        {
          $project: {
            testSeriesUuid: 1,
            courseId: 1,
            subjectId: 1,
            categoryUuid: 1,
            courses: 1,
          },
        },
      ])
      .exec();

    for (
      let indexTest = 0;
      indexTest < userTestSubmission.length;
      indexTest++
    ) {
      const elementTest = userTestSubmission[indexTest];
      var singletesttData = null;

      var testSeries = await this.TSCategoriesModel.aggregate([
        {
          $match: {
            uuid: elementTest.categoryUuid,
            'categories.tests.uuid': elementTest.testSeriesUuid,
          },
        },
        { $unwind: '$categories' },
        {
          $addFields: {
            'categories.tests': {
              $filter: {
                input: '$categories.tests',
                cond: { $eq: ['$$this.uuid', elementTest.testSeriesUuid] },
              },
            },
          },
        },
        {
          $project: {
            uuid: 1,
            'categories.uuid': 1,
            'categories.title': 1,
            'categories.tests.title': 1,
            'categories.tests.uuid': 1,
            'categories.tests.subjects': 1,
            'categories.tests.description': 1,
          },
        },
      ])
        .exec()
        .then(async (res) => {
          // return res[0];
          var totalres = res[0].categories.tests[0];
          // let totalres = res.filter(it => it.chapters.topics.length > 0)[0].chapters.topics[0];

          totalres['categorie_uuid'] = res[0].uuid;
          totalres['categorie_title'] = res[0].categories.title;
          return totalres;
        })
        .catch((err) => err);
      singletesttData = {
        _id: elementTest._id,
        courseId: elementTest.courseId,
        testSeriesUuid: elementTest.testSeriesUuid,
        subjectId: elementTest.subjectId,
        courses: elementTest.courses,
        categoryUuid: elementTest.categoryUuid,
        testSeries: testSeries,
      };
      testseriesData.push(singletesttData);
    }

    return { test_series: testseriesData };
  }
  async inActiveUsers(): Promise<User[]> {
    return await this.userModel
      .find(
        { 'flags.isActive': false },
        {
          name: 1,
          mobile: 1,
          type: 1,
          uuid: 1,
          createdOn: 1,
          flags: 1,
          accessToken: 1,
          email: 1,
        }
      )
      .exec();
  }
}
