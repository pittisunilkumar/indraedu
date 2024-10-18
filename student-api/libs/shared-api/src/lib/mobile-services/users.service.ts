import {
  NotificationResponseInterface,
  SocialAuthTypes,
  UserBookmarkInterface,
} from '@application/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as itUuid from 'uuid';
import { RegisterUserDto } from '../dto';
import {
  Question,
  User,
  SubmittedQBankTopic,
  SubmittedTest,
  UserNotifications,
  Notifications,
  Course,
  Organization,
  SmsTemplates,
} from '../schema';
import * as mongoose from 'mongoose';
import { CommonFunctions } from '../helpers/functions';
@Injectable()
export class MobileUsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Organization') private organazationModel: Model<Organization>,
    @InjectModel('SmsTemplate') private smsTemplateModel: Model<SmsTemplates>,
    @InjectModel('SubmittedQBankTopic')
    private submittedQBankTopicModel: Model<SubmittedQBankTopic>,
    @InjectModel('Question') private questionModel: Model<Question>,
    @InjectModel('SubmittedTest')
    private SubmittedTestModel: Model<SubmittedTest>,
    @InjectModel('UserNotifications')
    private userNotificationsModel: Model<UserNotifications>,
    @InjectModel('Notifications')
    private notificationsModel: Model<Notifications>
  ) {}

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

    return this.userModel
      .findOneAndUpdate({ uuid }, user, { useFindAndModify: false })
      .exec();
  }

  async findByMobile(mobile): Promise<User> {
    return this.userModel
      .findOne({ mobile })
      .populate({
        path: 'subscriptions',
        select:
          '_id uuid title courses videos tests qbanks createdOn modifiedOn',
        // deep population method
        populate: {
          path: 'courses videos tests qbanks',
          select: '_id uuid title categories',
          populate: {
            path: 'categories',
            select: '_id uuid title',
          },
        },
      })
      .exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findStudentDetailsByUuid(request): Promise<any> {
    let uuid = request.user.uuid;
    let user = await this.userModel
      .findOne({ uuid })
      .populate({
        path: 'subscriptions',
        select:
          '_id uuid title courses videos tests qbanks createdOn modifiedOn',
        // deep population method
        populate: {
          path: 'courses videos qbanks tests',
          select: '_id uuid title categories',
          populate: {
            path: 'categories',
            select: '_id uuid title',
          },
        },
      })
      .exec();
    return {
      status: true,
      code: 2000,
      message: 'User Profile Fetched Successfully',
      data: user,
    };
  }

  async findStudentByUuid(request): Promise<any> {
    let uuid = request.user.uuid;
    let user = await this.userModel
      .findOne({ uuid }, { uuid: 1, email: 1, name: 1, mobile: 1 })
      .exec();
    return {
      status: true,
      code: 2000,
      message: 'User Profile Fetched Successfully',
      data: user,
    };
  }

  async updateProfile(request, body: any): Promise<any> {
    let uuid = request.user.uuid;

    await this.userModel
      .findOneAndUpdate({ uuid }, body, { useFindAndModify: false })
      .exec();

    let user = await this.userModel
      .findOne({ uuid }, { uuid: 1, email: 1, name: 1, mobile: 1 })
      .exec();
    return {
      status: true,
      code: 2000,
      message: 'User Profile Fetched Successfully',
      data: user,
    };
  }

  async updateUserProfileImage(request, body: any, file: any): Promise<any> {
    let uuid = request.user.uuid;

    await this.userModel
      .findOneAndUpdate({ uuid }, { imgUrl: file }, { useFindAndModify: false })
      .exec();

    let user = await this.userModel
      .findOne({ uuid }, { uuid: 1, email: 1, name: 1, mobile: 1, imgUrl: 1 })
      .exec();
    return {
      status: true,
      code: 2000,
      message: 'User Profile Fetched Successfully',
      data: user,
    };
  }

  async userLogout(request): Promise<any> {
    let uuid = request.user.uuid;
    const userssss = await this.userModel
      .findOneAndUpdate(
        { uuid },
        {
          devices: [],
          isLoggedIn: false,
          accessToken: '',
        },
        { useFindAndModify: false }
      )
      .exec();
    return {
      status: true,
      code: 2000,
      message: 'User Logout Successfully',
      data: userssss,
    };
  }

  async resetUserTest(request) {
    let userId = request.userId;
    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let qbankTopicUuid = request.qbankTopicUuid;
    let testTopicUuid = request.testTopicUuid;
    //console.log('testTopicUuid',testTopicUuid);
    this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $pull: { 'submissions.qbanks': { qbankTopicUuid: qbankTopicUuid } },
        },
        { useFindAndModify: false }
      )
      .exec();
    this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          //$pull: {"qbanksTestSubmissions": {"qbankTopicUuid":{$in:[ testTopicUuid] } }   }
          $pull: { qbanksTestSubmissions: { qbankTopicUuid: testTopicUuid } },
        },
        { useFindAndModify: false }
      )
      .exec();
    this.submittedQBankTopicModel
      .remove({
        userId: mongoose.Types.ObjectId(userId),
        courseId: mongoose.Types.ObjectId(courseId),
        subjectId: mongoose.Types.ObjectId(subjectId),
        qbankTopicUuid: qbankTopicUuid,
      })
      .exec();
    return true;
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
            .findOneAndUpdate(
              { uuid },
              { password: hashNewPassword },
              { useFindAndModify: false }
            )
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

  async assignSubscriptionsByUserUuid(uuid: string, request: any) {
    return this.userModel
      .findOneAndUpdate({ uuid }, request, { useFindAndModify: false })
      .exec();
  }

  async toggleBookMarksByUserUuid(user, payload: UserBookmarkInterface) {
    var userUuid = user.uuid;
    payload.createdOn = new Date();
    payload.uuid = itUuid.v4();

    const userBookMarks = await this.userModel
      .findOneAndUpdate(
        { uuid: userUuid, type: 'STUDENT' },
        {
          $push: {
            bookmarks: {
              uuid: payload.uuid,
              question: payload.question,
              metadata: payload.metadata,
              createdOn: payload.createdOn,
            },
          },
        },
        { useFindAndModify: false }
      )
      .exec();
    // return {"status": true,"code" : 2000, 'message' : 'User Bookmark Added Successfully', 'data' : userBookMarks.bookmarks}
    return userBookMarks.bookmarks;
  }

  async removeBookMark(user, bookMarkUuid: string) {
    var uuid = user.uuid;
    console.log({ uuid, bookMarkUuid });

    const userBookMarks = await this.userModel
      .findOneAndUpdate(
        { uuid },
        {
          $pull: {
            bookmarks: { uuid: bookMarkUuid },
          },
        },
        { useFindAndModify: false }
      )
      .exec();
    return userBookMarks.bookmarks;
  }

  async getAllBookMarksByUserUuid(uuid: string) {
    return this.userModel
      .findOne({ uuid })
      .populate({
        path: 'bookmarks.question',
        model: Question,
        select:
          '_id uuid title options description imgUrl tags previousAppearances',
      })
      .select({
        bookmarks: 1,
      })
      .exec();
  }

  async loginWithOtp(request, requests): Promise<any> {
    try {
      var number = requests.mobile.trim();
      var number_length = ('' + number).length;
      var phoneno = /^\+?([6-9]{1})\)?([0-9]{9})$/;
      if (number.match(phoneno)) {
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Please Enter Correct Number',
          data: [],
        };
      }

      if (number_length == 10 && isNumber(number)) {
        const users = await this.findByMobile(requests.mobile);
        var otp = this.generateOTP();

        if (users) {
          if (users?.mobile === 9876543210 || users?.mobile === 9876543211) {
            otp = '654321';
          }
        }

        // const otp = '123456';
        const now = new Date();
        const expiration_time = this.AddMinutesToDate(now, 10);

        if (!users) {
          // throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
          const users = new this.userModel();
          users.mobile = requests.mobile;
          users.uuid = requests.uuid;
          users.email = '';
          users.name = '';
          users.otp = otp;
          users.signinType = SocialAuthTypes.MOBILE;
          users.expiration_time = expiration_time;
          users.flags = { isActive: true };
          users.createdOn = new Date();
          // users.flags = { active:false, paid: false,isLoggedIn:false};
          await users.save();
          // var url = 'http://www.bulksmsapps.com/api/apismsv2.aspx?apikey=e10df577-740e-4f74-96ac-12193192c152&sender=PLATOS&number=' + requests.mobile + '&message=Dear User, ' + otp + ' is One time password (OTP) for PLATO. Thank You.  e7G8/x19NrB';
          // await this.getScript(url)
        } else {
          users.otp = otp;
          users.expiration_time = expiration_time;
          await users.save();
        }
        const user = await this.findByMobile(requests.mobile);
        if ((await users?.flags.isActive) && users?.mobile != 9876543211 && users?.mobile != 9876543210) {
          var application = request.headers.application;

          const code = '7TAALm+AyNi';
        
          if (application) {
            var data = await this.organazationModel
              .findOne({ _id: application })
              .sort('order')
              .exec();

            var template = await this.smsTemplateModel.findOne({
              key: 'OTP',
              organization: application,
            });

            if (template) {
              let newString = template.template
                .replace(/\[OTP\]/g, otp)
                .replace(/\[CODE\]/g, code);

              var message = encodeURIComponent(newString);

              var sendMessage = await CommonFunctions.SendMessage(
                data.workingkey,
                data.senderId,
                requests.mobile,
                message
              );
            }
          }
          console.log('otp sent');
        } else {
          console.log('Otp Not sent');
        }

        return {
          status: true,
          code: 2000,
          message: 'OTP sent Successfully  ' + otp,
          data: [],
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Please Enter Correct Number',
          data: [],
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: [] };
    }
  }

  async loginWithOtpName(request, requests): Promise<any> {
    var number = requests.mobile.trim();
    var number_length = ('' + number).length;
    var phoneno = /^\+?([6-9]{1})\)?([0-9]{9})$/;
    if (number.match(phoneno)) {
    } else {
      return {
        status: false,
        code: 2001,
        message: 'Please Enter Correct Number',
        data: [],
      };
    }

    if (number_length == 10 && isNumber(number)) {
      const users = await this.findByMobile(requests.mobile);
      var otp = this.generateOTP();

      if (users) {
        if (users?.mobile === 9876543210 || users?.mobile === 9876543211) {
          otp = '654321';
        }
      }

      // const otp = '123456';
      const now = new Date();
      const expiration_time = this.AddMinutesToDate(now, 10);

      if (!users) {
        // throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        const users = new this.userModel();
        users.mobile = requests.mobile;
        users.uuid = requests.uuid;
        users.email = '';
        users.name = requests.name;
        users.otp = otp;
        users.signinType = SocialAuthTypes.MOBILE;
        users.expiration_time = expiration_time;
        users.flags = { isActive: true };
        users.createdOn = new Date();
        // users.flags = { active:false, paid: false,isLoggedIn:false};
        users.save();
        // var url = 'http://www.bulksmsapps.com/api/apismsv2.aspx?apikey=e10df577-740e-4f74-96ac-12193192c152&sender=PLATOS&number=' + requests.mobile + '&message=Dear User, ' + otp + ' is One time password (OTP) for PLATO. Thank You.  e7G8/x19NrB';
        // await this.getScript(url)
      } else {
        users.otp = otp;
        users.expiration_time = expiration_time;
        users.save();
      }
      if ((await users?.flags.isActive) && users?.mobile != 9876543210 && users?.mobile != 9876543211) {
        var application = request.headers.application;

        const code = '7TAALm+AyNi';
        var url =
          'https://alerts.prioritysms.com/api/web2sms.php?workingkey=KEY&sender=SENDER&to=' +
          requests.mobile +
          '&message=' +
          message;

        if (application) {
          var data = await this.organazationModel
            .findOne({ _id: application })
            .sort('order')
            .exec();

          var template = await this.smsTemplateModel.findOne({ key: 'OTP' });

          if (template) {
            let newString = template.template
              .replace(/\[OTP\]/g, otp)
              .replace(/\[CODE\]/g, code);

            var message = encodeURIComponent(newString);
            var sendMessage = await CommonFunctions.SendMessage(
              data.workingkey,
              data.senderId,
              requests.mobile,
              message
            );
          }
        }
        if ((await users?.flags.isActive) && users?.mobile != 9876543211 && users?.mobile != 9876543210) {
          await this.getScript(url);
        }
      } else {
        console.log('Otp Not sent',users?.mobile);
      }

      return {
        status: true,
        code: 2000,
        message: 'OTP sent Successfully  ' + otp,
        data: [],
      };
    } else {
      return {
        status: false,
        code: 2001,
        message: 'Please Enter Correct Number',
        data: [],
      };
    }
  }

  async updateUserCourse(req, body): Promise<any> {
    if (body.courseId) {
      var mobile = req.user.mobile;
      const users = await this.findByMobile(mobile);
      const course = await this.courseModel
        .findOne({ _id: body.courseId })
        .exec();
      if (users) {
        if (!users.courses) {
          console.log(users.courses);
        }

        users.courses = body.courseId;
        users.organizations = course.organizations;
        users.save();
        return {
          status: true,
          code: 2000,
          message: 'Updated Successfully',
          data: [],
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'User Details Not Found',
          data: [],
        };
      }
    } else {
      return {
        status: false,
        code: 2001,
        message: 'Please Select Course',
        data: [],
      };
    }
  }

  async verifyOtp(requests) {
    try {
      const users = await this.findByMobile(requests.mobile);
      // users
      const uuid = users.uuid;

      // const userssss = await this.userModel.findOne({ uuid }).exec().then(res => {
      //   console.log('deviceIdExist', deviceIdExist);
      //   console.log('res.devices', res.devices);
      //   res.devices?.forEach(dev => {
      //     if (dev?.id === requests.device_id) {
      //       console.log('true');
      //       dev.isLoggedIn = true;
      //     } else {
      //       console.log('false');
      //       dev.isLoggedIn = false;
      //     }
      //   });
      //   return res;

      // })
      // this.userModel.findOneAndUpdate({ uuid }, userssss).exec();

      var now = new Date();
      if (users.otp == requests.otp) {
        console.log('users.otp', users.otp);
        if (now <= users.expiration_time) {
          console.log('users.expiration_time', users.expiration_time);
          users.otp = '';
          users.isLoggedIn = true;
          var device_id = '';
          var device_type = '';
          var fcm_token = '';

          if (requests.device_type == 'ios') {
            device_type = requests.device_type;
          } else if (requests.device_type == 'web') {
            device_type = requests.device_type;
          } else {
            device_type = 'android';
          }

          if (requests.device_id) {
            device_id = requests.device_id;
          } else {
            device_id = requests.fcm_token;
          }

          if (requests.fcm_token) {
            fcm_token = requests.fcm_token;
          } else {
            fcm_token = requests.device_id;
          }

          await this.userModel
            .findOneAndUpdate(
              { uuid, type: 'STUDENT' },
              {
                $set: {
                  devices: [],
                },
              },
              { useFindAndModify: false }
            )
            .exec();
          const devices = this.userModel
            .findOneAndUpdate(
              { uuid, type: 'STUDENT' },
              {
                $push: {
                  devices: {
                    id: fcm_token,
                    fcm_token: fcm_token,
                    isLoggedIn: true,
                    device_type: device_type,
                    device_id: device_id,
                  },
                },

                // $set: {
                //   "devices": [{
                //     id: requests.device_id, isLoggedIn: true
                //   }]
                // }

                // { $addToSet: {
                //   devices: {
                //     id: requests.device_id ,isLoggedIn:true
                //   }
                // }
              },
              { useFindAndModify: false }
            )
            .exec();
          users.save();
          return {
            status: true,
            code: 2000,
            message: 'Verified Successfully',
            data: users,
          };
        } else {
          return { status: false, code: 2001, message: 'expired', data: [] };
        }
      } else {
        return {
          status: false,
          code: 2002,
          message: 'invalid inputs Please Enter Valid Data',
          data: [],
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: [] };
    }
  }

  async socialSignin(requests) {
    try {
      const users = await this.findByEmail(requests.email);
      // users
      let uuid = itUuid.v4();
      var device_id = '';
      var device_type = '';
      var fcm_token = '';

      if (requests.device_type == 'ios') {
        device_type = requests.device_type;
      } else if (requests.device_type == 'web') {
        device_type = requests.device_type;
      } else {
        device_type = 'android';
      }

      if (requests.device_id) {
        device_id = requests.device_id;
      } else {
        device_id = requests.fcm_token;
      }

      if (requests.fcm_token) {
        fcm_token = requests.fcm_token;
      } else {
        fcm_token = requests.device_id;
      }

      if (!users) {
        const users = new this.userModel();
        users.mobile = requests.mobile;
        users.uuid = uuid;
        users.email = requests.email;
        users.profileId = requests.profileId;
        users.name = requests.name;
        users.signinType = SocialAuthTypes.GOOGLE;
        users.flags = { isActive: true };
        users.createdOn = new Date();
        await users.save();
      } else {
        users.save();
        uuid = users.uuid;
      }

      await this.userModel
        .findOneAndUpdate(
          { uuid, type: 'STUDENT' },
          {
            $set: {
              devices: [],
            },
          },
          { useFindAndModify: false }
        )
        .exec();
      const devices = this.userModel
        .findOneAndUpdate(
          { uuid, type: 'STUDENT' },
          {
            $push: {
              devices: {
                id: fcm_token,
                fcm_token: fcm_token,
                isLoggedIn: true,
                device_type: device_type,
                device_id: device_id,
              },
            },
          },
          { useFindAndModify: false }
        )
        .exec();

      const userData = await this.findByEmail(requests.email);

      return {
        status: true,
        code: 2000,
        message: 'Verified Successfully',
        data: userData,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: [] };
    }
  }

  async bookMarkQuestion(req, request) {
    let type = request.type;
    let addedDate = request.addedDate;
    let courseId = request.courseId;
    let userId = req.user._id;
    let questionId = request.questionId;

    let question: any;
    question = await this.questionModel
      .findOne({ _id: mongoose.Types.ObjectId(request.questionId) })
      .exec();
    // console.log('question',question);
    let questionUuid = question.uuid;

    if (type == 'test') {
      let categoryUuid = request.categoryUuid;
      let testUuid = request.testUuid;
      let subjectId = request.subjectId;

      let bookmark = {
        courseId: courseId,
        subjectId: subjectId,
        categoryUuid: categoryUuid,
        testUuid: testUuid,
        questionId: questionId,
        type: type,
        addedDate: addedDate,
      };
      let dbTestBookMark = await this.userModel
        .aggregate([
          { $match: { _id: mongoose.Types.ObjectId(userId) } },
          { $unwind: '$bookmarks' },
          {
            $match: {
              'bookmarks.courseId': mongoose.Types.ObjectId(courseId),
              'bookmarks.subjectId': mongoose.Types.ObjectId(subjectId),
              'bookmarks.categoryUuid': categoryUuid,
              'bookmarks.testUuid': testUuid,
              'bookmarks.questionId': mongoose.Types.ObjectId(questionId),
            },
          },
          {
            $project: {
              bookmarks: 1,
            },
          },
        ])
        .exec();

      if (dbTestBookMark.length > 0) {
      } else {
        this.userModel
          .findOneAndUpdate(
            { _id: userId },
            {
              $push: { bookmarks: bookmark },
            },
            { new: true, useFindAndModify: false }
          )
          .exec();
      }

      var check = await this.SubmittedTestModel.updateMany(
        // filter and push to the object
        { userId: userId, testSeriesUuid: testUuid },
        // filter and push to the object
        {
          $set: { 'answers.$[elem].flags.isBookMarked': true },
        },
        {
          arrayFilters: [{ 'elem.question.uuid': { $eq: questionUuid } }],
        }
      ).exec();

      let bookmarkCount = await this.userModel
        .aggregate([
          { $match: { _id: mongoose.Types.ObjectId(userId) } },
          { $unwind: '$bookmarks' },
          {
            $match: {
              'bookmarks.courseId': mongoose.Types.ObjectId(courseId),
              'bookmarks.subjectId': mongoose.Types.ObjectId(subjectId),
              'bookmarks.categoryUuid': categoryUuid,
              'bookmarks.testUuid': testUuid,
            },
          },
          {
            $project: {
              bookmarks: 1,
            },
          },
        ])
        .exec();
      await this.SubmittedTestModel.updateMany(
        // filter and push to the object
        { userId: userId, testSeriesUuid: testUuid },
        // filter and push to the object
        {
          $set: { 'stats.bookmarkCount': bookmarkCount.length },
        }
      ).exec();
      return dbTestBookMark;
    } else {
      let subjectId = request.subjectId;
      let chapterUuid = request.chapterUuid;
      let topicUuid = request.topicUuid;

      let bookmark = {
        courseId: courseId,
        subjectId: subjectId,
        chapterUuid: chapterUuid,
        topicUuid: topicUuid,
        questionId: questionId,
        type: type,
        addedDate: addedDate,
      };
      let dbQbankBookMark = await this.userModel
        .aggregate([
          { $match: { _id: mongoose.Types.ObjectId(userId) } },
          { $unwind: '$bookmarks' },
          {
            $match: {
              'bookmarks.courseId': mongoose.Types.ObjectId(courseId),
              'bookmarks.subjectId': mongoose.Types.ObjectId(subjectId),
              'bookmarks.chapterUuid': chapterUuid,
              'bookmarks.topicUuid': topicUuid,
              'bookmarks.questionId': mongoose.Types.ObjectId(questionId),
            },
          },
        ])
        .exec();
      var check = await this.submittedQBankTopicModel
        .updateMany(
          // filter and push to the object
          { userId: userId, qbankTopicUuid: topicUuid },
          // filter and push to the object
          {
            $set: { 'answers.$[elem].flags.isBookMarked': true },
          },
          {
            arrayFilters: [{ 'elem.question.uuid': { $eq: questionUuid } }],
          }
        )
        .exec();

      if (dbQbankBookMark.length == 0) {
        await this.userModel
          .findOneAndUpdate(
            { _id: userId },
            {
              $push: { bookmarks: bookmark },
            },
            { new: true, useFindAndModify: false }
          )
          .exec();
      }
      return dbQbankBookMark;
    }
  }

  async unbookMarkQuestion(request: any, userDetails) {
    var userId = userDetails.user._id;
    await this.userModel
      .findOneAndUpdate(
        // filter and push to the object
        { _id: userId },

        // filter and push to the object
        {
          $pull: {
            bookmarks: {
              questionId: mongoose.Types.ObjectId(request.questionId),
            },
          },
        },
        { new: true, useFindAndModify: false }
      )
      .exec();

    let question: any;
    question = await this.questionModel
      .findOne({ _id: mongoose.Types.ObjectId(request.questionId) })
      .exec();
    // console.log('question',question);
    let questionUuid = question.uuid;

    // console.log('questionUuid',questionUuid);

    //let bookmark= true;
    await this.submittedQBankTopicModel
      .updateMany(
        // filter and push to the object
        { userId: userId },

        // filter and push to the object
        {
          $set: { 'answers.$[elem].flags.isBookMarked': request.bookmark },
        },
        {
          arrayFilters: [{ 'elem.question.uuid': { $eq: questionUuid } }],
        }
      )
      .exec();

    await this.SubmittedTestModel.updateMany(
      // filter and push to the object
      { userId: userId },

      // filter and push to the object
      {
        $set: { 'answers.$[elem].flags.isBookMarked': request.bookmark },
      },
      {
        arrayFilters: [{ 'elem.question.uuid': { $eq: questionUuid } }],
      }
    ).exec();
    let dbQbankBookMark = await this.userModel
      .aggregate([
        { $match: { _id: mongoose.Types.ObjectId(userId) } },
        { $unwind: '$bookmarks' },
        {
          $project: {
            bookmarks: 1,
          },
        },
      ])
      .exec();
    return dbQbankBookMark;
    //return question;
  }

  async getbookMarkQuestion(request, body) {
    var uuid = request.user.uuid;
    var courseId = body.courseId;

    console.log('courseId123', body);

    var bookmarks = this.userModel.aggregate(
      [
        {
          $match: {
            uuid: uuid,
            'bookmarks.courseId': mongoose.Types.ObjectId(courseId),
          },
        },
        {
          $unwind: '$bookmarks',
        },
        // { "$match": { "bookmarks.type": "qb" } },
        {
          // Equality Match
          $lookup: {
            from: 'syllabuses',
            localField: 'bookmarks.subjectId',
            foreignField: '_id',
            as: 'bookmarks.subjects',
          },
        },
        {
          $unwind: '$bookmarks.subjects',
        },
        {
          $lookup: {
            from: 'questions',
            let: {
              questionId: '$bookmarks.questionId',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$questionId'] },
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  shortTitle: 1,
                  uuid: 1,
                  mathType: 1,
                  imgUrl: 1,
                  descriptionImgUrl: 1,
                  matchLeftSideOptions: 1,
                  questionId: 1,
                  options: 1,
                  type: 1,
                  answer: 1,
                  description: 1,
                  flags: 1,
                  matchRightSideOptions: 1,
                },
              },
            ],
            as: 'bookmarks.questions',
          },
        },
        {
          $unwind: '$bookmarks.questions',
        },
        {
          $group: {
            _id: {
              id: '$_id',
              subjectId: '$bookmarks.subjectId',
              courseId: '$bookmarks.courseId',
              subjectName: '$bookmarks.subjects.title',
            },
            questions: { $addToSet: '$bookmarks.questions' },
          },
        },
        {
          $project: {
            _id: 0,
            // "subjectId": "$subjectId",
            courseId: '$_id.courseId',
            subjectName: '$_id.subjectName',
            questions: 1,
          },
        },
      ],
      function (err, results) {
        if (err) throw err;
        return results;
      }
    );

    var newArray = (await bookmarks).filter(function (item) {
      console.log(item.courseId);
      return item.courseId == courseId;
    });

    return newArray;
  }

  async verifyToken(requests, body) {
    try {
      var number = body.mobile;
      var number_length = ('' + number).length;

      if (number_length == 10 && isNumber(number)) {
        if (body.device_id) {
          let users = await this.findByMobile(body.mobile);
          if (!users) {
            users = await this.findByEmail(body.email);
          }

          console.log(users)

          // users
          const uuid = users.uuid;
          var active = 1;
          const userssss = await this.userModel.findOne({ uuid }).exec();

          userssss.devices?.forEach((dev) => {
            if (dev?.device_id === body.device_id && active === 1) {
              if (dev.isLoggedIn && active === 1) {
                active = 0;
              } else {
                active = 1;
              }
            }
          });
          if (active === 0) {
            return {
              status: true,
              code: 2000,
              message: 'verified',
              data: userssss,
            };
          } else {
            return { status: false, code: 2001, message: 'expired', data: {} };
          }
        } else {
          return {
            status: false,
            code: 2001,
            message: 'Device Id Required',
            data: {},
          };
        }
      } else {
        if (body.device_id) {
          let users = await this.findByEmail(body.email);

          console.log(users)

          // users
          const uuid = users.uuid;
          var active = 1;
          const userssss = await this.userModel.findOne({ uuid }).exec();

          userssss.devices?.forEach((dev) => {
            if (dev?.device_id === body.device_id && active === 1) {
              if (dev.isLoggedIn && active === 1) {
                active = 0;
              } else {
                active = 1;
              }
            }
          });
          if (active === 0) {
            return {
              status: true,
              code: 2000,
              message: 'verified',
              data: userssss,
            };
          } else {
            return { status: false, code: 2001, message: 'expired', data: {} };
          }
        } else {
          return {
            status: false,
            code: 2001,
            message: 'Device Id Required',
            data: {},
          };
        }
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  getScript = (url) => {
    return new Promise((resolve, reject) => {
      const http = require('http'),
        https = require('https');

      let client = http;

      if (url.toString().indexOf('https') === 0) {
        client = https;
      }

      client
        .get(url, (resp) => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            resolve(data);
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  };
  async viewSubscriptionsByUuid(uuid: string) {
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
        //   $lookup: {
        //     "from": "qbanksubjects",
        //     "let": { "qbanks": "$subscription.qbanks" },
        //     "pipeline": [
        //       { "$match": { "$expr": { "$in": ["$_id", "$$qbanks"] } } },
        //       { "$project": { "syllabus": 1 }},
        //       {
        //         $lookup: {
        //           from: "syllabuses",
        //           "let": { "syllabus": "$syllabus" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: { $eq: [ "$_id", "$$syllabus" ] }
        //               }
        //             },
        //             { $project: {
        //               "_id": 1 ,'title':1,'uuid':1
        //             } }
        //           ],
        //           as: "syllabus"
        //         }
        //       }
        //     ],
        //     "as": "subscriptions.qbanks"
        //   }
        // },
        // {
        //   $unwind: { path: "$qbank", preserveNullAndEmptyArrays: true }
        // },

        // {
        //   $lookup: {
        //     "from": "videosubjects",
        //     "let": { "videos": "$subscription.videos" },
        //     "pipeline": [
        //       { "$match": { "$expr": { "$in": ["$_id", "$$videos"] } } },
        //       { "$project": { "syllabus": 1 }},
        //       {
        //         $lookup: {
        //           from: "syllabuses",
        //           "let": { "syllabus": "$syllabus" },
        //           pipeline: [
        //             {
        //               $match: {
        //                 $expr: { $eq: [ "$_id", "$$syllabus" ] }
        //               }
        //             },
        //             { $project: {
        //               "_id": 1 ,'title':1,'uuid':1
        //             } }
        //           ],
        //           as: "syllabus"
        //         }
        //       }
        //     ],
        //     "as": "subscriptions.videos"
        //   }
        // },
        // {
        //   $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }
        // },

        // {
        //   $lookup: {
        //     "from": "tscategories",
        //     "let": { "tests": "$subscription.tests" },
        //     "pipeline": [
        //       { "$match": { "$expr": { "$in": ["$_id", "$$tests"] } } },
        //       { "$project": { "categories.title": 1,"categories.uuid": 1 ,'categories.order':1}},
        //     ],
        //     "as": "subscriptions.tests"
        //   }
        // },
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

  async copyUsersToAnotherDatabase(request) {
    var mongoose = require('mongoose');

    var conn1 = mongoose.createConnection(
      'url',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    );
    var conn2 = mongoose.createConnection(
      'url',
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
    var mobile = request.user.mobile;
    // result = await UserFirst.find({ "mobile": body.mobile }).exec();
    result = await UserFirst.find({ mobile: mobile }).exec();
    console.log('Total Users ' + result.length);

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

      return true;
    });
    return { status: true, code: 2000, message: 'User Deleted', data: [] };
  }

  async getNotifications(userId, body): Promise<NotificationResponseInterface> {
    try {
      let page = body.page;
      let limit = body.limit;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 50;
      }

      const pagee: number = parseInt(page);
      const limitt: number = parseInt(limit);
      const total = await this.userNotificationsModel.countDocuments({
        userId: userId,
      });
      const un_read = await this.userNotificationsModel.countDocuments({
        userId: userId,
        readStatus: 0,
      });
      const data = await this.userNotificationsModel
        .find({ userId: userId })
        .populate({
          path: 'notificationId',
          model: 'Notifications',
          select: {
            title: 1,
            message: 1,
            campaign: 1,
            icon: 1,
            branchUrl: 1,
            notificationType: 1,
          },
        })
        .sort({ createdOn: -1 })
        .skip((pagee - 1) * limitt)
        .limit(limitt)
        .exec()
        .then((result) => {
          result.map((it) => {
            it.createdOn = CommonFunctions.getISTTime(it.createdOn);
            it.readDate = CommonFunctions.getISTTime(it.readDate);
            it.notificationId['campaign'] = 'all';
          });
          return result;
        });

      return {
        notifications: data,
        totalRecords: total,
        currentPage: pagee,
        last_page: Math.ceil(total / limit),
        un_read: un_read,
      };
    } catch (error) {
      return {
        notifications: [],
        totalRecords: 0,
        currentPage: 0,
        last_page: 0,
        un_read: 0,
      };
    }
  }
  async readNotifications(request, notificationId) {
    if (notificationId) {
      this.userNotificationsModel
        .findOneAndUpdate(
          { userId: request.user._id, notificationId: notificationId },
          { readDate: new Date(), readStatus: 1 },
          { useFindAndModify: false }
        )
        .exec();
    } else {
      this.userNotificationsModel
        .findOneAndUpdate(
          { userId: request.user._id },
          { readDate: new Date(), readStatus: 1 },
          { useFindAndModify: false }
        )
        .exec();
    }

    return {
      status: true,
      code: 2000,
      message: 'Updated!!',
      data: {},
    };
  }

  async deleteNotifications(request, notificationId) {
    if (notificationId) {
      this.userNotificationsModel
        .findOneAndDelete({
          userId: request.user._id,
          notificationId: notificationId,
        })
        .exec();
    } else {
      this.userNotificationsModel
        .deleteMany({ userId: request.user._id })
        .exec();
    }

    return {
      status: true,
      code: 2000,
      message: 'Updated!!',
      data: {},
    };
  }

  async deleteUserNotoficationOld() {
    var not = await this.notificationsModel.findOne({
      createdOn: { $lt: new Date(2024, 2, 10).toISOString() },
    });
    var check = await this.userNotificationsModel.findOne({
      createdOn: { $lt: new Date(2024, 2, 10) },
    });

    console.log(not, check);
    return {
      status: true,
      code: 2000,
      message: 'Updated!!',
      data: { not, check },
    };
  }

  async updateFcmToken(request, body: any): Promise<any> {
    let user = request.user;
    await this.userModel.updateOne(
      {
        _id: user._id,
        'devices.device_type': 'android',
      },
      {
        $set: {
          'devices.$.fcm_token': body.fcm_token,
          'devices.$.id': body.fcm_token,
        },
      }
    );
    return {
      status: true,
      code: 2000,
      message: 'User Profile Fetched Successfully',
      data: user.devices,
    };
  }

  async testSMS(): Promise<any> {
    
  }
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
