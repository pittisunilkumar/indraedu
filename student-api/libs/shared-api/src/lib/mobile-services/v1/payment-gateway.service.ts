import { environment } from 'apps/student-api/src/environments/environment';
import { Injectable } from '@nestjs/common';
import {
  ModeOfPaymentEnum,
  PaymentStatusEnum,
} from '@application/api-interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrder } from '../../dto/create-order.dto';
import { UserTransactions } from '../../schema/user-transactions.schema';
import { Coupon } from '../../schema/coupon.schema';
import { Subscription } from '../../schema/subscription.schema';
import { User } from '../../schema/user.schema';
import * as uuid from 'uuid';
import { CommonFunctions } from '../../helpers/functions';
import { PaymentHookResponse } from '../../schema';
import axios from 'axios';
@Injectable()
export class PaymentGatewayServiceV1 {
  constructor(
    @InjectModel('UserTransactions')
    private userTransactionsModel: Model<UserTransactions>,
    @InjectModel('Coupon') private couponsModel: Model<Coupon>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('PaymentHookResponse')
    private paymentHookResponse: Model<PaymentHookResponse>
  ) {}

  async generateReferenceId(request, CreateOrder: CreateOrder): Promise<any> {
    try {
      const checkPayment = await this.userTransactionsModel
        .findOne({
          subscriptionId: CreateOrder.subscriptionId,
          userId: request.user._id,
          finalPaidAmount: CreateOrder.finalPaidAmount,
          paymentStatus: PaymentStatusEnum.PENDING,
        })
        .exec();

      var subscriptionId = CreateOrder.subscriptionId;
      const subscription = await this.subscriptionModel
        .findOne({
          _id: subscriptionId,
        })
        .exec();
      var razorpayOrderId = '';
      var paymentStatus = '';
      var orderDetails = {};
      let random = Math.floor(Math.random() * 10000000);

      let dateOfPayment = new Date();
      let month = dateOfPayment.getMonth() + 1;
      let dt = dateOfPayment.getDate();
      let dt1: any;
      let month1: any;
      let currentYear = new Date().getFullYear();
      // let year = currentYear.toString().split('');
      // currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

      if (dt < 10) {
        dt1 = '0' + dt;
      } else {
        dt1 = dt;
      }
      if (month < 10) {
        month1 = '0' + month;
      } else {
        month1 = month;
      }

      let transactionID = 'TXN' + random + 'D' + currentYear + month1 + dt1;

      if (checkPayment) {
        //generating transation everytime
        // transactionID = checkPayment.transactionId;
        orderDetails = checkPayment;
        checkPayment.transactionId = transactionID
        checkPayment.save();

      } else {
        const createdTransaction = new this.userTransactionsModel(CreateOrder);
        (createdTransaction.billNumber = ''),
          (createdTransaction.chequeNumber = '');
        (createdTransaction.chequeDate = null),
          (createdTransaction.bankName = ''),
          (createdTransaction.referenceNumber = ''),
          (createdTransaction.creditORdebitCard = '');
        createdTransaction.CardType = '';
        createdTransaction.upiId = '';
        createdTransaction.mode_transactionNumber = '';
        if (CreateOrder.couponId) {
          createdTransaction.couponId = CreateOrder.couponId;
        } else {
          createdTransaction.couponId = null;
        }

        createdTransaction.transactionId = transactionID;

        let random2 = Math.floor(Math.random() * 10000000);
        createdTransaction.referenceNumber =
          'REF' + random2 + 'D' + currentYear + month1 + dt1;
        createdTransaction.uuid = uuid.v4();

        createdTransaction.userId = request.user._id;
        createdTransaction.dateOfPayment = new Date();
        var date = new Date();
        var expiryDate = null;
        if (subscription.type == 'DAYS') {
          expiryDate = date.setMonth(date.getDay() + subscription.period);
        } else {
          expiryDate = date.setMonth(date.getMonth() + subscription.period);
        }
        createdTransaction.expiryDate = new Date(expiryDate);
        createdTransaction.createdBy = {
          _id: request.user._id,
          uuid: request.user.uuid,
          name: request.user.name,
        };
        createdTransaction.paymentType = 'ONLINE';

        createdTransaction.modeOfPayment = ModeOfPaymentEnum.PHONEPE;
        createdTransaction.paymentStatus = PaymentStatusEnum.PENDING;
        orderDetails = await createdTransaction.save();
      }

      const payload = {
        merchantId: process.env.phonePeMerId,
        merchantUserId: 'MUID' + request.user._id,
        merchantTransactionId: transactionID,
        amount: Number(CreateOrder.finalPaidAmount) * 100,

        callbackUrl: process.env.APIURL +
          'paymentgateway/v1/update-payment-status/' +
          transactionID,
        mobileNumber: request.user.mobile,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
        'base64'
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');

      const base64Hash = base64Payload + '/pg/v1/pay' + process.env.phonePeSalt;
      const hash = crypto.createHash('sha256').update(base64Hash).digest('hex');

      const checksum = hash + '###' + process.env.phonePeKeyIndex;

      const xverifyData =
        '/pg/v1/status/' +
        process.env.phonePeMerId +
        '/' +
        transactionID +
        process.env.phonePeSalt;
      const Xverify = crypto
        .createHash('sha256')
        .update(xverifyData)
        .digest('hex');

      let phonepeData = {
        checksum: checksum,
        base64Code: base64Payload,
        payload: payload,
        merchantTransactionId: transactionID,
        Xverify: Xverify + '###' + process.env.phonePeKeyIndex,
      };

      // const instance = await axios
      //         .post(process.env.PhonePeURL+'/pg/v1/pay', {
      //           'request': base64Payload
      //         }, {
      //           headers: {
      //             'Content-Type': 'application/json',
      //             'X-VERIFY': checksum,
      //             'accept': 'application/json'
      //           }
      //         })
      //         .then(function (response) {
      //           // console.log(response.data);
      //           return response.data;
      //         })
      //         .catch(function (error) {
      //           console.error(error);
      //         });
      //         console.log(instance)

      return {
        status: true,
        code: 2000,
        message: 'Order Created Successfully',
        data: { razorpayOrderId, paymentStatus, orderDetails, phonepeData },
        // data: {  },
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async updatePhonepePaymentStatus(
    request,
    phonepeInstance,
    body
  ): Promise<any> {
    var orderId = body.razorpayOrderId;
    var paymentId = phonepeInstance.data.merchantTransactionId;
    var signature = body.razorpaySignature;
    try {
      const orderDetails = await this.userTransactionsModel
        .findOne({
          transactionId: phonepeInstance.data.merchantTransactionId,
          // userId: request.user._id,
        })
        .populate({
          path: 'subscriptionId',
          model: Subscription,
          select: '_id uuid title description period type',
        })
        .populate({
          path: 'couponId',
          model: Coupon,
          select: '_id uuid code',
        })
        .exec();
      orderDetails.paymentStatus = PaymentStatusEnum.PENDING;

      if (
        phonepeInstance.code == 'PAYMENT_SUCCESS' &&
        phonepeInstance.data.merchantId
      ) {
        var date = new Date();
        var expiryDate = null;
        if (orderDetails.subscriptionId['type'] == 'DAYS') {
          expiryDate = date.setMonth(
            date.getDay() + orderDetails.subscriptionId['period']
          );
        } else {
          expiryDate = date.setMonth(
            date.getMonth() + orderDetails.subscriptionId['period']
          );
        }
        orderDetails.expiryDate = new Date(expiryDate);
        orderDetails.paymentDate = new Date();
        orderDetails.paymentStatus = PaymentStatusEnum.SUCCESS;
        orderDetails.paymentInfo = phonepeInstance;
        orderDetails.authorised_status = phonepeInstance.code;
        orderDetails.referenceNumber = phonepeInstance.data.transactionId;
        orderDetails.razorPayPaymentId = paymentId;
        orderDetails.razoraySignature = signature;
        orderDetails.paymentMessage = 'Payment Verified Successfully';
        orderDetails.save();

        let couponData = await this.couponsModel.findOne({
          _id: orderDetails.couponId,
        });

        if (couponData) {
          if (couponData.couponType == 'agent') {
            let agentAmount = Number(couponData.agentAmount);
            let appliedUsersCount = couponData.appliedUsersCount + 1;
            let agentTotalAmount = Number(agentAmount) * appliedUsersCount;
            let agentDueAmount =
              Number(couponData.agentDueAmount) + agentAmount;
            await this.couponsModel
              .findOneAndUpdate(
                { _id: orderDetails.couponId },
                {
                  agentTotalAmount: agentTotalAmount,
                  agentDueAmount: agentDueAmount,
                  $inc: {
                    availableCoupons: -1,
                    appliedUsersCount: 1,
                  },
                }
              )
              .exec();
          } else {
            await this.couponsModel
              .findOneAndUpdate(
                { _id: orderDetails.couponId },
                {
                  $inc: {
                    availableCoupons: -1,
                    appliedUsersCount: 1,
                  },
                }
              )
              .exec();
          }
        }
        var subscriptions = [];
        var qbanks = [];
        var videos = [];
        var tests = [];
        let today = new Date();
        let expiry = new Date(expiryDate);
        let expiryDateee;

        let UserData = await this.userModel.findOne({ _id: orderDetails.userId });

        // let UserData    = userDetails
        let subscriptionData = await this.subscriptionModel.findOne({
          _id: orderDetails.subscriptionId,
        });

        UserData.subscriptions = UserData.subscriptions.filter((sub) => {
          return (
            sub.subscription_id.toHexString() !=
            subscriptionData._id.toHexString()
          );
        });
        let subscription = {
          subscription_id: subscriptionData._id,
          expiry_date: expiry,
          createdOn: today,
        };
        // subscriptions.push(subscription);
        UserData.subscriptions.push(subscription);
        subscriptionData.qbanks.map((res) => {
          if (res) {
            UserData.qbanks = UserData?.qbanks.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.subject_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // qbanks.push({ 'subject_id': res, 'expiry_date': expiryDateee });
            UserData.qbanks.push({
              subject_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // // userDetails.qbanks = qbanks;

        subscriptionData.videos.map((res) => {
          if (res) {
            UserData.videos = UserData?.videos.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.subject_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // videos.push({ 'subject_id': res, 'expiry_date': expiryDateee });
            UserData.videos.push({
              subject_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // userDetails.videos = videos;

        subscriptionData.tests.map((res) => {
          if (res) {
            UserData.tests = UserData?.tests.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.category_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // tests.push({ 'category_id': res, 'expiry_date': expiryDateee });
            UserData.tests.push({
              category_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // userDetails.tests = tests;
        let update = await UserData.save();
        // await this.userModel.findOneAndUpdate({ _id: request.user._id },{UserData});
        // console.log(subscriptionData)
        var subscriptionDate = expiry.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        
        return {
          status: true,
          code: 2000,
          message: 'Payment Verified Successfully',
          data: orderDetails,
        };
      } else {
        orderDetails.paymentStatus = PaymentStatusEnum.FAILED;
        orderDetails.paymentInfo = phonepeInstance;
        orderDetails.authorised_status = phonepeInstance.code;
        orderDetails.razorPayPaymentId = paymentId;
        orderDetails.razoraySignature = signature;
        orderDetails.paymentMessage = 'Payment Failed';
        orderDetails.save();
        return {
          status: true,
          code: 2001,
          message: 'Payment Verification Failed Successfully',
          data: orderDetails,
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async assignSubscriptionToUser(users, subscriptionData) {
    var date = new Date();
    var expiryDate = null;
    if (subscriptionData.type == 'DAYS') {
      expiryDate = date.setMonth(date.getDay() + subscriptionData.period);
    } else {
      expiryDate = date.setMonth(date.getMonth() + subscriptionData.period);
    }

    let today = new Date();
    let expiry = new Date(expiryDate);
    let expiryDateee;
    let UserData = await this.userModel.findOne({
      _id: users._id,
    });
    // let UserData    = userDetails

    UserData.subscriptions = UserData.subscriptions.filter((sub) => {
      return (
        sub.subscription_id.toHexString() != subscriptionData._id.toHexString()
      );
    });
    let subscription = {
      subscription_id: subscriptionData._id,
      expiry_date: expiry,
      createdOn: today,
    };
    UserData.subscriptions.push(subscription);
    subscriptionData.qbanks.map((res) => {
      UserData.qbanks = UserData?.qbanks.filter((e) => {
        expiryDateee = e.expiry_date;
        return e.subject_id != res.toString();
      });
      if (expiryDateee > expiry.toISOString().toString()) {
        expiryDateee = expiryDateee;
      } else {
        expiryDateee = expiry;
      }
      UserData.qbanks.push({
        subject_id: res,
        expiry_date: expiryDateee,
      });
    });

    subscriptionData.videos.map((res) => {
      UserData.videos = UserData?.videos.filter((e) => {
        expiryDateee = e.expiry_date;
        return e.subject_id != res.toString();
      });
      if (expiryDateee > expiry.toISOString().toString()) {
        expiryDateee = expiryDateee;
      } else {
        expiryDateee = expiry;
      }
      UserData.videos.push({
        subject_id: res,
        expiry_date: expiryDateee,
      });
    });

    subscriptionData.tests.map((res) => {
      UserData.tests = UserData?.tests.filter((e) => {
        expiryDateee = e.expiry_date;
        return e.category_id != res.toString();
      });
      if (expiryDateee > expiry.toISOString().toString()) {
        expiryDateee = expiryDateee;
      } else {
        expiryDateee = expiry;
      }
      UserData.tests.push({
        category_id: res,
        expiry_date: expiryDateee,
      });
    });
    await UserData.save();
  }

  async getPhonepayPaymentStatus(request, transaction_id): Promise<any> {

    try {
      const orderDetails = await this.userTransactionsModel
        .findOne({
          transactionId: transaction_id,
        })
        .populate({
          path: 'subscriptionId',
          model: Subscription,
          select: '_id uuid title description period type',
        })
        .populate({
          path: 'couponId',
          model: Coupon,
          select: '_id uuid code',
        })
        .exec();
      orderDetails.paymentStatus = PaymentStatusEnum.PENDING;

      const crypto = require('crypto');
      const data =
        '/pg/v1/status/' +
        process.env.phonePeMerId +
        '/' +
        transaction_id +
        process.env.phonePeSalt;
      const hash = crypto.createHash('sha256').update(data).digest('hex');

      const surl =
        process.env.PhonePeURL +
        '/pg/v1/status/' +
        process.env.phonePeMerId +
        '/' +
        transaction_id;
      const instance = await axios
        .get(surl, {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': hash + '###1',
            'X-MERCHANT-ID': process.env.phonePeMerId,
            accept: 'application/json',
          },
        })
        .then(function (response) {
          // console.log(response);
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
        });

      var message = '';
      var paymentInfo = '';
      var paymentStatus = false;
      // console.log(instance)
      if (instance.code == 'PAYMENT_SUCCESS' && instance.data.merchantId) {

        paymentInfo = instance;
        paymentStatus = true;
        var date = new Date();
        var expiryDate = null;
        if (orderDetails.subscriptionId['type'] == 'DAYS') {
          expiryDate = date.setMonth(
            date.getDay() + orderDetails.subscriptionId['period']
          );
        } else {
          expiryDate = date.setMonth(
            date.getMonth() + orderDetails.subscriptionId['period']
          );
        }
        orderDetails.expiryDate = new Date(expiryDate);
        orderDetails.paymentDate = new Date();
        orderDetails.paymentStatus = PaymentStatusEnum.SUCCESS;
        orderDetails.paymentInfo = paymentInfo;
        orderDetails.authorised_status = instance.code;
        // orderDetails.razorPayPaymentId = payment.id;
        orderDetails.paymentMessage = 'Payment Verified Successfully';
        orderDetails.save();

        let couponData = await this.couponsModel.findOne({
          _id: orderDetails.couponId,
        });

        if (couponData) {
          if (couponData.couponType == 'agent') {
            let agentAmount = Number(couponData.agentAmount);
            let appliedUsersCount = couponData.appliedUsersCount + 1;
            let agentTotalAmount = Number(agentAmount) * appliedUsersCount;
            let agentDueAmount =
              Number(couponData.agentDueAmount) + agentAmount;
            await this.couponsModel
              .findOneAndUpdate(
                { _id: orderDetails.couponId },
                {
                  agentTotalAmount: agentTotalAmount,
                  agentDueAmount: agentDueAmount,
                  $inc: {
                    availableCoupons: -1,
                    appliedUsersCount: 1,
                  },
                }
              )
              .exec();
          } else {
            await this.couponsModel
              .findOneAndUpdate(
                { _id: orderDetails.couponId },
                {
                  $inc: {
                    availableCoupons: -1,
                    appliedUsersCount: 1,
                  },
                }
              )
              .exec();
          }
        }
        var subscriptions = [];
        var qbanks = [];
        var videos = [];
        var tests = [];
        let today = new Date();
        let expiry = new Date(expiryDate);
        let expiryDateee;
        let UserData = await this.userModel.findOne({
          _id: orderDetails.userId,
        });
        // let UserData    = userDetails
        let subscriptionData = await this.subscriptionModel.findOne({
          _id: orderDetails.subscriptionId,
        });

        UserData.subscriptions = UserData.subscriptions.filter((sub) => {
          return (
            sub.subscription_id.toHexString() !=
            subscriptionData._id.toHexString()
          );
        });
        let subscription = {
          subscription_id: subscriptionData._id,
          expiry_date: expiry,
          createdOn: today,
        };
        // subscriptions.push(subscription);
        UserData.subscriptions.push(subscription);
        subscriptionData.qbanks.map((res) => {
          if (res) {
            UserData.qbanks = UserData?.qbanks.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.subject_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // qbanks.push({ 'subject_id': res, 'expiry_date': expiryDateee });
            UserData.qbanks.push({
              subject_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // // userDetails.qbanks = qbanks;

        subscriptionData.videos.map((res) => {
          if (res) {
            UserData.videos = UserData?.videos.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.subject_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // videos.push({ 'subject_id': res, 'expiry_date': expiryDateee });
            UserData.videos.push({
              subject_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // userDetails.videos = videos;

        subscriptionData.tests.map((res) => {
          if (res) {
            UserData.tests = UserData?.tests.filter((e) => {
              expiryDateee = e.expiry_date;
              return e.category_id != res.toString();
            });
            if (expiryDateee > expiry.toISOString().toString()) {
              expiryDateee = expiryDateee;
            } else {
              expiryDateee = expiry;
            }
            // tests.push({ 'category_id': res, 'expiry_date': expiryDateee });
            UserData.tests.push({
              category_id: res,
              expiry_date: expiryDateee,
            });
          }
        });
        // userDetails.tests = tests;
        let update = await UserData.save();
        return {
          status: true,
          code: 2001,
          message: 'Payment Verification Failed',
          data: orderDetails,
        };
      } else {
        orderDetails.paymentStatus = PaymentStatusEnum.FAILED;
        orderDetails.paymentMessage = 'Payment Failed';
        orderDetails.save();
        return {
          status: true,
          code: 2001,
          message: 'Payment Verification Failed',
          data: orderDetails,
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async generatePaymentLink(request, CreateOrder: CreateOrder): Promise<any> {
    try {
      const checkPayment = await this.userTransactionsModel
        .findOne({
          subscriptionId: CreateOrder.subscriptionId,
          userId: request.user._id,
          finalPaidAmount: CreateOrder.finalPaidAmount,
          paymentStatus: PaymentStatusEnum.PENDING,
        })
        .exec();

      var subscriptionId = CreateOrder.subscriptionId;
      const subscription = await this.subscriptionModel
        .findOne({
          _id: subscriptionId,
        })
        .exec();
      var razorpayOrderId = '';
      var paymentStatus = '';
      var orderDetails = {};
      let random = Math.floor(Math.random() * 10000000);

      let dateOfPayment = new Date();
      let month = dateOfPayment.getMonth() + 1;
      let dt = dateOfPayment.getDate();
      let dt1: any;
      let month1: any;
      let currentYear = new Date().getFullYear();
      // let year = currentYear.toString().split('');
      // currentYear = parseInt(year[year.length - 2] + year[year.length - 1]);

      if (dt < 10) {
        dt1 = '0' + dt;
      } else {
        dt1 = dt;
      }
      if (month < 10) {
        month1 = '0' + month;
      } else {
        month1 = month;
      }

      let transactionID = 'TXN' + random + 'D' + currentYear + month1 + dt1;
      var finalAmount;
      if (checkPayment) {
        transactionID = checkPayment.transactionId;
        orderDetails = checkPayment;
      } else {
        const createdTransaction = new this.userTransactionsModel(CreateOrder);
        (createdTransaction.billNumber = ''),
          (createdTransaction.chequeNumber = '');
        (createdTransaction.chequeDate = null),
          (createdTransaction.bankName = ''),
          (createdTransaction.referenceNumber = ''),
          (createdTransaction.creditORdebitCard = '');
        createdTransaction.CardType = '';
        createdTransaction.upiId = '';
        createdTransaction.mode_transactionNumber = '';
        if (CreateOrder.couponId) {
          createdTransaction.couponId = CreateOrder.couponId;
        } else {
          createdTransaction.couponId = null;
        }

        createdTransaction.transactionId = transactionID;

        let random2 = Math.floor(Math.random() * 10000000);
        createdTransaction.referenceNumber =
          'REF' + random2 + 'D' + currentYear + month1 + dt1;
        createdTransaction.uuid = uuid.v4();

        createdTransaction.userId = request.user._id;
        createdTransaction.dateOfPayment = new Date();
        var date = new Date();
        var expiryDate = null;
        if (subscription.type == 'DAYS') {
          expiryDate = date.setMonth(date.getDay() + subscription.period);
        } else {
          expiryDate = date.setMonth(date.getMonth() + subscription.period);
        }
        createdTransaction.expiryDate = new Date(expiryDate);
        createdTransaction.createdBy = {
          _id: request.user._id,
          uuid: request.user.uuid,
          name: request.user.name,
        };
        createdTransaction.paymentType = 'ONLINE';

        createdTransaction.modeOfPayment = ModeOfPaymentEnum.PHONEPE;
        createdTransaction.paymentStatus = PaymentStatusEnum.PENDING;
        orderDetails = await createdTransaction.save();
      }

      const payload = {
        merchantId: process.env.phonePeMerId,
        transactionId: transactionID,
        merchantOrderId: 'M' + new Date().getTime(),
        amount: Number(CreateOrder.finalPaidAmount) * 100,
        instrumentType: 'MOBILE',
        instrumentReference: request.user.mobile,
        message: 'collect for ' + subscription.title + ' order',
        // email: 'amitxxx75@gmail.com',
        expiresIn: 180,
        shortName: request.user.name,
        storeId: 'store1',
        terminalId: 'terminal1',
      };
      console.log(payload)

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
        'base64'
      );

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');

      const base64Hash =
        base64Payload + '/v3/charge' + process.env.phonePeSalt;
      const hash = crypto.createHash('sha256').update(base64Hash).digest('hex');

      const checksum = hash + '###1';

      const instance = await axios
        .post(
          'https://mercury-t2.phonepe.com/v3/charge',
          {
            request: base64Payload,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-VERIFY': checksum,
              accept: 'application/json',
              'X-CALLBACK-URL':
                process.env.APIURL +
                'paymentgateway/v1/check-payment-link-status/' +
                transactionID,
              // 'X-PROVIDER-ID': 'UATPROVIDER',
            },
          }
        )
        .then(function (response) {
          console.log(response);
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
        });

      return {
        status: true,
        code: 2000,
        message: 'Order Created Successfully',
        data: { razorpayOrderId, paymentStatus, orderDetails, instance },
        // data: {  },
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async updateSubscriptionCount(subscriptionId: any) {
    return await this.subscriptionModel
      .findOneAndUpdate(
        { _id: subscriptionId },
        { $inc: { count: 1 } }, // Increment the count by 1
        { new: true } // Return the updated document
      )
      .exec();
  }
}
