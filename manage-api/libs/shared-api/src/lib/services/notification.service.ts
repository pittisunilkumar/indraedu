import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDto } from './../dto/notification.dto';
import * as Uuid from 'uuid';
import {
  User,
  Notifications,
  Subscription,
  UserNotifications,
  Course,
  Organization,
} from '../schema';

import { FirebaseService } from './firebase-service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Organization') private organazationModel: Model<Organization>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Notifications')
    private notificationsModel: Model<Notifications>,
    @InjectModel('Subscription') private subscriptionModel: Model<Subscription>,
    @InjectModel('UserNotifications')
    private userNotificationsModel: Model<UserNotifications>
  ) {}

  async sendNotification(body:any, employee:any): Promise<any> {
    try { 

      var  instanceName = 'plato-online';
    
      if(body.courses.length > 0){
        const empCourses = await this.courseModel.findOne({_id:{$in:body.courses}})
        const empOrganazation = await this.organazationModel.findOne({_id:{$in:empCourses.organizations}}).exec()

        if(empOrganazation.firebase){
          instanceName = empOrganazation.firebase;
        }
      }else{
        const empOrganazation = await this.organazationModel.findOne({_id:{$in:employee.organizations}}).exec()
        if(empOrganazation.firebase){
          instanceName = empOrganazation.firebase;
        }
      }

      
      const firebase = this.firebaseService.getInstance(instanceName);

      var icon = '';
      if (body.icon) {
        icon = body.icon;
      }
      const message = {
        data: {
          creatorName: instanceName,
          title: body.title,
          body: body.message,
          imageUrl: icon,
          branch: body.branchUrl,
        },
        // notification: {
        //   title: body.title,
        //   body: body.message,
        //   imageUrl: icon,
        //   branch: body.branchUrl,
        // },
      };
      const registrationToken = [];
      const userIds = [];
      const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24,
      };
      var payload = body;
      payload.uuid = Uuid.v4();
      if (body.notificationType == 'allUsers') {
        var users = await this.userModel
          .find(
            { 'devices.isLoggedIn': true, 'flags.isActive': true },
            { uuid: 1, devices: 1 }
          )
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
              userIds.push(details._id);
            });
            payload.users = userIds;
          });
      } else if (body.notificationType == 'subscriptions') {
        var subscriptions = body.subscriptions;
        var users = await this.userModel
          .find(
            {
              'devices.isLoggedIn': true,
              'flags.isActive': true,
              'subscriptions.subscription_id': subscriptions,
            },
            { uuid: 1, devices: 1 }
          )
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
              userIds.push(details._id);
            });
            payload.users = userIds;
          });
      } else if (body.notificationType == 'selectedUsers') {
        var selectedUsers = body.selectedUsers;
        var users = await this.userModel
          .find(
            {
              'devices.isLoggedIn': true,
              _id: selectedUsers,
              'flags.isActive': true,
            },
            { uuid: 1, devices: 1 }
          )
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
              userIds.push(details._id);
            });
            payload.users = userIds;
          });
      } else if (body.notificationType == 'userFile') {
        var userFile = body.userFile;
        var users = await this.userModel
          .find(
            {
              'devices.isLoggedIn': true,
              mobile: userFile,
              'flags.isActive': true,
            },
            { uuid: 1, devices: 1 }
          )
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
              userIds.push(details._id);
            });
            payload.users = userIds;
          });
      } else if (body.notificationType == 'courses') {
        var courses = body.courses;
        var users = await this.userModel
          .find(
            {
              'devices.isLoggedIn': true,
              courses: courses,
              'flags.isActive': true,
            },
            { uuid: 1, devices: 1 }
          )
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
              userIds.push(details._id);
            });
            payload.users = userIds;
          });
      }
      if (registrationToken.length > 0) {
        const chunkSize = 999;
        for (let i = 0; i < registrationToken.length; i += chunkSize) {
          const chunk = registrationToken.slice(i, i + chunkSize);
          firebase
            .messaging()
            .sendToDevice(chunk, message, options)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        var notification = new this.notificationsModel();
        notification.users = payload.users;
        notification.uuid = Uuid.v4();
        notification.title = payload.title;
        notification.message = payload.message;
        notification.branchUrl = body.branchUrl;
        notification.courses = body.courses;
        notification.subscriptions = body.subscriptions;
        notification.icon = payload.icon;
        notification.notificationType = payload.notificationType;
        notification.scheduleDate = payload.scheduleDate;
        notification.createdBy = payload.createdBy;
        notification.createdOn = payload.createdOn;
        notification.sendStatus = 1;
        var result = await notification.save();
        var today = new Date();
        // if(body.campaign =="timeTable"){
        var notificationId = result._id;

        userIds.forEach((element) => {
          var userNotification = new this.userNotificationsModel();
          userNotification.userId = Object(element);
          userNotification.uuid = Uuid.v4();
          userNotification.notificationId = notificationId;
          userNotification.createdOn = today;
          userNotification.readStatus = 0;
          userNotification.save();
        });
        return '';
        // }
      }
      return '';
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findAll(employee) {
    const courseListIds = [];
    const empCourses = await this.courseModel.find({organizations:{$in:employee.organizations}},{_id:true})
    empCourses.forEach(element => {
      courseListIds.push(element._id)
    });
      return this.notificationsModel.aggregate([
      {
        $match: { // Filter users based on organizations
          "courses": { $in: courseListIds }
        }
      },
      { $lookup: {from: 'courses', localField: 'courses', foreignField: '_id', as: 'courses'} },
      {
        $project: {
          title: 1,
          message: 1,
          notificationType: 1,
          branchUrl: 1,
          createdBy: 1,
          createdOn: 1,
          icon:1,
          usersCount: { $size: '$users' },
          "courses.title":1
        },
      },
      { $sort: { createdOn: -1 } },
    ]);
  }

  async scheduleNotification(body): Promise<any> {
    try {
      var notificationData = body.notificationData;
      var payload = body;
      const userIds = [];

      var today = new Date();
      payload.uuid = Uuid.v4();
      var courses = body.courses;
      var users = await this.userModel
        .find(
          {
            'devices.isLoggedIn': true,
            courses: courses,
            'flags.isActive': true,
          },
          { uuid: 1, devices: 1 }
        )
        .exec()
        .then((user) => {
          // var users = await this.userModel.find({ mobile :9876543210}, { uuid: 1, devices: 1 }).exec().then(user => {
          user.map((details) => {
            userIds.push(details._id);
          });
          payload.users = userIds;
        });
      notificationData.forEach((element) => {
        var notification = new this.notificationsModel();
        notification.users = payload.users;
        notification.uuid = Uuid.v4();
        notification.title = element.title;
        notification.message = element.message;
        notification.courses = body.courses;
        notification.icon = element.icon;
        notification.notificationType = 'courses';
        notification.scheduleDate = element.scheduleDate;
        notification.createdBy = element.createdBy;
        notification.createdOn = element.createdOn;
        notification.sendStatus = 0;
        notification.save();
      });
      return '';
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async sendScheduleNotification(body): Promise<any> {
    var  instanceName = 'plato-online';    
    const firebase = this.firebaseService.getInstance(instanceName);
    try {
      var notificationData = body.notificationData;
      const userIds = [];

      var notifiations = await this.notificationsModel
        .find({ sendStatus: 0, scheduleDate: { $lte: new Date() } })
        .exec();
      notifiations.forEach(async (element) => {
        const empCourses = await this.courseModel.findOne({_id:{$in:element.courses}})

        if(empCourses){
          const empOrganazation = await this.organazationModel.findOne({_id:{$in:empCourses.organizations}}).exec()
          if(empOrganazation.firebase){
            instanceName = empOrganazation.firebase;
          }
        }
       
        var registrationToken = [];
        await this.userModel
          .find({ _id: element.users }, { uuid: 1, devices: 1 })
          .exec()
          .then((user) => {
            user.map((details) => {
              details.devices.forEach((element) => {
                if (element.isLoggedIn == true) {
                  registrationToken.push(element.id);
                }
              });
            });
          });
        const message = {
          data: {
            creatorName: 'Plato',
            title: element.title,
            body: element.message,
            imageUrl: element.icon,
          },
        };
        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        };

        if (registrationToken.length > 0) {
          const chunkSize = 999;
          for (let i = 0; i < registrationToken.length; i += chunkSize) {
            const chunk = registrationToken.slice(i, i + chunkSize);
            firebase
              .messaging()
              .sendToDevice(chunk, message, options)
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
        element.sendStatus = 1;
        element.save();
      });
      // console.log(notifiations)
      return '';
    } catch (err) {
      return Promise.reject(err);
    }
  }
  //
  async sendAlertExpiredSubscription(body): Promise<any> {

    var  instanceName = 'plato-online';    


    var date = new Date();
    const dateandtime = require('date-and-time');
    var firstweek =
      new Date(date.setDate(date.getDate()) - 1).getTime() +
      5.5 * 60 * 60 * 1000;
    var lastweek =
      new Date(date.setDate(date.getDate() - 7)).getTime() +
      5.5 * 60 * 60 * 1000;
    let weekFromDate = new Date(firstweek).setUTCHours(0, 0, 0, 0);
    let weekToDate = new Date(lastweek).setUTCHours(23, 59, 59, 999);

    let SubscribedUsers = await this.userModel
      .find(
        {
          'subscriptions.expiry_date': {
            $gte: new Date(weekToDate),
            $lte: new Date(weekFromDate),
          },
          // 'mobile':{ $in:[9533402327,8978598238]},
          'devices.0': { $exists: true },
        },
        {
          mobile: 1,
          email: 1,
          name: 1,
          subscriptions: 1,
          accessToken: 1,
          devices: 1,
        }
      )
      .exec();

    console.log(SubscribedUsers.length);
    SubscribedUsers.forEach(async (element) => {


      const empCourses = await this.courseModel.findOne({_id:{$in:element.courses}})

      if(empCourses){
        const empOrganazation = await this.organazationModel.findOne({_id:{$in:empCourses.organizations}}).exec()
        if(empOrganazation.firebase){
          instanceName = empOrganazation.firebase;
        }
      }
      

      const firebase = this.firebaseService.getInstance(instanceName);

      var registrationToken = null;
      element.devices.forEach((element) => {
        if (element.isLoggedIn == true) {
          registrationToken = element.id;
        }
      });
      var name = '';
      if (element.name) {
        name = element.name;
      } else {
        name = 'User';
      }
      element.subscriptions.forEach(async (subscription) => {
        if (
          new Date(subscription.expiry_date) < new Date(weekFromDate) &&
          new Date(subscription.expiry_date) > new Date(weekToDate)
        ) {
          var subscriptionDetails = await this.subscriptionModel
            .findOne({ _id: subscription.subscription_id })
            .exec();

          if (subscriptionDetails) {
            var title = subscriptionDetails.title + ' is expired..!!🚨';
            var messageTxt =
              'Dear ' +
              name +
              ' , hope you are enjoying Plato online app . Your subscription Expired on ' +
              dateandtime.format(
                new Date(subscription.expiry_date),
                'YYYY-MM-DD'
              ) +
              '. Kindly resubscribe for preparing uninterrupted . Call 7851925940 for further details .';
            const message = {
              data: {
                creatorName: 'Plato',
                title: title,
                body: messageTxt,
                imageUrl:
                  '',
              },
            };
            const options = {
              priority: 'high',
              timeToLive: 60 * 60 * 24,
            };

            if (registrationToken) {
              await firebase
                .messaging()
                .sendToDevice(registrationToken, message, options)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        }
      });
    });
    return [];
  }

  async sendSubscriptionExpireAlert(body): Promise<any> {


    var  instanceName = 'plato-online';    
    var date = new Date();
    const dateandtime = require('date-and-time');
    var firstweek =
      new Date(date.setDate(date.getDate())).getTime() + 5.5 * 60 * 60 * 1000;
    var lastweek =
      new Date(date.setDate(date.getDate() + 6)).getTime() +
      5.5 * 60 * 60 * 1000;
    let weekFromDate = new Date(firstweek).setUTCHours(0, 0, 0, 0);
    let weekToDate = new Date(lastweek).setUTCHours(23, 59, 59, 999);

    let SubscribedUsers = await this.userModel
      .find(
        {
          'subscriptions.expiry_date': {
            $gte: new Date(weekFromDate),
            $lte: new Date(weekToDate),
          },
          // 'mobile':{ $in:[9533402327,8978598238]},
          'devices.0': { $exists: true },
        },
        {
          mobile: 1,
          email: 1,
          name: 1,
          subscriptions: 1,
          accessToken: 1,
          devices: 1,
        }
      )
      .exec();

    console.log(SubscribedUsers.length);

    SubscribedUsers.forEach(async (element) => {


      const empCourses = await this.courseModel.findOne({_id:{$in:element.courses}})

      if(empCourses){
        const empOrganazation = await this.organazationModel.findOne({_id:{$in:empCourses.organizations}}).exec()
        if(empOrganazation.firebase){
          instanceName = empOrganazation.firebase;
        }
      }
      const firebase = this.firebaseService.getInstance(instanceName);

      var registrationToken = null;
      element.devices.forEach((element) => {
        if (element.isLoggedIn == true) {
          registrationToken = element.id;
        }
      });
      var name = '';
      if (element.name) {
        name = element.name;
      } else {
        name = 'User';
      }
      element.subscriptions.forEach(async (subscription) => {
        if (
          new Date(subscription.expiry_date) > new Date(weekFromDate) &&
          new Date(subscription.expiry_date) < new Date(weekToDate)
        ) {
          var subscriptionDetails = await this.subscriptionModel
            .findOne({ _id: subscription.subscription_id })
            .exec();

          if (subscriptionDetails) {
            // var title = subscriptionDetails.title + ' going to ends';
            const date2 = new Date(subscription.expiry_date);
            const date1 = new Date(weekFromDate);
            const day = date2.getDate() - date1.getDate();
            var days = day + ' Days';
            var title =
              subscriptionDetails.title +
              ' going to expire in  ' +
              days +
              '  .❗❗⏰';

            var messageTxt =
              'Dear ' +
              name +
              ' , hope you are enjoying Plato online app . Your subscription ends on ' +
              dateandtime.format(
                new Date(subscription.expiry_date),
                'YYYY-MM-DD'
              ) +
              '( ' +
              days +
              '). Kindly resubscribe for preparing uninterrupted . Call 7851925940 for further details .';

            const message = {
              data: {
                creatorName: 'Plato',
                title: title,
                body: messageTxt,
                imageUrl:
                  '',
              },
            };
            const options = {
              priority: 'high',
              timeToLive: 60 * 60 * 24,
            };
            if (registrationToken) {
              await firebase
                .messaging()
                .sendToDevice(registrationToken, message, options)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        }
      });
    });
    return [];
  }

  async getNotificationsDateFilter(transactionsInterface) {
    console.log('transactionsInterface', transactionsInterface);

    // let fromDate = transactionsInterface.fromDate;
    // let toDate = transactionsInterface.toDate;

    let fromDate =
      new Date(transactionsInterface.fromDate).getTime() + 5.5 * 60 * 60 * 1000;
    let toDate = new Date(transactionsInterface.toDate);
    let newFromDate = new Date(fromDate).setUTCHours(0, 0, 0, 0);
    let newToDate = new Date(toDate).setUTCHours(23, 59, 59, 999);
    console.log('fromDate', new Date(newFromDate).toISOString().toString());
    console.log('toDate', new Date(newToDate).toISOString().toString());
    return this.notificationsModel
      .find({
        createdOn: {
          $gte: new Date(newFromDate).toISOString().toString(),
          $lte: new Date(newToDate).toISOString().toString(),
        },
      })
      .populate({
        path: 'batch',
        model: 'Course',
        select: {
          title: 1,
          _id: 1,
          uuid: 1,
        },
      })
      .sort({ createdOn: 'DESC' })
      .exec();
  }
  async deleteByUuid(id: string) {
    let notification = await this.notificationsModel
      .findOneAndDelete({ _id: id })
      .exec();
    await this.userNotificationsModel.deleteMany({ notificationId: id }).exec();
    return notification;
  }
  async getNotificationById(id: string) {
    return this.notificationsModel
      .findById({ _id: id })
      .populate({
        path: 'batch',
        model: 'Course',
        select: {
          title: 1,
          _id: 1,
          uuid: 1,
        },
      })
      .populate({
        path: 'users',
        model: 'User',
        select: {
          name: 1,
          mobile: 1,
          _id: 1,
          uuid: 1,
        },
      })
      .sort({ createdOn: 'DESC' });
  }
}
