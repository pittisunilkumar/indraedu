import { Injectable } from '@nestjs/common';
import { ModeOfPaymentEnum, PaymentStatusEnum, TagsInterface } from '@application/api-interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserTransactionsDTO } from '../dto/create-transactions.dto';
import { UserTransactions } from '../schema/user-transactions.schema';
import { Coupon } from '../schema/coupon.schema';
import { Subscription, User } from '../schema';
import { CommonFunctions } from '../helpers/functions';

@Injectable()
export class UserTransactionsService {

  constructor(
    @InjectModel('UserTransactions') private userTransactionsModel: Model<UserTransactions>,
    @InjectModel('Coupon') private couponsModel: Model<Coupon>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>
  ) { }


  async create(createUserTransactionsDTO: CreateUserTransactionsDTO): Promise<UserTransactions> {

    const createdTransaction = new this.userTransactionsModel(createUserTransactionsDTO);
    //console.log('createdTransaction',createdTransaction);
    //let transactionId;
    let random = Math.floor(Math.random() * 10000000);

    let dateOfPayment = createdTransaction.dateOfPayment;
    let month = dateOfPayment.getMonth() + 1;
    let dt = dateOfPayment.getDate();
    let dt1: any;
    let month1: any;
    let currentYear = new Date().getFullYear();
    let year = currentYear.toString().split('');
    currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

    if (dt < 10) {
      dt1 = '0' + dt;
    } else { dt1 = dt }
    if (month < 10) {
      month1 = '0' + month;

    } else { month1 = month; }

    createdTransaction.transactionId = 'TXN' + random + 'D' + currentYear + month1 + dt1;
    const result = createdTransaction.save();
    if ((await result).paymentStatus == "SUCCESS") {

      if ((await result).couponId != null) {
        let couponId = (await result).couponId;


        let couponData = await this.couponsModel.findOne({ _id: couponId });
        let agentAmount = couponData.agentAmount;
        let appliedUsersCount = couponData.appliedUsersCount + 1
        let agentTotalAmount = agentAmount * appliedUsersCount
        let agentDueAmount = couponData.agentDueAmount + agentAmount

        this.couponsModel.findOneAndUpdate(
          { _id: couponId },
          {
            agentTotalAmount: agentTotalAmount,
            agentDueAmount: agentDueAmount,
            $inc: {
              'availableCoupons': -1,
              'appliedUsersCount': 1,
            }
          },
        ).exec();
      }
      let expiry = new Date((await result).expiryDate);
      var subscriptionDate = expiry.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      let subscriptionData = await this.subscriptionModel.findOne({ _id: (await result).subscriptionId });
      let UserData = await this.userModel.findOne({ _id: (await result).userId });
      console.log('added transaction', result);

    }

    return result;
  }

  async getUserTransactions(employee): Promise<UserTransactions[]> {

    // return this.userTransactionsModel.find()
    //   .populate({
    //     path: "userId",
    //     model: "User",
    //     select: {
    //       "name": 1,
    //       "mobile": 1

    //     }
    //   })
    //   .populate({
    //     path: "subscriptionId",
    //     model: "Subscription",
    //     select: {
    //       "title": 1,
    //     }
    //   })
    //   .populate({
    //     path: "couponId",
    //     model: "Coupon",
    //     select: {
    //       "code": 1,
    //       "discountType": 1,
    //       "discount": 1

    //     }
    //   })
    //   .sort({ dateOfPayment: 'DESC' })
    //   .exec();
    return this.userTransactionsModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscriptionId"
        }
      },
      {
        $lookup: {
          from: "coupons",
          localField: "couponId",
          foreignField: "_id",
          as: "couponId"
        }
      },
      {
        $project: {
          "_id": 1,
          "actualPrice": 1,
          "discountPrice": 1,
          "finalPaidAmount": 1,
          "subscriptionId.title": 1,
          "courses.title":1,
          "billNumber": 1,
          "chequeNumber": 1,
          "chequeDate": 1,
          "bankName": 1,
          "referenceNumber": 1,
          "creditORdebitCard": 1,
          "CardType": 1,
          "upiId": 1,
          "mode_transactionNumber": 1,
          "couponId.code": 1,
          "couponId.discountType": 1,
          "couponId.discount": 1,
          "transactionId": 1,
          "uuid": 1,
          "userId.name": 1,
          "userId.mobile": 1,
          "dateOfPayment": 1,
          "expiryDate": 1,
          "createdBy": 1,
          "paymentType": 1,
          "modeOfPayment": 1,
          "paymentStatus": 1,
          "razorpayOrderId": 1,
        }
      },
      {
        $sort: { dateOfPayment: -1 }
      }
    ]).exec();

  }

  async findByUuid(uuid: string): Promise<UserTransactions> {
    return this.userTransactionsModel
      .findOne({ uuid })
      .populate({
        path: "userId",
        model: "User",
        select: {
          "name": 1,
          "mobile": 1
        }
      })
      .populate({
        path: "subscriptionId",
        model: "Subscription",
        select: {
          "title": 1,
        }
      })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1
        }
      })
      .exec()
  }

  async assignedSubscriptions(id: any) {
    return this.userTransactionsModel.find({ subscriptionId: id })
      .populate({
        path: "userId",
        model: "User",
        select: {
          "name": 1,
          "mobile": 1
        }
      })
      .populate({
        path: "subscriptionId",
        model: "Subscription",
        select: {
          "title": 1,
        }
      })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1
        }
      })
      .exec()
  }

  async getTransactionsDateFilter(transactionsInterface, employee) {

    let fromDate = new Date(transactionsInterface.fromDate).getTime() + (5.5 * 60 * 60 * 1000);
    let toDate = new Date(transactionsInterface.toDate);
    let newFromDate = new Date(fromDate).setUTCHours(0, 0, 0, 0);
    let newToDate = new Date(toDate).setUTCHours(23, 59, 59, 999);
    // console.log('fromDate', new Date(newFromDate));
    // console.log('toDate', new Date(newToDate));
    return this.userTransactionsModel.aggregate([
      {
        $match: {
          dateOfPayment: {
            $gte: new Date(newFromDate),
            $lte: new Date(newToDate)
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscriptionId"
        }
      },
      {
        $lookup: {
          from: "coupons",
          localField: "couponId",
          foreignField: "_id",
          as: "couponId"
        }
      },
      {
        $project: {
          "_id": 1,
          "actualPrice": 1,
          "discountPrice": 1,
          "finalPaidAmount": 1,
          "subscriptionId.title": 1,
          "courses.title":1,
          "billNumber": 1,
          "chequeNumber": 1,
          "chequeDate": 1,
          "bankName": 1,
          "referenceNumber": 1,
          "creditORdebitCard": 1,
          "CardType": 1,
          "upiId": 1,
          "mode_transactionNumber": 1,
          "couponId.code": 1,
          "couponId.discountType": 1,
          "couponId.discount": 1,
          "transactionId": 1,
          "uuid": 1,
          "userId.name": 1,
          "userId.mobile": 1,
          "dateOfPayment": 1,
          "expiryDate": 1,
          "createdBy": 1,
          "paymentType": 1,
          "modeOfPayment": 1,
          "paymentStatus": 1,
          "razorpayOrderId": 1,
        }
      },
      {
        $sort: { dateOfPayment: -1 }
      }
    ]).exec();

    // return this.userTransactionsModel.find({
    //   dateOfPayment: {
    //     $gte: new Date(newFromDate),
    //     $lte: new Date(newToDate)
    //   }
    // })
    //   .populate({
    //     path: "userId",
    //     model: "User",
    //     select: {
    //       "name": 1,
    //       "mobile": 1,
    //       "organizations":1
    //     },
    //     match: { organizations: { $in: employee.organizations } },
    //   })
    //   .populate({
    //     path: "subscriptionId",
    //     model: "Subscription",
    //     select: {
    //       "title": 1,
    //     }
    //   })
    //   .populate({
    //     path: "couponId",
    //     model: "Coupon",
    //     select: {
    //       "code": 1,
    //       "discountType": 1,
    //       "discount": 1
    //     }
    //   })
    //   .sort({ dateOfPayment: 'DESC' })
    //   .exec();

  }

  async getMasterAdviceTransactions() {
    return this.userTransactionsModel.find({ modeOfPayment: ModeOfPaymentEnum.MasterAdvise ,paymentStatus:PaymentStatusEnum.SUCCESS})
      .populate({
        path: "userId",
        model: "User",
        select: {
          "name": 1,
          "mobile": 1
        }
      })
      .populate({
        path: "subscriptionId",
        model: "Subscription",
        select: {
          "title": 1,
        }
      })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1
        }
      })
      .sort({ dateOfPayment: 'DESC' })
      .exec();

  }

  async getmasterAdviceDateFilter(transactionsInterface) {
    let fromDate = new Date(transactionsInterface.fromDate).getTime() + (5.5 * 60 * 60 * 1000);
    let toDate = new Date(transactionsInterface.toDate);
    let newFromDate = new Date(fromDate).setUTCHours(0, 0, 0, 0);
    let newToDate = new Date(toDate).setUTCHours(23, 59, 59, 999);
    console.log('fromDate', new Date(newFromDate));
    console.log('toDate', new Date(newToDate));
    return this.userTransactionsModel.find({
      dateOfPayment: {
        $gte: new Date(newFromDate),
        $lte: new Date(newToDate)
      },
      modeOfPayment: ModeOfPaymentEnum.MasterAdvise ,
      paymentStatus:PaymentStatusEnum.SUCCESS
    })
      .populate({
        path: "userId",
        model: "User",
        select: {
          "name": 1,
          "mobile": 1
        }
      })
      .populate({
        path: "subscriptionId",
        model: "Subscription",
        select: {
          "title": 1,
        }
      })
      .populate({
        path: "couponId",
        model: "Coupon",
        select: {
          "code": 1,
          "discountType": 1,
          "discount": 1
        }
      })
      .sort({ dateOfPayment: 'DESC' })
      .exec();

  }

  // getMonth(month) {
  //   month = month - 1;
  //   if (this.months[month] != null) {
  //     return this.months[month];
  //   } else {
  //     throw new Error('Invalid Month No');
  //   }
  // }

  async yearlyPayments(res, employee) {
    // let data = await this.userTransactionsModel.aggregate([
    //   { $match: { paymentStatus: "SUCCESS", } },
    //   {
    //     '$group': {
    //       _id: {
    //         //  month:{'$dateToString': { date: "$dateOfPayment", format: "%Y-%m" }},
    //         //  yearMonthDate: { $dateToString: { format: "%Y-%m", date: "$dateOfPayment" } }
    //         yearMonthDate: { $dateToString: { format: "%Y-%m", date: "$dateOfPayment" } }
    //       },
    //       count: { '$sum': 1 },
    //       total: { '$sum': '$finalPaidAmount' },
    //     }
    //   },
    //   { '$sort': { _id: -1 } },
    //   { "$limit": res.months },
    // ])
    let data =  await this.userTransactionsModel.aggregate([

      { $match: { paymentStatus: "SUCCESS", } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: {
            //  month:{'$dateToString': { date: "$dateOfPayment", format: "%Y-%m" }},
            //  yearMonthDate: { $dateToString: { format: "%Y-%m", date: "$dateOfPayment" } }
            yearMonthDate: { $dateToString: { format: "%Y-%m", date: "$dateOfPayment" } }
          },
          count: { '$sum': 1 },
          total: { '$sum': '$finalPaidAmount' },
        }
      },
      { '$sort': { _id: -1 } },
      { "$limit": res.months },
    ]).exec();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var yearData = [];
    var dataa = data.reverse();
    dataa.forEach(element => {
      var d = new Date(element._id.yearMonthDate)
      var date = monthNames[d.getMonth()];
      var year = date + '(' + d.getFullYear() + ")";
      yearData.push([year, element.total])

    });
    return yearData;


  }

  async weeklyPayments(employee) {
    // let data = await this.userTransactionsModel.aggregate([
    //   { $match: { paymentStatus: "SUCCESS", } },
    //   {
    //     '$group': {
    //       _id: {
    //         yearMonthDate: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfPayment" } }
    //       },
    //       count: { '$sum': 1 },
    //       total: { '$sum': '$finalPaidAmount' },
    //     }
    //   },
    //   { '$sort': { _id: -1 } },
    //   { "$limit": 7 },
    // ])

    let data =  await this.userTransactionsModel.aggregate([

      { $match: { paymentStatus: "SUCCESS", } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: {
            //  month:{'$dateToString': { date: "$dateOfPayment", format: "%Y-%m" }},
            //  yearMonthDate: { $dateToString: { format: "%Y-%m", date: "$dateOfPayment" } }
            yearMonthDate: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfPayment" } }
          },
          count: { '$sum': 1 },
          total: { '$sum': '$finalPaidAmount' },
        }
      },
      { '$sort': { _id: -1 } },
      { "$limit": 7 },
    ]).exec();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var yearData = [];
    var dataa = data.reverse();
    dataa.forEach(element => {
      var d = new Date(element._id.yearMonthDate)
      var day = days[d.getDay()];
      yearData.push([day, element.total])

    });
    return yearData;


  }

  async paymentReports(employee) {
    // var currentDate = new Date().getTime() + (5.5 * 60 * 60 * 1000);
    var date = new Date();

    let newFromDate = new Date().setUTCHours(0, 0, 0, 0);
    let newToDate = new Date().setUTCHours(23, 59, 59, 999);
    let today =  await this.userTransactionsModel.aggregate([

      {
        $match: {
          paymentStatus: "SUCCESS", dateOfPayment: {
            $gte: new Date(newFromDate), $lte: new Date(newToDate)
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: null,
          total: { '$sum': '$finalPaidAmount' },
        }
      }
    ]).exec();

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime() + (5.5 * 60 * 60 * 1000);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() + (5.5 * 60 * 60 * 1000);
    let monthFromDate = new Date(firstDay).setUTCHours(0, 0, 0, 0);
    let monthToDate = new Date(lastDay).setUTCHours(23, 59, 59, 999);

    let this_month =  await this.userTransactionsModel.aggregate([

      {
        $match: {
          paymentStatus: "SUCCESS", dateOfPayment: {
            $gte: new Date(monthFromDate), $lte: new Date(monthToDate)
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: null,
          total: { '$sum': '$finalPaidAmount' },
        }
      }
    ]).exec();

    var yearstart = new Date(date.getFullYear(), 0, 1).getTime() + (5.5 * 60 * 60 * 1000);
    var yearlast = new Date(date.getFullYear(), 11, 31).getTime() + (5.5 * 60 * 60 * 1000);
    let yearFromDate = new Date(yearstart).setUTCHours(0, 0, 0, 0);
    let yearToDate = new Date(yearlast).setUTCHours(23, 59, 59, 999);
   
    let this_year =  await this.userTransactionsModel.aggregate([
      {
        $match: {
          paymentStatus: "SUCCESS", dateOfPayment: {
            $gte: new Date(yearFromDate), $lte: new Date(yearToDate)
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: null,
          total: { '$sum': '$finalPaidAmount' },
        }
      }
    ]).exec();

    var firstweek = new Date(date.setDate(date.getDate() - date.getDay())).getTime() + (5.5 * 60 * 60 * 1000);
    var lastweek = new Date(date.setDate(date.getDate() - date.getDay() + 6)).getTime() + (5.5 * 60 * 60 * 1000);
    let weekFromDate = new Date(firstweek).setUTCHours(0, 0, 0, 0);
    let weekToDate = new Date(lastweek).setUTCHours(23, 59, 59, 999);
  
    let this_week =  await this.userTransactionsModel.aggregate([
      {
        $match: {
          paymentStatus: "SUCCESS", dateOfPayment: {
            $gte: new Date(weekFromDate), $lte: new Date(weekToDate)
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $unwind: "$userId"
      },
      {
        $lookup: {
          from: "courses",
          localField: "userId.courses",
          foreignField: "_id",
          as: "courses"
        }
      },
      {
        $unwind: "$courses"
      },
      {
        $match: { // Filter users based on organizations
          "courses.organizations": { $in: employee.organizations }
        }
      },
      {
        '$group': {
          _id: null,
          total: { '$sum': '$finalPaidAmount' },
        }
      }
    ]).exec();

    return { 'today': today[0]?.total, 'this_week': this_week[0]?.total, 'this_month': this_month[0]?.total, 'this_year': this_year[0]?.total };
  }


}