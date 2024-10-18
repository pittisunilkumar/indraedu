import { User,Department,Ticket, Feedback } from '@application/shared-api';
import { InjectModel } from '@nestjs/mongoose';
import {  Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as Uuid from 'uuid';
import { FirebaseService } from './../firebase-service';

@Injectable()
export class MobileFeedbackService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Department') private department: Model<Department>,
    @InjectModel('Ticket') private ticket: Model<Ticket>,
    @InjectModel('Feedback') private feedbacks: Model<Feedback>,
    private readonly firebaseService: FirebaseService,

  ) { }

  async findAll(request) {
    let userId = request.user._id
    let courses = request.user.courses
    var date = new Date();

    let feedbackList = await this.feedbacks.find({'flags.active':true, users : userId, "replied" : { "$nin": [userId]}},
    {
      uuid :1,
      title :1
    }).lean();
    return feedbackList;
  }

  async addFeedback(request, body) {

    let user = request.user
    let userId = request.user._id
    let courses = request.user.courses
    var date = new Date();
    var feedback_id = body.feedback_id;
    var rating = body.rating;
    var message = body.message;

    if(!body.feedback_id){
      return { "status": false, "code": 2001, 'message': 'Feedback Id Is Required', 'data': {} }
    }

    if(!body.rating){
      return { "status": false, "code": 2001, 'message': 'Rating Required', 'data': {} }
    }
    if(body.rating > 5 || body.rating <= 0 ){
      return { "status": false, "code": 2001, 'message': 'Rating Error', 'data': {} }
    }

    let feedbackList = await this.feedbacks.find( { _id: feedback_id ,replied: userId },).countDocuments();

    if(feedbackList > 0 ){
      return { "status": false, "code": 2001, 'message': 'Feedback Already Done', 'data': {} }
    }
    const feedback = await this.feedbacks.findOneAndUpdate(
      { _id: feedback_id },
      {
        $addToSet: {
          "replies": {
            user_id: userId,rating: rating, message: message,createdOn: date
          },
          'replied': userId
        }
      },
      { new: true, useFindAndModify: false }
    ).exec();

    var icon ='';

        const messages =   {
          notification: {
            title: "Successfully Submitted",
            body: "Your Feedbacks successfully Submitted will give you best based on you input thank you",
            imageUrl : icon,
            notificationType : 'general'
          },
          data: {
            creatorName: 'Plato',
            title : "Successfully Submitted",
            body : "Your Feedbacks successfully Submitted will give you best based on you input thank you",
            imageUrl : icon,
            notificationType : 'general'
          }
        }
        const  registrationToken   = [];
        const options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        user.devices.forEach(element => {
          if(element.isLoggedIn == true && element.device_type != 'web'){
            registrationToken.push(element.id)
          }
        });

        const firebase = this.firebaseService.getInstance(user.organizations);

        firebase.messaging().sendToDevice(registrationToken, messages, options).then( response => {
          console.log(response);
        }).catch( error => {
            console.log(error);
        });

    return {
      "status": true,
      "code": 2000,
      "message": "Feedback Created",
      'data': feedback
    }
  }
}
