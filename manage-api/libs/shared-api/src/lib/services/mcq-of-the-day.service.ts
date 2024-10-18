import { SubscriptionInterface } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from '../dto';
import { MCQOfTheDay } from '../schema/mcq-of-the-day.schema';
//import { Course, QBank, QBankSubject, Syllabus } from '../schema';
import { Course, Question,User } from '../schema';
import { firebase } from './../../../../../config/firebase-configuration';
import { FirebaseService } from './firebase-service';

@Injectable()
export class MCQOfTheDayService {

  constructor(

    private readonly firebaseService: FirebaseService,
    @InjectModel('MCQOfTheDay') private mCQOfTheDayModel: Model<MCQOfTheDay>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Question') private questionModel: Model<Question>,
  ) { }

  async create(request) {

    let courseId = request.courseId;
    let subjectId = request.subjectId;
    let questionId = request.questionId;
    let status = request.status;

    let qbankData: any;

    qbankData = await this.mCQOfTheDayModel.find(
      {
        "courseId": courseId,
        "subjectId": subjectId,
        "questionId": questionId
      }
    ).exec();
    if (qbankData.length > 0) {

      this.mCQOfTheDayModel.findOneAndUpdate(
        // filter and push to the object
        { courseId: courseId, subjectId: subjectId, questionId: questionId },

        // filter and set to the object
        {
          $set: { "status": status },
        },

      ).exec();
       return qbankData
    } else {
      if (status == true) {
      await this.mCQOfTheDayModel.updateMany({ status: true },
          {
            $set: { "status": false },
          },
        ).exec();
        const createdSuggestedQbank = new this.mCQOfTheDayModel(request);
        const result = await createdSuggestedQbank.save();
        return result
      }

    }

  }

  async updateStatus(id, status) {
    return this.mCQOfTheDayModel.findOneAndUpdate(
      { _id: id },
      {
        "status": status.status,
      },
    ).exec();
  }

  async getMCQs(){
    //return 1;
    return this.mCQOfTheDayModel.find()
      .populate({
        path: 'courseId',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      })
      .populate({
        path: 'subjectId',
        select: {
          "uuid": 1,
          "title": 1,
          "_id": 1,
        }
      }).populate({
        path: 'questionId',
        select: {
          "uuid": 1,
          "_id": 1,
          "title": 1,
          "options":1,
          "matchRightSideOptions":1,
          "matchLeftSideOptions":1,
          "imgUrl":1,
          "type":1,
        }
      }).exec()

  }


async updateMcqOfTheDay() {

    var courses = await this.courseModel.find().exec();
    courses.map(async course => {
      var courseId = course._id;
      var length = course.syllabus.length
      var key = Math.floor(Math.random() * (length - 1) + 1)
      if (course.syllabus[key]) {
        var subjectId = course.syllabus[key];

        var questionModel = await this.checkQuestionsExistOrNot(subjectId, courseId)
        if (questionModel) {

        } else {
          var subjectId = course.syllabus[Math.floor(Math.random() * (length - 1) + 1)];
          questionModel = await this.checkQuestionsExistOrNot(subjectId, courseId)
        }
        if (questionModel) {
          var questionId = questionModel._id;
          let status = true;
          var request = {
            courseId: courseId,
            questionId: questionId,
            subjectId: subjectId,
            status: status,
            createdOn: new Date(),
            createdBy: {
              uuid: "f4022395-51f8-4801-ab35-124db1a76e52",
              name: "Plato"
            }
          };
          await this.mCQOfTheDayModel.updateMany({ courseId: courseId, status: true },
            {
              $set: { "status": false },
            },
          ).exec();
          const createdSuggestedQbank = new this.mCQOfTheDayModel(request);
          const result = await createdSuggestedQbank.save();
        }
      }
    })
    return '';
    return [];

  }

  async checkQuestionsExistOrNot(syllabus, courseId) {
    var question = await this.questionModel.findOne({ syllabus: syllabus,mathType:'no','flags.active':true }).exec();

    if (question) {
      var existOrNot = await this.mCQOfTheDayModel.findOne(
        {
          "courseId": courseId,
          "subjectId": syllabus,
          "questionId": question._id
        }
      ).exec();
      if (existOrNot) {
        var question = await this.questionModel.findOne({ syllabus: syllabus,mathType:'no','flags.active':true }).exec();
        if (question) {
          return question;
        }
        return null;
      } else {

        return question;
      }
    } else {
      return null;
    }

  }

  async sendPushNotificationMCQOfTheOfDay() {

    const mcqOfTheDay = await this.mCQOfTheDayModel.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          "from": "questions",
          "let": { "questionId": "$questionId" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": ["$_id", "$$questionId"] } } }
          ],
          "as": "questions"
        }
      },
      { $unwind: "$questions" },
    ]).exec();
    mcqOfTheDay.map(async mcq => {
      var data = {
        title: "MCQ Of The Day",
        body: mcq.questions.title.replace(/<\/?[^>]+(>|$)/g, ""),
        icon: mcq.questions.imgUrl,
        notificationType: "courses"
      };
      var shortTitle = "MCQ OF the Day";
      var branchUrl = '';
      try {
        shortTitle  = mcq.questions.shortTitle
      
        let branchPayload = {
          "branch_key": "key_live_jj8zAGPOliW8euvIDwQWUemjssfsR1yK",
          "channel": "plato",
          "feature": "mcq",
          "campaign": "MCQ OF the Day",
          "stage": "MCQ of the day",
          "tags": ["questions"],
          "data": {
            "$canonical_identifier": "mcq",
            "$og_title": shortTitle,
            "$og_description": shortTitle,
            "questionId": mcq.questions._id
          }
        }
        var request = require('request')
        var optionss = {
          'method': 'POST',
          'url': 'https://api2.branch.io/v1/url',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(branchPayload)
        };
        var url = ''
        const result = new Promise((resolve, reject) => {
          request(optionss, function(error, response) {
            if (error) return reject(error);
            return resolve(JSON.parse(response.body));
          });
        })
        var fromapi = await result;
        branchUrl = fromapi['url'];
      }catch (e) {
        shortTitle = "question Test";
      }
      const message = {
        
        data: {
          creatorName: 'Plato',
          title: data.title,
          body: data.body,
          color: '#2eb5dd',
          imagePath: data.icon,
          branch: branchUrl ? branchUrl : ''
        }
      }
      const registrationToken = [];
      const userIds = [];
      const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };

      var users = await this.userModel.find({
        "devices.isLoggedIn": true,
        'flags.isActive': true, 'courses':mcq.courseId
      }, { uuid: 1, devices: 1 }).exec().then(user => {
        user.map(details => {
          details.devices.forEach(element => {
            if (element.isLoggedIn == true) {
              registrationToken.push(element.id)
            }
          });
        })
      })

      if (registrationToken.length > 0) {
        const chunkSize = 999;
        for (let i = 0; i < registrationToken.length; i += chunkSize) {
          const chunk = registrationToken.slice(i, i + chunkSize);
          firebase.messaging().sendToDevice(chunk, message, options).then(response => {
            console.log(response);
          }).catch(error => {
            console.log(error);
          });
        }
      }
    });
  }



}