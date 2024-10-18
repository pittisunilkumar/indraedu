import { environment } from 'apps/student-api/src/environments/environment';
import { Injectable } from '@nestjs/common';
import {
  ModeOfPaymentEnum,
  PaymentStatusEnum,
  TagsInterface,
} from '@application/api-interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrder } from '../dto/create-order.dto';
import { UserTransactions } from '../schema/user-transactions.schema';
import { Coupon } from '../schema/coupon.schema';
import { Subscription } from '../schema/subscription.schema';
import { User } from '../schema/user.schema';
import * as mongoose from 'mongoose';
import * as uuid from 'uuid';
import { CommonFunctions } from '../helpers/functions';
import { Organization, PaymentHookResponse, SmsTemplates } from '../schema';
@Injectable()
export class PaymentGatewayService {
  constructor(
    @InjectModel('UserTransactions')
    private userTransactionsModel: Model<UserTransactions>,
    @InjectModel('Coupon') private couponsModel: Model<Coupon>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('Organization') private organazationModel: Model<Organization>,
    @InjectModel('SmsTemplate') private smsTemplateModel: Model<SmsTemplates>,
    @InjectModel('PaymentHookResponse')
    private paymentHookResponse: Model<PaymentHookResponse>
  ) {}


  async getOrganazationDetailsWithUser(request){

    var application = request.user.organizations;
    return  await this.organazationModel
      .findOne({ _id: application })
      .sort('order')
      .exec();
  }

  async getOrganazationDetails(body: { razorpayOrderId: any; }){

    var orderId = body.razorpayOrderId;
    const orderDetails = await this.userTransactionsModel
      .findOne({
        razorpayOrderId: orderId,
      })
    let UserData = await this.userModel.findOne({
      _id: orderDetails.userId,
    });
    var application = UserData.organizations;
    return  await this.organazationModel
      .findOne({ _id: application })
      .sort('order')
      .exec();
  }

  async generateReferenceId(
    request,
    razorpayInstance,
    CreateOrder: CreateOrder
  ): Promise<any> {
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
      if (checkPayment) {
        razorpayOrderId = checkPayment.razorpayOrderId;
        paymentStatus = checkPayment.paymentStatus;
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

        createdTransaction.transactionId =
          'TXN' + random + 'D' + currentYear + month1 + dt1;

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

        createdTransaction.modeOfPayment = ModeOfPaymentEnum.RAZORPAY;
        createdTransaction.paymentStatus = PaymentStatusEnum.PENDING;

        var finalAmount = createdTransaction.finalPaidAmount;
        var options = {
          amount: Number(finalAmount) * 100, // amount in the smallest currency unit
          currency: 'INR',
          payment_capture: '1',
          receipt: createdTransaction.referenceNumber,
          notes: {
            transactionId: createdTransaction.transactionId,
            subscriptionName: subscription.title,
            subscriptiondescription: subscription.description,
            subscriptionId: subscription.uuid,
          },
        };
        var data = await razorpayInstance.orders.create(options, function (
          err,
          order
        ) {
          // console.log(order);
          createdTransaction.razorpayOrderId = order.id;
          razorpayOrderId = order.id;
        });
        orderDetails = await createdTransaction.save();
        paymentStatus = createdTransaction.paymentStatus;
      }

      return {
        status: true,
        code: 2000,
        message: 'Order Created Successfully',
        data: { razorpayOrderId, paymentStatus, orderDetails },
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async updateRazorpayPaymentStatus(
    request,
    razorpayInstance,
    body
  ): Promise<any> {
    var orderId = body.razorpayOrderId;
    var paymentId = body.razorpayPaymentId;
    var signature = body.razorpaySignature;
    try {
      const orderDetails = await this.userTransactionsModel
        .findOne({
          razorpayOrderId: body.razorpayOrderId,
          userId: request.user._id,
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

      var crypto = require('crypto');
      // var paymentList = await razorpayInstance.orders.fetchPayments(orderId);
      var paymentInfo = await razorpayInstance.payments.fetch(paymentId);
      // console.log(paymentInfo)
      // return paymentInfo;
      var generated_signature = orderId + '|' + paymentId;
      var expectedSignature = crypto
        .createHmac('SHA256', environment.razorpaySecret)
        .update(generated_signature)
        .digest('hex');
      if (expectedSignature === signature) {
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
        orderDetails.authorised_status = paymentInfo.status;
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
        let UserData = await this.userModel.findOne({ _id: request.user._id });
        // let UserData    = userDetails
        let subscriptionData = await this.subscriptionModel.findOne({
          _id: orderDetails.subscriptionId,
        });
        this.updateSubscriptionCount(orderDetails.subscriptionId);

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
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        // sms module
        var application = request.headers.application;

        if (application) {
          var data = await this.organazationModel
            .findOne({ _id: application })
            .sort('order')
            .exec();

          var template = await this.smsTemplateModel.findOne({
            key: 'PAYMENT_RECEIPT',
            organization: application,
          });

          if (template) {
            let newString = template.template
              .replace(/\[PLAN\]/g, subscriptionData.title)
              .replace(/\[VALIDITY\]/g, subscriptionDate)
              .replace(/\[RECEIPT_URL\]/g, orderDetails._id);

            var message = encodeURIComponent(newString);

            var sendMessage = await CommonFunctions.SendMessage(
              data.workingkey,
              data.senderId,
              UserData.mobile,
              message
            );
          }
        }
        return {
          status: true,
          code: 2000,
          message: 'Payment Verified Successfully',
          data: orderDetails,
        };
      } else {
        orderDetails.paymentStatus = PaymentStatusEnum.FAILED;
        orderDetails.paymentInfo = paymentInfo;
        orderDetails.authorised_status = paymentInfo.status;
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
  async checkUpdateRazorpayPaymentStatus(
    request,
    razorpayInstance,
    body
  ): Promise<any> {
    var orderId = body.razorpayOrderId;
    try {
      const orderDetails = await this.userTransactionsModel
        .findOne({
          razorpayOrderId: body.razorpayOrderId,
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

      var paymentList = await razorpayInstance.orders.fetchPayments(orderId);

      var message = '';
      var paymentInfo = '';
      var paymentStatus = false;
      if (paymentList.count > 0) {
        // console.log(paymentList);
        paymentList.items.forEach(async (payment) => {
          if (payment.status == 'captured' && payment.captured) {
            paymentInfo = payment;
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
            orderDetails.authorised_status = payment.status;
            orderDetails.razorPayPaymentId = payment.id;
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

            this.updateSubscriptionCount(orderDetails.subscriptionId);

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
            var application = request.headers.application;

            if (application) {
              var data = await this.organazationModel
                .findOne({ _id: application })
                .sort('order')
                .exec();

              var template = await this.smsTemplateModel.findOne({
                key: 'PAYMENT_RECEIPT',
                organization: application,
              });

              if (template) {
                let newString = template.template
                  .replace(/\[PLAN\]/g, subscriptionData.title)
                  .replace(/\[VALIDITY\]/g, subscriptionDate)
                  .replace(/\[RECEIPT_URL\]/g, orderDetails._id);

                var message = encodeURIComponent(newString);

                var sendMessage = await CommonFunctions.SendMessage(
                  data.workingkey,
                  data.senderId,
                  UserData.mobile,
                  message
                );
              }
            }
          }
        });
        if (paymentStatus) {
          return {
            status: true,
            code: 2000,
            message: 'Payment Verified Successfully',
            data: orderDetails,
          };
        }
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
      if (paymentStatus == false) {
        orderDetails.paymentStatus = PaymentStatusEnum.FAILED;
        orderDetails.paymentMessage = 'Payment Failed';
        orderDetails.save();
        return {
          status: true,
          code: 2001,
          message: 'Payment  Failed',
          data: orderDetails,
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  async checkUpdateRazorpayPaymentfromGraphy(request, body): Promise<any> {
    let paymentHook = new this.paymentHookResponse();
    paymentHook.body = body;
    paymentHook.activated = false;
    paymentHook.createdOn = new Date();
    await paymentHook.save();

    let pendingPaymentLinks = await this.paymentHookResponse
      .find({ activated: false })
      .exec()
      .then((res) => {
        res.map(async (payment) => {
          let paymentBody = payment.body;
          if (paymentBody) {
            let payload = paymentBody;
            let name = payload.Name;
            let amount = Number(payload.Amount.replace('₹', ''));
            let mobile = Number(payload.Mobile.replace('+91', ''));
            let email = payload.Email;
            let description = null;

            payload.Items.forEach((element) => {
              description = element.title;
            });

            let subscriptionData = await this.subscriptionModel
              .findOne({ title: description + ' MASTERADVICE' })
              .exec();

            if (subscriptionData) {
              let users = await this.userModel.findOne({ mobile }).exec();
              if (!users) {
                const users = new this.userModel();
                users.mobile = mobile;
                users.uuid = uuid.v4();
                users.email = email;
                users.name = name;
                users.otp = '';
                users.expiration_time = new Date();
                users.flags = { isActive: true };
                users.createdOn = new Date();
                users.courses = Object(subscriptionData.courses);
                users.save();
              } else {
                users.courses = Object(subscriptionData.courses);
                users.save();
              }

              const checkPayment = await this.userTransactionsModel
                .findOne({ razorpayOrderId: paymentBody['Order Id'] })
                .exec();

              var date = new Date();
              var expiryDate = null;
              if (subscriptionData.type == 'DAYS') {
                expiryDate = date.setMonth(
                  date.getDay() + subscriptionData.period
                );
              } else {
                expiryDate = date.setMonth(
                  date.getMonth() + subscriptionData.period
                );
              }
              if (!checkPayment) {
                const createdTransaction = new this.userTransactionsModel();
                createdTransaction.CardType = '';
                createdTransaction.upiId = '';
                createdTransaction.mode_transactionNumber = '';
                createdTransaction.couponId = null;
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

                createdTransaction.transactionId =
                  'TXN' + random + 'D' + currentYear + month1 + dt1;

                let random2 = Math.floor(Math.random() * 10000000);
                createdTransaction.referenceNumber =
                  'REF' + random2 + 'D' + currentYear + month1 + dt1;
                createdTransaction.uuid = uuid.v4();

                createdTransaction.userId = users._id;
                createdTransaction.dateOfPayment = new Date();

                createdTransaction.expiryDate = new Date(expiryDate);
                createdTransaction.createdBy = {
                  _id: users._id,
                  uuid: users.uuid,
                  name: users.name,
                };
                createdTransaction.paymentType = 'ONLINE';

                createdTransaction.modeOfPayment =
                  ModeOfPaymentEnum.MasterAdvise;
                createdTransaction.paymentStatus = PaymentStatusEnum.SUCCESS;
                createdTransaction.paymentStatus = PaymentStatusEnum.SUCCESS;
                createdTransaction.finalPaidAmount = amount;
                createdTransaction.subscriptionId = subscriptionData._id;
                createdTransaction.actualPrice = amount;
                createdTransaction.discountPrice = 0;
                createdTransaction.expiryDate = new Date(expiryDate);
                createdTransaction.paymentDate = new Date();
                createdTransaction.paymentStatus = PaymentStatusEnum.SUCCESS;
                createdTransaction.paymentInfo = payload;
                createdTransaction.razorpayOrderId = paymentBody['Order Id'];
                createdTransaction.authorised_status = 'captured';
                createdTransaction.razorPayPaymentId = '';
                createdTransaction.paymentMessage =
                  'Payment Captured Successfully';
                await createdTransaction.save();
                await this.assignSubscriptionToUser(users, subscriptionData);

                console.log('subscription assigned');
              }
              console.log('Transaction Exist');
            }

            payment.activated = true;
            payment.activatedOn = new Date();
            payment.save();
          }
        });
      });

    return {
      status: true,
      code: 2000,
      message: 'Payment Event Triggred',
      data: {},
    };
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
