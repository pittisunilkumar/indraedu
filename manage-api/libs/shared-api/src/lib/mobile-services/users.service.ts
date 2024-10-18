import { UserBookmarkInterface, UserInterface  } from '@application/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as itUuid from 'uuid';
import { RegisterUserDto } from '../dto';
import { Question, User } from '../schema';

@Injectable()
export class MobileUsersService {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
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

    const user = this.userModel.findOne({ uuid }).exec().then(res => {

      res.devices?.forEach(dev => {
        if(dev?.id === deviceId) {
          dev.isLoggedIn = false;
        }
      });

      const deviceIsLoggedIn = (device) => device.isLoggedIn;

      if(!res.devices?.some(deviceIsLoggedIn)) {
        res.flags.isLoggedIn = false;
      }

      return res;

    })

    return this.userModel.findOneAndUpdate({ uuid }, user).exec();

  }

  async findByMobile(mobile): Promise<User> {

    return this.userModel.findOne({ mobile }).populate(
      {
        path: 'subscriptions',
        select: '_id uuid title courses videos tests qbanks createdOn modifiedOn',
        // deep population method
        populate: {
          path: 'courses videos tests qbanks',
          select: '_id uuid title categories',
          populate: {
            path: 'categories',
            select: '_id uuid title',
          }
        },
      }
    ).exec();

  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findStudentByUuid(uuid: string): Promise<User> {
    return this.userModel.findOne({ uuid })
      .populate(
        {
          path: 'subscriptions',
          select: '_id uuid title courses videos tests qbanks createdOn modifiedOn',
          // deep population method
          populate: {
            path: 'courses videos qbanks tests',
            select: '_id uuid title categories',
            populate: {
              path: 'categories',
              select: '_id uuid title',
            }
          },
        }
      )
      .exec();
  }

  async changePassword(
    uuid: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string; result: User }> {
    const hashOldPassword = await bcrypt.hash(oldPassword, 10);
    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.userModel.findOne({ uuid });

    if(user) {
      return bcrypt.compare(oldPassword, user.password).then((val) => {
        if(val) {
          return this.userModel.findOneAndUpdate(
            { uuid },
            { password: hashNewPassword })
          .exec().then(result => {
            return { message: 'Password reset success!!', result };
          })
        }else {
          throw new HttpException('Old Password Validation Failed. Please try again.', HttpStatus.UNAUTHORIZED);
        }
      });
    } else {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async assignSubscriptionsByUserUuid(
    uuid: string,
    request: any
  ) {
    return this.userModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async toggleBookMarksByUserUuid(
    uuid: string,
    request: UserBookmarkInterface
  ) {

    request.createdOn = new Date();
    request.uuid = itUuid.v4();

    const userBookMarks = await this.userModel.findOneAndUpdate(
      { uuid, type: 'STUDENT' },
      { $push: {
        bookmarks: {
          uuid: request.uuid,
          question: request.question,
          metadata: request.metadata,
          createdOn: request.createdOn,
        }
      }
    }).exec();

    return userBookMarks.bookmarks;

  }

  async removeBookMark(uuid: string, bookMarkUuid: string) {

    console.log({ uuid, bookMarkUuid });

    const userBookMarks = await this.userModel.findOneAndUpdate(
      { uuid },
      { $pull: {
        bookmarks: { uuid: bookMarkUuid }
      },
    })
    .exec();

    return userBookMarks.bookmarks;

  }

  async getAllBookMarksByUserUuid(uuid: string) {

    return this.userModel
      .findOne({ uuid })
      .populate({
        path: 'bookmarks.question',
        model: Question,
        select: '_id uuid title options description imgUrl tags previousAppearances'
      })
      .select({
        bookmarks: 1,
      })
      .exec()

  }

  async loginWithOtp(requests): Promise<any> {

    const users = await this.findByMobile(requests.mobile);
    const otp = this.generateOTP();
    const now = new Date();
    const expiration_time = this.AddMinutesToDate(now,10);

    if (!users) {
    // throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      const users = new this.userModel();
      users.mobile = requests.mobile;
      users.uuid = requests.uuid;
      users.otp = otp;
      users.expiration_time = expiration_time;
      // users.flags = { active:false, paid: false,isLoggedIn:false};
      users.save()
    }else{
      users.otp = otp;
      users.expiration_time = expiration_time;
      users.save()
    }
    var url = 'http://www.bulksmsapps.com/api/apismsv2.aspx?apikey=e10df577-740e-4f74-96ac-12193192c152&sender=PLATOS&number='+requests.mobile+'&message=Dear User, '+otp+' is One time password (OTP) for PLATO. Thank You.';
    await this.getScript(url)

    console.log(url)
    return {"status": true,"code" : 2000,'otp':otp}
  }


  async verifyOtp(requests){
    try {
      const users = await this.findByMobile(requests.mobile);
      // users
      const uuid = users.uuid;
      var now = new Date();
      if(users.otp == requests.otp){
        if(now <= users.expiration_time){
          users.otp = '';
          users.isLoggedIn = true;
          const devices = this.userModel.findOneAndUpdate(
              { uuid, type: 'STUDENT' },
              { $addToSet: {
                devices: {
                  id: requests.device_id ,isLoggedIn:true
                }
              }
            }).exec();
          //  return users.save();
            // const payload = { username: users.mobile, sub: users.uuid };
            // console.log(payload)
          return {"status": true,"code" : 2000, 'data' : users}
        }else{
          return {"status": false,"code" : 2001, 'message' : 'inputs'}
        }
      }else{
        return {"status": false,"code" : 2002, 'message' : 'invalid inputs'}
      }
    } catch (error) {
      return {"status": false,"code" : 5000, 'message' : 'Server error'}
    }
  }


  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
      for (let i = 0; i < 6; i++ ) {
          OTP += digits[Math.floor(Math.random() * 10)];
      }
    return OTP;
  }

  AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  }

  getScript = (url) => {
    return new Promise((resolve, reject) => {
      const http      = require('http'),
            https     = require('https');

      let client = http;

      if (url.toString().indexOf("https") === 0) {
          client = https;
      }

      client.get(url, (resp) => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
              data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
              resolve(data);
          });

      }).on("error", (err) => {
          reject(err);
      });
    });
  }
}
