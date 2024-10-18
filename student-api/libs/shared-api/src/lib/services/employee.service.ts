import { Coupon, CreateEmployeeDto, Employee, Subscription } from '@application/shared-api';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { EmployeeInterface } from '@application/api-interfaces';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private employeeModel: Model<Employee>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Coupon') private coupon: Model<Coupon>
  ) { }

  async addUser(createEmployeeDto: CreateEmployeeDto): Promise<Employee | Error> {
    const createdUser = new this.employeeModel(createEmployeeDto);
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

  // async registerUser(registerUserDto: RegisterUserDto): Promise<Employee | Error> {

  //   const createdUser = new this.employeeModel(registerUserDto);
  //   createdUser.password = await bcrypt.hash(createdUser.password, 10);
  //   const uniqueMobile = await this.findByMobile(createdUser.mobile).then(
  //     (res) => res
  //   );
  //   const uniqueEmail = await this.findByEmail(createdUser.email).then(
  //     (res) => res
  //   );

  //   if (!uniqueEmail && !uniqueMobile) {
  //     return createdUser.save();
  //   } else if (uniqueEmail) {
  //     throw new HttpException(
  //       'The input email is already taken, please enter a new one',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   } else if (uniqueMobile) {
  //     throw new HttpException(
  //       'The input mobile is already taken, please enter a new one',
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }

  // }

  async login(request: { mobile: number; password: string }): Promise<Employee> {

    const user = await this.findByMobile(request.mobile);

    if (!user) {
      throw new HttpException('Employee not found', HttpStatus.UNAUTHORIZED);
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

    const user = this.employeeModel.findOne({ uuid }).exec().then(res => {

      res.devices?.forEach(dev => {
        if (dev?.id === deviceId) {
          dev.isLoggedIn = false;
        }
      });

      const deviceIsLoggedIn = (device) => device.isLoggedIn;

      if (!res.devices?.some(deviceIsLoggedIn)) {
        res.flags.isLoggedIn = false;
      }

      return res;

    })

    return this.employeeModel.findOneAndUpdate({ uuid }, user).exec();

  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel
      .find()
      .exec();
  }

  async findByUuid(uuid: string) {
    return await this.employeeModel.findOne({ uuid }).exec();
  }

  async deleteByUuid(uuid: string) {
    return this.employeeModel.findOneAndDelete({ uuid }).exec();
  }

  async editByUuid(uuid: string, request: EmployeeInterface): Promise<Employee> {
    return this.employeeModel.findOneAndUpdate({ uuid }, request).exec();
  }

  async findByMobile(mobile): Promise<Employee> {
    return this.employeeModel.findOne({ mobile }).exec();
  }

  async findByEmail(email: string): Promise<Employee> {
    return this.employeeModel.findOne({ email }).exec();
  }




  // async viewSubscriptionsByUuid(uuid: string) {

  //   return this.employeeModel
  //     .aggregate([
  //       { $match : {"uuid":uuid}},
  //       // { $match : {_id: new ObjectId(id)}},
  //       { $unwind: '$subscriptions' },
  //       {
  //           $lookup: {
  //               from: 'subscriptions',
  //               let: {
  //                 subscription_id: "$subscriptions.subscription_id"
  //                 // subscription_id: "$subscriptions._id"
  //               },
  //               pipeline: [{
  //                   $match: {
  //                     $expr: { $eq: [ "$_id", "$$subscription_id" ] }
  //                   }
  //                 },
  //                 { $project: { _id: 1 ,
  //                               uuid:1,
  //                               title:1,
  //                               description:1,
  //                               order:1,
  //                               period:1,
  //                               createdOn:1,
  //                               flags:1,
  //                               actual:1,
  //                               discounted:1,
  //                               courses:1,
  //                               qbanks:1,
  //                               videos:1,
  //                               tests:1,
  //                             }
  //                           }
  //               ],
  //               as: 'subscription'
  //           }
  //       },
  //       { $unwind: '$subscription' },
  //       {
  //         $lookup:
  //         {
  //           from: "courses",
  //           let: {
  //             courses: "$subscription.courses"
  //           },
  //           pipeline: [{
  //               $match: {
  //                 $expr: { $eq: [ "$_id", "$$courses" ] }
  //               }
  //             },
  //             { $project: { _id: 1 ,title:1,uuid:1} }
  //           ],
  //           as: "subscriptions.course",
  //         }
  //       },

  //       {
  //         $unwind: { path: "$subscriptions.course", preserveNullAndEmptyArrays: true }
  //       },
  //       {
  //         $lookup: {
  //           "from": "qbanksubjects",
  //           "let": { "qbanks": "$subscription.qbanks" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$qbanks"] } } },
  //             { "$project": { "syllabus": 1 }},
  //             {
  //               $lookup: {
  //                 from: "syllabuses",
  //                 "let": { "syllabus": "$syllabus" },
  //                 pipeline: [
  //                   {
  //                     $match: {
  //                       $expr: { $eq: [ "$_id", "$$syllabus" ] }
  //                     }
  //                   },
  //                   { $project: {
  //                     "_id": 1 ,'title':1,'uuid':1
  //                   } }
  //                 ],
  //                 as: "syllabus"
  //               }
  //             }
  //           ],
  //           "as": "subscriptions.qbanks"
  //         }
  //       },
  //       {
  //         $unwind: { path: "$qbank", preserveNullAndEmptyArrays: true }
  //       },

  //       {
  //         $lookup: {
  //           "from": "videosubjects",
  //           "let": { "videos": "$subscription.videos" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$videos"] } } },
  //             { "$project": { "syllabus": 1 }},
  //             {
  //               $lookup: {
  //                 from: "syllabuses",
  //                 "let": { "syllabus": "$syllabus" },
  //                 pipeline: [
  //                   {
  //                     $match: {
  //                       $expr: { $eq: [ "$_id", "$$syllabus" ] }
  //                     }
  //                   },
  //                   { $project: {
  //                     "_id": 1 ,'title':1,'uuid':1
  //                   } }
  //                 ],
  //                 as: "syllabus"
  //               }
  //             }
  //           ],
  //           "as": "subscriptions.videos"
  //         }
  //       },
  //       {
  //         $unwind: { path: "$videos", preserveNullAndEmptyArrays: true }
  //       },

  //       {
  //         $lookup: {
  //           "from": "tscategories",
  //           "let": { "tests": "$subscription.tests" },
  //           "pipeline": [
  //             { "$match": { "$expr": { "$in": ["$_id", "$$tests"] } } },
  //             { "$project": { "categories.title": 1,"categories.uuid": 1 ,'categories.order':1}},
  //           ],
  //           "as": "subscriptions.tests"
  //         }
  //       },
  //       {
  //         $group: {

  //           _id: {
  //             _id: "$_id",
  //             uuid: "$uuid",
  //             name:"$name" ,
  //             email:"$email",
  //             mobile:"$mobile",
  //           },
  //           subscription : { $addToSet : {

  //                   "_id":"$subscriptions._id",
  //                   "subscription_id":"$subscriptions.subscription_id",
  //                   "uuid":"$subscriptions.uuid",
  //                   "expiry_date":"$subscriptions.expiry_date",
  //                   "active":"$subscriptions.active",
  //                   "createdOn":"$subscriptions.createdOn",
  //                   "title":"$subscription.title",
  //                   "description":"$subscription.description",
  //                   "order":"$subscription.order",
  //                   "period":"$subscription.period",
  //                   "actual":"$subscription.actual",
  //                   "discounted":"$subscription.discounted",
  //                   "flags":"$subscription.flags",
  //                   "course":"$subscriptions.course",
  //                   "qbanks":"$subscriptions.qbanks",
  //                   "videos":"$subscriptions.videos",
  //                   "tests":"$subscriptions.tests",
  //           }},
  //         }
  //       },
  //       {
  //         $project: {
  //           "_id": '$_id._id',
  //           "uuid": '$_id.uuid',
  //           "name": '$_id.name',
  //           "email": '$_id.email',
  //           "mobile": '$_id.mobile',
  //           "subscription" : "$subscription",
  //         }
  //       }
  //     ]).exec()

  //   // return await this.employeeModel.findOne({ uuid })
  //   //   .populate(
  //   //     {
  //   //       path: 'subscriptions',
  //   //       select: '_id uuid title courses videos tests qbanks createdOn order',
  //   //       // deep population method
  //   //       populate: {
  //   //         path: 'courses videos qbanks tests',
  //   //         select: {
  //   //           '_id ': 1,
  //   //           'uuid': 1,
  //   //           'title': 1,
  //   //           // 'syllabus': 1,
  //   //         },
  //   //         // populate: {
  //   //         //   path: 'syllabus',
  //   //         //   select: 'title',
  //   //         // }
  //   //       },
  //   //     }
  //   //   )
  //   //   .exec();
  // }



  async changePassword(
    uuid: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string; result: Employee }> {
    const hashOldPassword = await bcrypt.hash(oldPassword, 10);
    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.employeeModel.findOne({ uuid });

    if (user) {
      return bcrypt.compare(oldPassword, user.password).then((val) => {
        if (val) {
          return this.employeeModel.findOneAndUpdate(
            { uuid },
            { password: hashNewPassword })
            .exec().then(result => {
              return { message: 'Password reset success!!', result };
            })
        } else {
          throw new HttpException('Old Password Validation Failed. Please try again.', HttpStatus.UNAUTHORIZED);
        }
      });
    } else {
      throw new HttpException('Employee not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async resetPassword(
    uuid: string,
    newPassword: string
  ): Promise<{ message: string; result: Employee }> {
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.employeeModel.findOne({ uuid });
    if (user) {
      return this.employeeModel.findOneAndUpdate(
        { uuid },
        { password: hashNewPassword })
        .exec().then(result => {
          return { message: 'Password reset success!!', result };
        })
    } else {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
  }

  async addOrganizationByUserUuid(
    uuid: string,
    request: EmployeeInterface
  ): Promise<Employee> {
    return this.employeeModel
      .findOneAndUpdate({ uuid }, request)
      .exec();
  }

  // async assignSubscriptionsByUserUuid(
  //   uuid: string,
  //   request: EmployeeInterface
  // ) {
  //   return this.employeeModel.findOneAndUpdate({ uuid }, request).exec();
  // }

  // async deleteOrganizationByUserUuid(
  //   uuid: string,
  //   orgUuid: string
  // ): Promise<Employee> {
  //   return this.employeeModel
  //     .update({}, { $pull: { organizations: { uuid: orgUuid } } })
  //     .exec();
  // }



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
  // async fetchCouponsBysubscriptions(
  //   UserId: string[], subscription_id: string): Promise<any>  {

  //  let datee = new Date();
  //   let today=datee.getTime();

  //     const specificCoupons =  this.coupon.find({
  //       $or:[
  //           { users      : {$in:UserId}},
  //           { couponType : 'allUsers' },
  //         ],
  //       valiedFrom : { $lte: new Date( today) },
  //       valiedTo : { $gte: new Date( today) },
  //       subscription: subscription_id,
  //       availableCoupons: { $gt: 0 },
  //       agent:null,
  //       'flags.active':true,
  //     }).exec();

  //   return specificCoupons;
  // }

}
